import { memo, useState, useCallback, useMemo } from "react"
import { ParamsTab } from "./params-tab"
import { HeadersTab } from "./headers-tab"
import { BodyTab } from "./body-tab"
import { AuthTab } from "./auth-tab"

const tabsData = [
  { value: "params", label: "Params", component: ParamsTab },
  { value: "headers", label: "Headers", component: HeadersTab },
  { value: "body", label: "Body", component: BodyTab },
  { value: "auth", label: "Auth", component: AuthTab },
]

export const RequestConfig = memo(({ tabPath }: { tabPath: string }) => {
  const [activeTab, setActiveTab] = useState("params")
  
  const memoizedTabs = useMemo(() => tabsData, [])

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
  }, [])

  // Only render the active tab component to prevent unnecessary re-renders
  const renderActiveTabContent = useMemo(() => {
    const activeTabData = memoizedTabs.find(tab => tab.value === activeTab)
    if (!activeTabData) return null
    
    const Component = activeTabData.component
    return <Component tabPath={tabPath} />
  }, [activeTab, memoizedTabs, tabPath])

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Horizontal tabs bar */}
      <div className="flex border-b border-border bg-muted/30 sticky top-0 z-10">
        {memoizedTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`
              px-4 py-2 text-sm font-medium border-r border-border transition-colors duration-200
              ${activeTab === tab.value
                ? "bg-background text-foreground border-b-2 border-b-primary"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-background/50"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>


      <div className="flex-1 overflow-auto p-4">
        {renderActiveTabContent}
      </div>
    </div>
  )
})

