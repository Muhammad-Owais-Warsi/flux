import { memo, useState, useCallback, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { useFileStore } from "@/utils/zustand"

interface Parameter {
  id: string
  key: string
  value: string
}

export const ParamsTab = memo(({ tabPath }: { tabPath: string }) => {

  const { openTabs, updateTabRequestOptions } = useFileStore()
  
  const currentTab = useMemo(() => 
    openTabs.find(tab => tab.path === tabPath), [openTabs, tabPath]
  )

  const [params, setParams] = useState<Parameter[]>(() => {
    const tabParams = currentTab?.requestOptions.parameters
    if (tabParams && Array.isArray(tabParams)) {
      return tabParams.map((param, index) => ({
        id: `param-${index}-${Date.now()}`,
        key: Array.isArray(param) ? param[0] || '' : '',
        value: Array.isArray(param) ? param[1] || '' : '',
      }))
    }
    return [{ id: "1", key: "", value: "" }]
  })

  useEffect(() => {
    const paramsForStore: [string, string][] = params
      .filter(param => param.key || param.value)
      .map(param => [param.key, param.value] as [string, string])
    
    updateTabRequestOptions(tabPath, { 
      parameters: paramsForStore.length > 0 ? paramsForStore : null 
    })
  }, [params, tabPath, updateTabRequestOptions])

  const addParameter = useCallback(() => {
    const newParam: Parameter = {
      id: Date.now().toString(),
      key: "",
      value: ""
    }
    setParams(prev => [...prev, newParam])
  }, [])

  const removeParameter = useCallback((id: string) => {
    setParams(prev => prev.filter(param => param.id !== id))
  }, [])

  const updateParameter = useCallback((id: string, field: 'key' | 'value', newValue: string) => {
    setParams(prev => prev.map(param => 
      param.id === id ? { ...param, [field]: newValue } : param
    ))
  }, [])

  const memoizedParams = useMemo(() => params, [params])

  if (!currentTab) {
    return <div className="text-center text-muted-foreground">Tab not found</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Query Parameters</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addParameter}
          className="h-8 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {memoizedParams.map((param) => (
          <div key={param.id} className="flex gap-2 items-center">
            <Input 
              placeholder="Parameter key"
              value={param.key}
              onChange={(e) => updateParameter(param.id, 'key', e.target.value)}
              className="h-8 text-xs"
            />
            <Input 
              placeholder="Parameter value"
              value={param.value}
              onChange={(e) => updateParameter(param.id, 'value', e.target.value)}
              className="h-8 text-xs"
            />
            {memoizedParams.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeParameter(param.id)}
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

