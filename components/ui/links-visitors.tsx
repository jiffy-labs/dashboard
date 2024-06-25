import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Log } from "../types";
import { CopyIcon } from "lucide-react";

export default function LinksVisitors({ log }: { log: Log }) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  return (
    <div className="flex max-md:flex-col flex-row space-y-2 md:space-y-0 md:space-x-2 w-full">
      <ScrollArea className="relative w-full md:w-1/2 h-40 overflow-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">REQUEST CODE</h3>
          <button onClick={() => handleCopy(log.request)} className="p-1">
            <CopyIcon className="w-4 h-4 mr-2" />
          </button>
        </div>
        <pre className="whitespace-pre-wrap break-all">{log.request}</pre>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <ScrollArea className="relative w-full md:w-1/2 h-40 overflow-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">RESPONSE CODE</h3>
          <button onClick={() => handleCopy(log.response)} className="p-1">
            <CopyIcon className="w-4 h-4 mr-2" />
          </button>
        </div>
        <pre className="whitespace-pre-wrap break-all">{log.response}</pre>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
