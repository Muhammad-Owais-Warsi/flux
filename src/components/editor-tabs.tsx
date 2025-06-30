import { X } from "lucide-react";
import { Button } from "./ui/button";
import MethodBadge from "./method-badge";

type EditorTabsProps = {
  name: string;
  method: string;
  isActive: boolean;
  onClose: () => void;
  onActive: () => void;
};

export default function EditorTabs({
  name,
  method,
  isActive,
  onClose,
  onActive,
}: EditorTabsProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 border-r border-border cursor-pointer group w-44  ${
        isActive
          ? "bg-background border-b-2 border-b-primary text-primary shadow-sm"
          : "bg-muted/20 hover:bg-background/50 text-muted-foreground hover:text-foreground"
      }`}
      onClick={onActive}
    >
      <MethodBadge method={method} />

      <div
        className={`text-sm whitespace-nowrap truncate flex-1 min-w-0 ${
          isActive ? "text-primary font-medium" : "text-foreground"
        }`}
      >
        {name}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 p-0 hover:bg-primary/10 hover:text-primary flex-shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X
          className={`h-3 w-3 ${
            isActive
              ? "text-primary/70 hover:text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        />
      </Button>
    </div>
  );
}
