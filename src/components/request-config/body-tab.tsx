import { memo, useState, useCallback, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useFileStore } from "@/utils/zustand"

export const BodyTab = memo(({ tabPath }: { tabPath: string }) => {
  const { openTabs, updateTabRequestOptions } = useFileStore()

  const currentTab = openTabs.find(tab => tab.path === tabPath)
  const rawBody = currentTab?.requestOptions.body

  const [bodyContent, setBodyContent] = useState<string>("")
  const [isValidJson, setIsValidJson] = useState(true)

  useEffect(() => {
    // Don't override if user already typed
    if (bodyContent) return
  
    if (rawBody) {
      if (typeof rawBody === "string") {
        setBodyContent(rawBody)
      } else {
        try {
          const initial = Array.isArray(rawBody)
            ? JSON.stringify(rawBody[0] || {}, null, 2)
            : JSON.stringify(rawBody, null, 2)
          setBodyContent(initial)
        } catch {
          setBodyContent("{\n\n}")
        }
      }
    } else {
      setBodyContent("{\n\n}")
    }
  }, [rawBody])


  const handleBodyContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setBodyContent(value)

      try {
        const parsed = JSON.parse(value)
        setIsValidJson(true)
        updateTabRequestOptions(tabPath, { body: JSON.stringify(parsed) })
      } catch {
        setIsValidJson(false)
        updateTabRequestOptions(tabPath, { body: value })
      }
    },
    [tabPath, updateTabRequestOptions]
  )

  if (!currentTab) {
    return <div className="text-center text-muted-foreground">Tab not found</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Request Body</h3>
        <Badge variant={isValidJson ? "secondary" : "destructive"} className="text-xs">
          {isValidJson ? "Valid JSON" : "Invalid JSON"}
        </Badge>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Content</label>
        <Textarea
          placeholder="Enter JSON content here..."
          value={bodyContent}
          onChange={handleBodyContentChange}
          className="min-h-[200px] font-mono text-xs"
          rows={8}
        />
      </div>
    </div>
  )
})

BodyTab.displayName = "BodyTab"
