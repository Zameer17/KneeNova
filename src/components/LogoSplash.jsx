import { motion } from "framer-motion";
import { useEffect } from "react";

export default function LogoSplash({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="logo-splash"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.02,
      }}
      transition={{
        duration: 0.7,
        ease: "easeInOut",
      }}
    >
      <div className="splash-content">

        {/* Animated outer ring */}
        <motion.div
          className="logo-ring ring-blue"
          initial={{
            opacity: 0,
            rotate: -90,
            scale: 0.7,
          }}
          animate={{
            opacity: 1,
            rotate: 0,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
        />

        {/* Animated green ring */}
        <motion.div
          className="logo-ring ring-green"
          initial={{
            opacity: 0,
            rotate: 90,
            scale: 0.7,
          }}
          animate={{
            opacity: 1,
            rotate: 0,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            delay: 0.15,
            ease: "easeOut",
          }}
        />

        {/* Logo */}
        <motion.img
          src="/assets/kneenova-logo.png"
          alt="KneeNova"
          className="splash-logo"
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1,
            delay: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

      </div>

      {/* Brand name */}
      <motion.h1
        className="splash-title"
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 1.2,
        }}
      >
        KneeNova
      </motion.h1>

      {/* Divider */}
      <motion.div
        className="splash-divider"
        initial={{
          width: 0,
          opacity: 0,
        }}
        animate={{
          width: 150,
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
          delay: 1.6,
        }}
      >
        <span />
        <b />
        <span />
      </motion.div>

      {/* Tagline */}
      <motion.p
        className="splash-tagline"
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 1.8,
        }}
      >
        AI-POWERED KNEE MRI ANALYSIS
      </motion.p>

      {/* Status */}
      <motion.div
        className="splash-status"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 2.3,
          duration: 0.5,
        }}
      >
        <span className="status-dot" />
        Preparing secure medical workspace
      </motion.div>
    </motion.div>
  );
}