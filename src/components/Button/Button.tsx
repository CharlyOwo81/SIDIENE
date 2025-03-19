// components/Button.tsx
import { motion } from "framer-motion";
import React from "react";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type,
  onClick,
  children,
  disabled,
  className,
}) => (
  <motion.button
    type={type}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    disabled={disabled}
    className={className}
  >
    {children}
  </motion.button>
);

export default Button;
