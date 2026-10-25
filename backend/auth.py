import os
import re
import sqlite3
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Header, status
from pydantic import BaseModel, EmailStr, Field

# Database path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "kneenova.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def hash_password(password: str, salt: Optional[str] = None):
    if not salt:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        100_000,
    )
    return key.hex(), salt


def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        100_000,
    )
    return secrets.compare_digest(key.hex(), stored_hash)


def init_db():
    conn = get_db()
    with conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                role TEXT DEFAULT 'Clinician / Researcher',
                institution TEXT DEFAULT 'KneeNova Medical AI Lab',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token TEXT UNIQUE NOT NULL,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)")

        # Seed initial demo clinician if empty
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = ?", ("demo@kneenova.ai",))
        if not cursor.fetchone():
            pwd_hash, salt = hash_password("Password123!")
            cursor.execute("""
                INSERT INTO users (name, email, password_hash, salt, role, institution)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                "Dr. Zameer Shaikh",
                "demo@kneenova.ai",
                pwd_hash,
                salt,
                "Orthopedic Radiologist",
                "KneeNova Medical AI Lab",
            ))
    conn.close()


# Initialize database schema immediately on load
init_db()

router = APIRouter(prefix="/auth", tags=["Authentication"])


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=120)
    password: str = Field(..., min_length=6, max_length=100)
    institution: Optional[str] = "KneeNova Medical"
    role: Optional[str] = "Clinician / Researcher"


class LoginRequest(BaseModel):
    email: str
    password: str


def create_session(user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(days=30)
    conn = get_db()
    with conn:
        conn.execute(
            "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
            (token, user_id, expires_at.isoformat()),
        )
    conn.close()
    return token


def get_user_from_token(token: str):
    if not token:
        return None
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.id, u.name, u.email, u.role, u.institution, u.created_at, s.expires_at
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ?
    """, (token,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    # Check expiration
    expires_at_str = row["expires_at"]
    try:
        expires_at = datetime.fromisoformat(expires_at_str)
        if datetime.utcnow() > expires_at:
            return None
    except Exception:
        pass

    return {
        "id": row["id"],
        "name": row["name"],
        "email": row["email"],
        "role": row["role"],
        "institution": row["institution"],
        "created_at": row["created_at"],
    }


@router.post("/register")
def register(payload: RegisterRequest):
    email_clean = payload.email.strip().lower()
    name_clean = payload.name.strip()

    # Basic email format validation
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email_clean):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address.",
        )

    if len(payload.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long.",
        )

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (email_clean,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists.",
        )

    pwd_hash, salt = hash_password(payload.password)
    institution_clean = (payload.institution or "KneeNova Medical").strip()
    role_clean = (payload.role or "Clinician / Researcher").strip()

    with conn:
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, salt, role, institution)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (name_clean, email_clean, pwd_hash, salt, role_clean, institution_clean))
        user_id = cursor.lastrowid
    conn.close()

    token = create_session(user_id)
    user_data = {
        "id": user_id,
        "name": name_clean,
        "email": email_clean,
        "role": role_clean,
        "institution": institution_clean,
    }

    return {
        "status": "success",
        "message": "Account created successfully.",
        "token": token,
        "user": user_data,
    }


@router.post("/login")
def login(payload: LoginRequest):
    email_clean = payload.email.strip().lower()
    password = payload.password

    if not email_clean or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide both email and password.",
        )

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, email, password_hash, salt, role, institution FROM users WHERE email = ?",
        (email_clean,),
    )
    user = cursor.fetchone()
    conn.close()

    if not user or not verify_password(password, user["password_hash"], user["salt"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_session(user["id"])
    user_data = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "institution": user["institution"],
    }

    return {
        "status": "success",
        "message": "Signed in successfully.",
        "token": token,
        "user": user_data,
    }


@router.get("/me")
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token.",
        )

    token = authorization.split("Bearer ", 1)[1].strip()
    user = get_user_from_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or is invalid. Please sign in again.",
        )

    return {
        "status": "success",
        "user": user,
    }


@router.post("/logout")
def logout(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ", 1)[1].strip()
        conn = get_db()
        with conn:
            conn.execute("DELETE FROM sessions WHERE token = ?", (token,))
        conn.close()

    return {"status": "success", "message": "Signed out."}
