import { memo } from "react";
import { EditorHeader } from "./editor-header";
import { EditorSidebar } from "./editor-sidebar";
import { Footer } from "./footer";
import EditorPlayground from "./editor-playground";
import { Separator } from "./ui/separator";
import { SidebarInset } from "./ui/sidebar";

const Editor = memo(() => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <EditorSidebar />
      <SidebarInset className="flex flex-col min-h-screen overflow-hidden">
        {/* Header - will automatically adjust to sidebar state */}
        <div className="sticky top-0 z-30 bg-background border-b">
          <EditorHeader />
          <Separator />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <EditorPlayground />
        </div>
        
        {/* Footer - will automatically adjust to sidebar state */}
        <div className="sticky bottom-0 z-30 bg-background border-t">
          <Footer />
        </div>
      </SidebarInset>
    </div>
  )
});

Editor.displayName = "Editor";

export default Editor;
