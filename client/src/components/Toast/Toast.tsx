import { useEffect } from "react";

type ToastProps = {
  message: string;
  onClose: () => void;
};

export const Toast = ({ message, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return <div>{message}</div>;
};
