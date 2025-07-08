import { memo, useState, useMemo, useCallback, useEffect } from "react"
import { BarChart3, Loader2, AlertCircle, Clock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useFileStore } from "@/utils/zustand"

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatJson = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return jsonString
  }
}

const getStatusBadgeClass = (status: number): string => {
  if (status >= 200 && status < 300) 
    return "bg-green-500/20 text-green-400 hover:bg-green-500/30"
  if (status >= 300 && status < 400) 
    return "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
  if (status >= 400 && status < 500) 
    return "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
  if (status >= 500) 
    return "bg-red-500/20 text-red-400 hover:bg-red-500/30"
  return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
}

const tabsData = [
  { value: "overview", label: "Overview" },
  { value: "headers", label: "Headers" },
  { value: "body", label: "Body" },
]

export const ResultToggle = memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { result, isLoading, error } = useFileStore()

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
  }, [])

  useEffect(() => {
    if(result) {
      setIsOpen(true);
    }
  },[result])

  const formattedBody = useMemo(() => {
    if (!result?.body) return ""
    return formatJson(result.body)
  }, [result?.body])

  const bodySize = useMemo(() => {
    if (!result?.body) return 0
    return new Blob([result.body]).size
  }, [result?.body])

  const memoizedTabs = useMemo(() => tabsData, [])

  const renderTabContent = useMemo(() => {
    if (!result) return null

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold mb-3">Status</h3>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant="outline" 
                      className={`text-sm font-medium px-3 py-1 ${getStatusBadgeClass(result.status)}`}
                    >
                      {result.status} {result.status_text}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{result.time_ms}ms</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>Size:</span>
                      <span>{formatBytes(bodySize)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Request URL
              </h3>
              <div className="p-3 bg-muted/50 rounded-lg">
                <code className="text-sm font-mono break-all text-foreground">
                  {result.url}
                </code>
              </div>
            </div>
          </div>
        )

      case "headers":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Response Headers</h3>
              <Badge variant="secondary" className="text-xs">
                {Object.keys(result.headers).length}
              </Badge>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 border-b">
                <div className="flex text-xs font-medium text-muted-foreground">
                  <div className="w-1/3">Header</div>
                  <div className="w-2/3">Value</div>
                </div>
              </div>
              <div className="max-h-[400px] overflow-auto">
                {Object.entries(result.headers).length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No headers received
                  </div>
                ) : (
                  Object.entries(result.headers).map(([key, value]) => (
                    <div key={key} className="flex px-4 py-3 border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                      <div className="w-1/3 font-medium text-blue-600 pr-4 break-all text-sm">
                        {key}
                      </div>
                      <div className="w-2/3 font-mono text-muted-foreground break-all text-sm">
                        {value}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )

      case "body":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Response Body</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {result.body && (result.body.trim().startsWith('{') || result.body.trim().startsWith('[')) ? 'JSON' : 'TEXT'}
                </Badge>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 border-b flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Content Preview
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatBytes(bodySize)}
                </span>
              </div>
              <div className="max-h-[500px] overflow-auto">
                {!result.body ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <div className="text-sm">No response body</div>
                  </div>
                ) : (
                  <div className="p-4">
                    <pre className="text-xs font-mono whitespace-pre-wrap break-words overflow-x-auto text-foreground leading-relaxed">
                      {formattedBody}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }, [activeTab, result, bodySize, formattedBody])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <BarChart3 className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle result panel</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[70vh] min-h-[500px]">
        <SheetHeader className="pb-4">
          <SheetTitle>Response</SheetTitle>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Sending request...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        ) : !result ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Send a request to see the response</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col bg-background">
            <div className="flex border-b border-border bg-muted/30 sticky top-0 z-10">
              {memoizedTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={`
                    px-4 py-2 text-sm font-medium border-r border-border
                    ${activeTab === tab.value
                      ? "bg-background text-foreground border-b-2 border-b-primary"
                      : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }
                  `}
                >
                  {tab.label}
                  {tab.value === "headers" && result && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {Object.keys(result.headers).length}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto p-4">
              {renderTabContent}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
})

