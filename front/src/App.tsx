import { Card, CardContent } from "@/components/ui/card";
import FileList from "./components/file_list";

function App() {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-zinc-300 to-zinc-500 flex justify-center items-center p-4">
      <Card className="w-full max-w-3xl p-6 shadow-lg bg-white rounded-xl">
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="w-full h-96 border border-gray-300 rounded-lg overflow-hidden">
            <iframe
              src="https://n8n.apps.fgib.fr/form/10ffe50c-bf85-4695-9cb9-b1c01c8d420e"
              className="w-full h-full"
            ></iframe>
          </div>
          <FileList />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
