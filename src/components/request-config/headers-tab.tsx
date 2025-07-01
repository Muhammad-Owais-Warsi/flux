import { memo, useState, useCallback, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { useFileStore } from "@/utils/zustand"

interface Header {
  id: string
  key: string
  value: string
}

export const HeadersTab = memo(({ tabPath }: { tabPath: string }) => {
  const { openTabs, updateTabRequestOptions } = useFileStore()
  

  const currentTab = useMemo(() => 
    openTabs.find(tab => tab.path === tabPath), [openTabs, tabPath]
  )


  const [headers, setHeaders] = useState<Header[]>(() => {
    const tabHeaders = currentTab?.requestOptions.headers
    if (tabHeaders && Array.isArray(tabHeaders)) {
      return tabHeaders.map((header, index) => ({
        id: `header-${index}-${Date.now()}`,
        key: typeof header === 'object' && 'key' in header ? header.key || '' : '',
        value: typeof header === 'object' && 'value' in header ? header.value || '' : '',
      }))
    }
    return [{ id: "1", key: "", value: "" }]
  })

 
  useEffect(() => {
    const headersForStore = headers
      .filter(header => header.key || header.value)
      .reduce((acc, header) => {
        if (header.key) {
          acc[header.key] = header.value
        }
        return acc
      }, {} as Record<string, string>)
    
    updateTabRequestOptions(tabPath, { 
      headers: Object.keys(headersForStore).length > 0 ? [headersForStore] : null 
    })
  }, [headers, tabPath, updateTabRequestOptions])

  const addHeader = useCallback(() => {
    const newHeader: Header = {
      id: Date.now().toString(),
      key: "",
      value: ""
    }
    setHeaders(prev => [...prev, newHeader])
  }, [])

  const removeHeader = useCallback((id: string) => {
    setHeaders(prev => prev.filter(header => header.id !== id))
  }, [])

  const updateHeader = useCallback((id: string, field: 'key' | 'value', newValue: string) => {
    setHeaders(prev => prev.map(header => 
      header.id === id ? { ...header, [field]: newValue } : header
    ))
  }, [])

  const memoizedHeaders = useMemo(() => headers, [headers])
  


  if (!currentTab) {
    return <div className="text-center text-muted-foreground">Tab not found</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Request Headers</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addHeader}
          className="h-8 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {memoizedHeaders.map((header) => (
          <div key={header.id} className="flex gap-2 items-center">
            <Input 
              placeholder="Header name"
              value={header.key}
              onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
              className="h-8 text-xs"
            />
            <Input 
              placeholder="Header value"
              value={header.value}
              onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
              className="h-8 text-xs"
            />
            {memoizedHeaders.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeHeader(header.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

    </div>
  )
})


