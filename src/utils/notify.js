import { toast } from "sonner";

export const Notify = (message, type = "info", options = {}) => {
  const baseOptions = {
    duration: 1000,
    ...options,
  };

  switch (type) {
    case "success":
      toast.success(message, baseOptions);
      break;

    case "error":
      toast.error(message, baseOptions);
      break;

    case "warning":
      toast.warning(message, baseOptions);
      break;

    case "info":
    default:
      toast(message, baseOptions);
      break;
  }
};
