import Editor from "./components/editor";
import { SidebarProvider } from "./components/ui/sidebar";
import "./App.css";

function App() {
  return (
    <div className="h-screen w-full">
      <SidebarProvider>
        <Editor/>
      </SidebarProvider>
    </div>
  );
}

export default App;
