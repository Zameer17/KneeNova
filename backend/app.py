import io
import os
import zipfile
import tempfile
from collections import defaultdict

import cv2
import numpy as np
import pydicom
import torch
import torch.nn as nn
import timm

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "kneenova_final_best.pth"
)

DEVICE = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)

TARGETS = [
    "ACL",
    "MCL",
    "Medial Meniscus",
    "Lateral Meniscus",
    "Medial OA",
    "Lateral OA",
    "PF OA",
    "Effusion",
    "Synovitis",
    "Baker's",
    "Contusion",
    "Fracture",
]


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="KneeNova API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# MODEL
# ============================================================

class KneeNovaFinal(nn.Module):

    def __init__(self, num_classes=12):
        super().__init__()

        # Same architecture as the final trained model.
        # We do not download ImageNet weights here because
        # the checkpoint already contains the trained encoder.
        self.encoder = timm.create_model(
            "efficientnet_b0",
            pretrained=False,
            num_classes=0,
            global_pool="avg",
        )

        self.classifier = nn.Sequential(
            nn.Linear(1280, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes),
        )

    def forward(self, x):

        batch_size, num_slices, channels, height, width = x.shape

        x = x.view(
            batch_size * num_slices,
            channels,
            height,
            width,
        )

        features = self.encoder(x)

        features = features.view(
            batch_size,
            num_slices,
            -1,
        )

        study_features = features.mean(
            dim=1
        )

        return self.classifier(
            study_features
        )


if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"KneeNova checkpoint not found:\n{MODEL_PATH}"
    )


model = KneeNovaFinal(
    num_classes=len(TARGETS)
).to(DEVICE)


checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE,
    weights_only=False,
)

model.load_state_dict(
    checkpoint["model_state"]
)

model.eval()


# ============================================================
# DICOM HELPERS
# ============================================================

def dicom_plane(ds):
    """
    Estimate anatomical plane from ImageOrientationPatient.

    DICOM:
      sagittal -> normal mostly X
      coronal  -> normal mostly Y
      axial    -> normal mostly Z
    """

    try:
        orientation = [
            float(value)
            for value in ds.ImageOrientationPatient
        ]

        row = np.array(
            orientation[:3],
            dtype=np.float32,
        )

        col = np.array(
            orientation[3:],
            dtype=np.float32,
        )

        normal = np.cross(
            row,
            col,
        )

        axis = int(
            np.argmax(
                np.abs(normal)
            )
        )

        if axis == 0:
            return "Sagittal"

        if axis == 1:
            return "Coronal"

        return "Axial"

    except Exception:
        return "Unknown"


def text_from_dataset(ds, name):
    value = getattr(
        ds,
        name,
        ""
    )

    if isinstance(value, (list, tuple)):
        value = " ".join(
            str(x) for x in value
        )

    return str(value or "")


def read_dicom_from_bytes(
    data,
    filename,
):
    try:
        ds = pydicom.dcmread(
            io.BytesIO(data),
            force=True,
        )

        # Force pixel decoding here so unsupported
        # compressed DICOMs fail clearly.
        pixels = ds.pixel_array

        if pixels.ndim != 2:
            raise ValueError(
                "Only single-frame grayscale DICOM images are supported."
            )

        return {
            "filename": filename,
            "series_uid": str(
                getattr(
                    ds,
                    "SeriesInstanceUID",
                    "UNKNOWN",
                )
            ),
            "series_description": text_from_dataset(
                ds,
                "SeriesDescription",
            ),
            "protocol_name": text_from_dataset(
                ds,
                "ProtocolName",
            ),
            "plane": dicom_plane(ds),
            "instance_number": int(
                getattr(
                    ds,
                    "InstanceNumber",
                    0,
                )
                or 0
            ),
            "image_position": list(
                getattr(
                    ds,
                    "ImagePositionPatient",
                    [],
                )
            ),
            "pixels": pixels,
        }

    except Exception as exc:
        raise ValueError(
            f"Unable to read DICOM {filename}: {exc}"
        ) from exc


def read_zip_study(zip_bytes):
    """
    Read all DICOM files recursively from a ZIP study.
    """

    slices = []

    with zipfile.ZipFile(
        io.BytesIO(zip_bytes),
        "r",
    ) as archive:

        for info in archive.infolist():

            if info.is_dir():
                continue

            name = info.filename

            try:
                data = archive.read(
                    info
                )
            except Exception:
                continue

            # Try DICOM parsing. Non-DICOM files
            # are simply ignored.
            try:
                item = read_dicom_from_bytes(
                    data,
                    name,
                )

                slices.append(item)

            except Exception:
                continue

    if not slices:
        raise ValueError(
            "No readable DICOM images were found in the ZIP."
        )

    return slices


# ============================================================
# SERIES ORGANIZATION
# ============================================================

