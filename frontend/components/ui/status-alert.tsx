"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AlertVariant = "success" | "error" | "warning" | "info";

interface StatusAlertProps {
  variant: AlertVariant;
  title: string;
  description?: string;
  /** Tự động đóng sau n ms. Mặc định 4000ms, truyền 0 để tắt. */
  duration?: number;
  onClose?: () => void;
}

const variantConfig: Record<
  AlertVariant,
  { icon: React.ElementType; className: string }
> = {
  success: {
    icon: CheckCircle2,
    className:
      "border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-50",
  },
  error: {
    icon: XCircle,
    className:
      "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50",
  },
  warning: {
    icon: AlertTriangle,
    className:
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50",
  },
  info: {
    icon: Info,
    className:
      "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-50",
  },
};

export function StatusAlert({
  variant,
  title,
  description,
  duration = 4000,
  onClose,
}: StatusAlertProps) {
  const [visible, setVisible] = useState(false); // kiểm soát animation

  // Slide-in ngay khi mount
  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(enterTimer);
  }, []);

  // Tự động đóng sau `duration` ms
  useEffect(() => {
    if (!duration) return;
    const closeTimer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(closeTimer);
  }, [duration]);

  const handleClose = () => {
    setVisible(false); // kích hoạt slide-out
    setTimeout(() => onClose?.(), 350); // đợi animation xong rồi unmount
  };

  const { icon: Icon, className: variantClass } = variantConfig[variant];

  return (
    // Wrapper cố định ở góc dưới phải màn hình
    <div
      className="fixed bottom-6 right-6 z-50 transition-all duration-350 ease-in-out"
      style={{
        transform: visible ? "translateX(0)" : "translateX(120%)",
        opacity: visible ? 1 : 0,
      }}
    >
      <Alert
        className={`max-w-md ${variantClass} relative pr-10`}
      >
        <Icon className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        {description && <AlertDescription>{description}</AlertDescription>}
      </Alert>
    </div>
  );
}
