import { useEffect } from "react";

type ToastProps = {
  message: string;
  onClose: () => void;
};

const timeOut = 5000;

export const Toast = ({ message, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, timeOut);

    return () => clearTimeout(timer);
  }, [onClose]);

  return <div>{message}</div>;
};
