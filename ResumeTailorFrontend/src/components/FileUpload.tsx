import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onFileSelect(file);
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Upload PDF Resume</label>

            <div className="flex items-center gap-3">
                {/* Custom button to trigger file input */}
                <Button
                    type="button"
                    onClick={handleClick}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
                >
                    Choose File
                </Button>

                {/* File name display */}
                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
          {inputRef.current?.files?.[0]?.name || "No file chosen"}
        </span>
            </div>

            {/* Hidden actual file input */}
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                onChange={handleChange}
                className="hidden"
            />
        </div>
    );
}
