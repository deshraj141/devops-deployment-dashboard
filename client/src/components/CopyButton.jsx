import { Check, Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const CopyButton = ({ value, label = "Copied" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) {
      toast.error("Nothing to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(label);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      toast.error("Copy failed");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="btn-icon"
      type="button"
      title="Copy"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

export default CopyButton;
