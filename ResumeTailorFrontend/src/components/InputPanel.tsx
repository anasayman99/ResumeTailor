import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "./FileUpload";
import api from "@/api/axiosInstance";

interface InputPanelProps {
    onResponse: (data: any) => void;
}

export default function InputPanel({ onResponse }: InputPanelProps) {
    const [mode, setMode] = useState("text");
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let { data } =
                mode === "text"
                    ? await api.post(
                        "/api/tailor/text",
                        (() => {
                            const form = new FormData();
                            form.append("text", resumeText);
                            form.append("jobDescription", jobDescription);
                            return form;
                        })(),
                        { headers: { "Content-Type": "multipart/form-data" } }
                    )
                    : await api.post(
                        "/api/tailor/file",
                        (() => {
                            if (!file) throw new Error("No file selected");
                            const form = new FormData();
                            form.append("file", file);
                            form.append("jobDescription", jobDescription);
                            return form;
                        })(),
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );

            console.log("✅ API Response:", data);
            onResponse(data);
        } catch (error) {
            console.error("❌ Request failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="h-full overflow-auto bg-card/90 border border-border shadow-xl hover:shadow-2xl backdrop-blur-md transition-all duration-300">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                    Upload or Paste Resume
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
                {/* Mode Toggle */}
                <div className="flex gap-6 text-sm text-muted-foreground">
                    {["text", "pdf"].map((option) => (
                        <label
                            key={option}
                            className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"
                        >
                            <input
                                type="radio"
                                value={option}
                                checked={mode === option}
                                onChange={() => setMode(option)}
                                className="accent-primary"
                            />
                            <span className="capitalize">{option}</span>
                        </label>
                    ))}
                </div>

                {/* Resume Input */}
                {mode === "pdf" ? (
                    <FileUpload onFileSelect={setFile} />
                ) : (
                    <Textarea
                        placeholder="Paste your resume text here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="h-40 resize-none bg-[var(--surface)] text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/50"
                    />
                )}

                {/* Job Description */}
                <Textarea
                    placeholder="Paste job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="h-40 resize-none bg-[var(--surface)] text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/50"
                />

                {/* Submit */}
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                >
                    {loading ? "Analyzing..." : "Submit"}
                </Button>
            </CardContent>
        </Card>
    );
}
