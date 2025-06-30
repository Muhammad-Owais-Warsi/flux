import { memo, useState, useMemo } from "react"
import { BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const resultTabs = [
  { value: "response", label: "Response" },
  { value: "headers", label: "Headers" },
  { value: "cookies", label: "Cookies" },
  { value: "timeline", label: "Timeline" },
]

export const ResultToggle = memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  
  const memoizedTabs = useMemo(() => resultTabs, [])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <BarChart3 className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle result panel</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[60vh] min-h-[400px]">
        <SheetHeader>
          <SheetTitle>Response Results</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="response" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              {memoizedTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex-1 overflow-auto mt-4">
              <TabsContent value="response" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Response Body</h4>
                    <div className="flex gap-2">
                      <span className="text-xs text-muted-foreground">Status: 200 OK</span>
                      <span className="text-xs text-muted-foreground">Time: 234ms</span>
                      <span className="text-xs text-muted-foreground">Size: 1.2KB</span>
                    </div>
                  </div>
                  <div className="border rounded-md p-4 bg-background font-mono text-sm min-h-[200px]">
                    <div className="text-muted-foreground">
                      Response will appear here after sending a request...
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="headers" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Response Headers</h4>
                  <div className="border rounded-md p-4 bg-background">
                    <div className="text-muted-foreground text-sm">
                      Response headers will appear here...
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="cookies" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Cookies</h4>
                  <div className="border rounded-md p-4 bg-background">
                    <div className="text-muted-foreground text-sm">
                      Cookies will appear here...
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="timeline" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Request Timeline</h4>
                  <div className="border rounded-md p-4 bg-background">
                    <div className="text-muted-foreground text-sm">
                      Request timeline will appear here...
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
})

// TODO
// No need of tabs.