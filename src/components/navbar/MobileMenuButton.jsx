import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenuButton({ open, setOpen }) {
  return (
    <button
      className="md:hidden text-blue-400 text-3xl cursor-pointer relative w-10 h-10 flex items-center justify-center"
      onClick={() => setOpen(!open)}
    >
      <AnimatePresence exitBeforeEnter>
        {open ? (
          <motion.span
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            ✕
          </motion.span>
        ) : (
          <motion.span
            key="menu"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            ☰
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
