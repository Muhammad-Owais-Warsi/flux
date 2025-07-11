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
            : method === "DELETE"
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
            : method === "PATCH"
              ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
            : method === "OPTIONS"
              ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30"
            : method === "HEAD"
              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
            : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30" // fallback

      }`}
    >
      {method}
    </Badge>
  );
}
