import styles from "./Button.module.scss";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
};

export const Button = ({ children }: ButtonProps) => {
  return (
    <button className={styles.button} type="button">
      {children}
    </button>
  );
};
