import { Badge } from "./ui/badge";

type MethodBadgeType = {
  method: string | undefined;
};

export default function MethodBadge({ method }: MethodBadgeType) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium ${
        method === "GET"
          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
          : method === "POST"
            ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            : method === "PUT"
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
      }`}
    >
      {method}
    </Badge>
  );
}
