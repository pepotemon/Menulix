import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type FeedbackTone = "info" | "success" | "error";

interface FeedbackProps {
  message: string;
  tone?: FeedbackTone;
  className?: string;
}

const toneClasses: Record<FeedbackTone, string> = {
  info: "border-line bg-white text-ink/68",
  success: "border-leaf/25 bg-leaf/10 text-leaf",
  error: "border-tomato/25 bg-tomato/10 text-tomato"
};

const icons = {
  info: Info,
  success: CheckCircle2,
  error: AlertCircle
};

export function Feedback({
  message,
  tone = "info",
  className = ""
}: FeedbackProps): JSX.Element {
  const Icon = icons[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2 rounded-md border px-4 py-3 text-sm font-bold ${toneClasses[tone]} ${className}`}
    >
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