def organize_series(slices):

    groups = defaultdict(list)

    for item in slices:

        groups[
            item["series_uid"]
        ].append(item)

    result = []

    for series_uid, items in groups.items():

        planes = [
            item["plane"]
            for item in items
        ]

        descriptions = [
            item["series_description"]
            for item in items
            if item["series_description"]
        ]

        protocols = [
            item["protocol_name"]
            for item in items
            if item["protocol_name"]
        ]

        plane_counts = {}

        for plane in planes:
            plane_counts[plane] = (
                plane_counts.get(
                    plane,
                    0
                )
                + 1
            )

        detected_plane = (
            max(
                plane_counts,
                key=plane_counts.get,
            )
            if plane_counts
            else "Unknown"
        )

        result.append({
            "series_uid": series_uid,
            "plane": detected_plane,
            "slice_count": len(items),
            "description": (
                descriptions[0]
                if descriptions
                else ""
            ),
            "protocol": (
                protocols[0]
                if protocols
                else ""
            ),
        })

    result.sort(
        key=lambda x: (
            x["plane"] != "Sagittal",
            x["plane"],
        )
    )

    return result


# ============================================================
# MRI PREPROCESSING
# ============================================================

def normalize_volume(volume):

    volume = volume.astype(
        np.float32
    )

    low, high = np.percentile(
        volume,
        [1, 99],
    )

    volume = np.clip(
        volume,
        low,
        high,
    )

    volume = (
        volume - low
    ) / (
        high - low + 1e-8
    )

    return volume


def resize_volume(
    volume,
    size=(224, 224),
):

    resized = np.zeros(
        (
            volume.shape[0],
            size[0],
            size[1],
        ),
        dtype=np.float32,
    )

    for index in range(
        volume.shape[0]
    ):

        resized[index] = cv2.resize(
            volume[index],
            size,
            interpolation=cv2.INTER_AREA,
        )

    return resized


def sort_dicom_slices(
    items
):
    def sort_key(item):

        position = item[
            "image_position"
        ]

        if len(position) >= 3:

            try:
                return float(
                    position[2]
                )

            except Exception:
                pass

        return item[
            "instance_number"
        ]

    return sorted(
        items,
        key=sort_key,
    )


def prepare_model_input(
    series_items,
):

    ordered = sort_dicom_slices(
        series_items
    )

    volume = np.stack(
        [
            item["pixels"]
            for item in ordered
        ]
    )

    if volume.shape[0] < 1:
        raise ValueError(
            "The selected series contains no slices."
        )

    volume = normalize_volume(
        volume
    )

    volume = resize_volume(
        volume,
        size=(224, 224),
    )

    indices = np.linspace(
        0,
        volume.shape[0] - 1,
        8,
    ).astype(int)

    volume = volume[
        indices
    ]

    image = torch.tensor(
        volume,
        dtype=torch.float32,
    )

    # [8,H,W] -> [8,3,H,W]
    image = (
        image
        .unsqueeze(1)
        .repeat(1, 3, 1, 1)
    )

    # [8,3,H,W] -> [1,8,3,H,W]
    image = image.unsqueeze(0)

    return image


# ============================================================
# API ROUTES
# ============================================================


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "KneeNova API",
        "docs": "/docs",
        "health": "/health",
    }

@app.get("/health")
def health():

    return {
        "status": "ok",
        "device": str(DEVICE),
        "model": "KneeNovaFinal",
        "checkpoint_epoch": checkpoint.get(
            "epoch"
        ),
        "targets": TARGETS,
    }


@app.post("/inspect")
async def inspect_mri(
    file: UploadFile = File(...)
):

    contents = await file.read()

    if not file.filename.lower().endswith(
        ".zip"
    ):
        raise HTTPException(
            status_code=400,
            detail="Please upload a ZIP containing a complete DICOM study.",
        )

    try:
        slices = read_zip_study(
            contents
        )

        series = organize_series(
            slices
        )

        return {
            "filename": file.filename,
            "total_slices": len(slices),
            "series": series,
        }

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.post("/analyze")
async def analyze_mri(
    file: UploadFile = File(...),
    series_uid: str = Form(...),
):

    contents = await file.read()

    if not file.filename.lower().endswith(
        ".zip"
    ):
        raise HTTPException(
            status_code=400,
            detail="Please upload a ZIP containing the DICOM study.",
        )

    try:
        slices = read_zip_study(
            contents
        )

        selected = [
            item
            for item in slices
            if item["series_uid"] ==
            series_uid
        ]

        if not selected:
            raise ValueError(
                "Selected MRI series was not found."
            )

        image = prepare_model_input(
            selected
        )

        image = image.to(
            DEVICE
        )

        with torch.inference_mode():

            logits = model(
                image
            )

            probabilities = torch.sigmoid(
                logits
            )[0].cpu().numpy()

        predictions = [
            {
                "abnormality": target,
                "score": float(probability),
            }
            for target, probability
            in zip(
                TARGETS,
                probabilities,
            )
        ]

        predictions.sort(
            key=lambda x: x["score"],
            reverse=True,
        )

        return {
            "status": "success",
            "study_file": file.filename,
            "series_uid": series_uid,
            "slice_count": len(selected),
            "checkpoint_epoch": checkpoint.get(
                "epoch"
            ),
            "predictions": predictions,
        }

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


print("==========================================")
print("KneeNova backend loaded")
print("==========================================")
print("Device:", DEVICE)
print("Model:", MODEL_PATH)
print("Checkpoint epoch:", checkpoint.get("epoch"))