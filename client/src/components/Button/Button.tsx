import styles from "./Button.module.scss";
import type { ReactNode } from "react";

type ButtonSize = "tiny" | "small" | "medium" | "large";
type ButtonVariant = "gray" | "blue" | "red";

type ButtonProps = {
  children: ReactNode;
  size: ButtonSize;
  variant: ButtonVariant;
  onClick?: () => void;
};

export const Button = ({ children, size, variant, onClick }: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[size]} ${styles[variant]}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
