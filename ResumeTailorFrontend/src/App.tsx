import { useState } from "react";
import InputPanel from "./components/InputPanel";
import ResultTabs from "./components/ResultTabs";
import { TailorResponse } from "@/types/TailorResponse";

export default function App() {
    const [responseData, setResponseData] = useState<TailorResponse | null>(null);

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-10 transition-colors duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl w-full h-[80vh]">
                {/* Left Panel */}
                <div className="flex flex-col h-full">
                    <InputPanel onResponse={setResponseData} />
                </div>

                {/* Right Panel */}
                <div className="flex flex-col h-full">
                    <ResultTabs data={responseData} />
                </div>
            </div>
        </div>
    );
}
