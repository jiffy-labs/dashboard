// links-visitors.tsx

import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Log } from "../types";
import { CopyIcon } from "lucide-react";

export default function LinksVisitors({ log }: { log: Log }) {
  const [activeTab, setActiveTab] = useState<"request" | "response">("request");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  return (
    <div className="w-full md:w-full">
      <div className="relative right-0">
        <ul className="relative flex flex-wrap p-1 list-none rounded-xl bg-blue-gray-50/60" role="list">
          <li className="z-30 flex-none text-center mr-2">
            <button
              className={`z-30 flex items-center justify-center px-4 py-2 mb-0 transition-all ease-in-out border-0 rounded-lg cursor-pointer transform-gpu duration-300 ${
                activeTab === "request"
                  ? "text-blue-500 shadow-lg translate-y-0 bg-white"
                  : "text-slate-500 shadow-sm hover:translate-y-1 hover:shadow-md"
              }`}
              role="tab"
              aria-selected={activeTab === "request"}
              onClick={() => setActiveTab("request")}
            >
              <span className="ml-1">REQUEST CODE</span>
            </button>
          </li>
          <li className="z-30 flex-none text-center">
            <button
              className={`z-30 flex items-center justify-center px-4 py-2 mb-0 transition-all ease-in-out border-0 rounded-lg cursor-pointer transform-gpu duration-300 ${
                activeTab === "response"
                  ? "text-blue-500 shadow-lg translate-y-0 bg-white"
                  : "text-slate-500 shadow-sm hover:translate-y-1 hover:shadow-md"
              }`}
              role="tab"
              aria-selected={activeTab === "response"}
              onClick={() => setActiveTab("response")}
            >
              <span className="ml-1">RESPONSE CODE</span>
            </button>
          </li>
        </ul>
        <div className="p-5">
          <div className={`${activeTab === "request" ? "block opacity-100" : "hidden opacity-0"}`} id="request" role="tabpanel">
            <ScrollArea className="relative w-full md:w-auto h-40 md:h-auto overflow-auto">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">REQUEST CODE</h3>
                <button onClick={() => handleCopy(log.request)} className="p-1">
                  <CopyIcon className="w-4 h-4 mr-2" />
                </button>
              </div>
              <pre className="whitespace-pre-wrap break-all w-full">{log.request}</pre>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className={`${activeTab === "response" ? "block opacity-100" : "hidden opacity-0"}`} id="response" role="tabpanel">
            <ScrollArea className="relative w-full md:w-auto h-40 md:h-auto overflow-auto">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">RESPONSE CODE</h3>
                <button onClick={() => handleCopy(log.response)} className="p-1">
                  <CopyIcon className="w-4 h-4 mr-2" />
                </button>
              </div>
              <pre className="whitespace-pre-wrap break-all w-full">{log.response}</pre>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
