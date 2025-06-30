import { memo, useState, useCallback, useMemo, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useFileStore } from "@/utils/zustand"

const bodyTypes = [
  { value: "none", label: "No Body" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "form", label: "Form Data" },
  { value: "raw", label: "Raw Text" },
]

export const BodyTab = memo(({ tabPath }: { tabPath: string }) => {
  const { openTabs, updateTabRequestOptions } = useFileStore()
  
  // Get tab-specific data
  const currentTab = useMemo(() => 
    openTabs.find(tab => tab.path === tabPath), [openTabs, tabPath]
  )

  const [bodyType, setBodyType] = useState("none")
  const [bodyContent, setBodyContent] = useState("")

  // Initialize from tab data
  useEffect(() => {
    if (currentTab?.requestOptions.body) {
      if (typeof currentTab.requestOptions.body === 'string') {
        setBodyContent(currentTab.requestOptions.body)
        setBodyType("raw")
      } else if (Array.isArray(currentTab.requestOptions.body)) {
        try {
          setBodyContent(JSON.stringify(currentTab.requestOptions.body[0] || {}, null, 2))
          setBodyType("json")
        } catch {
          setBodyContent("")
          setBodyType("none")
        }
      }
    }
  }, [currentTab])

  // Sync body data to store
  useEffect(() => {
    let bodyData: string | Record<string, string>[] | null = null
    
    if (bodyType !== "none" && bodyContent.trim()) {
      if (bodyType === "json") {
        try {
          const parsed = JSON.parse(bodyContent)
          bodyData = [parsed]
        } catch {
          bodyData = bodyContent
        }
      } else {
        bodyData = bodyContent
      }
    }

    updateTabRequestOptions(tabPath, { body: bodyData })
  }, [bodyType, bodyContent, tabPath, updateTabRequestOptions])

  const memoizedBodyTypes = useMemo(() => bodyTypes, [])

  const handleBodyTypeChange = useCallback((value: string) => {
    setBodyType(value)
    if (value === "none") {
      setBodyContent("")
    } else if (value === "json" && !bodyContent) {
      setBodyContent("{\n  \n}")
    }
  }, [bodyContent])

  const handleBodyContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBodyContent(e.target.value)
  }, [])

  if (!currentTab) {
    return <div className="text-center text-muted-foreground">Tab not found</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Request Body</h3>
        {bodyType !== "none" && (
          <Badge variant="outline" className="text-xs">
            {memoizedBodyTypes.find(t => t.value === bodyType)?.label}
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Body Type</label>
        <Select value={bodyType} onValueChange={handleBodyTypeChange}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {memoizedBodyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {bodyType !== "none" && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Content</label>
          <Textarea 
            placeholder={`Enter ${bodyType} content here...`}
            value={bodyContent}
            onChange={handleBodyContentChange}
            className="min-h-[200px] font-mono text-xs"
            rows={8}
          />
        </div>
      )}

      {bodyType === "none" && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No request body</p>
        </div>
      )}
    </div>
  )
})

BodyTab.displayName = "BodyTab" 