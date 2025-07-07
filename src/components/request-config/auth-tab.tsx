import { memo, useMemo, useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useFileStore } from "@/utils/zustand"

const authTypes = [
  { value: "none", label: "No Authentication" },
  { value: "bearer", label: "Bearer Token" },
  { value: "basic", label: "Basic Auth" },
]

export const AuthTab = memo(({ tabPath }: { tabPath: string }) => {
  const { openTabs, updateTabRequestOptions } = useFileStore()
  
  const currentTab = useMemo(() => 
    openTabs.find(tab => tab.path === tabPath), [openTabs, tabPath]
  )

  const [authType, setAuthType] = useState("none")
  const [token, setToken] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // Initialize from tab data
  useEffect(() => {
    if (currentTab?.requestOptions.authorisation) {
      const auth = currentTab.requestOptions.authorisation
      setAuthType(auth.auth_type)
      
      if (auth.auth_type === "bearer") {
        setToken(auth.values.token || "")
      } else if (auth.auth_type === "basic") {
        setUsername(auth.values.username || "")
        setPassword(auth.values.password || "")
      } 
    } else {
      setAuthType("none")
      setToken("")
      setUsername("")
      setPassword("")
    }
  }, [currentTab])


  useEffect(() => {
    if (authType === "none") {
      updateTabRequestOptions(tabPath, { authorisation: null })
    } else {
      const values: Record<string, string> = {}
      
      if (authType === "bearer" && token) {
        values.token = token
      } else if (authType === "basic") {
        if (username) values.username = username
        if (password) values.password = password
      } 
      updateTabRequestOptions(tabPath, { 
        authorisation: {
          auth_type: authType as 'bearer' | 'basic',
          values: values
        }
      })
    }
  }, [authType, token, username, password,tabPath, updateTabRequestOptions])

  const memoizedAuthTypes = useMemo(() => authTypes, [])

  const handleAuthTypeChange = useCallback((value: string) => {
    setAuthType(value)
  }, [])

  const handleTokenChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value)
  }, [])

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])

  if (!currentTab) {
    return <div className="text-center text-muted-foreground">Tab not found</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Authentication</h3>
        {authType !== "none" && (
          <Badge variant="outline" className="text-xs">
            {memoizedAuthTypes.find(t => t.value === authType)?.label}
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Authentication Type</label>
        <Select value={authType} onValueChange={handleAuthTypeChange}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {memoizedAuthTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {authType === "bearer" && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Bearer Token</label>
          <Input 
            placeholder="Enter your bearer token" 
            value={token}
            onChange={handleTokenChange}
            className="h-8 font-mono text-xs"
            type="password"
          />
        </div>
      )}

      {authType === "basic" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Username</label>
            <Input 
              placeholder="Enter username" 
              value={username}
              onChange={handleUsernameChange}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <Input 
              placeholder="Enter password" 
              value={password}
              onChange={handlePasswordChange}
              className="h-8 text-xs"
              type="password"
            />
          </div>
        </div>
      )}

      {authType === "none" && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No authentication required</p>
        </div>
      )}
    </div>
  )
})
