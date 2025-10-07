import { useState } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TailorResponse } from "@/types/TailorResponse";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import jsPDF from "jspdf";

interface ResultTabsProps {
    data: TailorResponse | null;
}

function convertToMarkdown(text: string) {
    if (!text) return "";
    return text
        .replace(/(?<=\n|^)•/g, "- ")
        .replace(/(?<=\n)([A-Z ]{3,}:)/g, "### $1")
        .replace(/\n{2,}/g, "\n\n")
        .trim();
}

export default function ResultTabs({ data }: ResultTabsProps) {
    const [copiedTab, setCopiedTab] = useState<string | null>(null);

    const handleCopy = async (text: string, key: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedTab(key);
            setTimeout(() => setCopiedTab(null), 1500);
        } catch (err) {
            console.error("❌ Failed to copy:", err);
        }
    };

    // 🧾 Export tab content as PDF
// 🧾 Export selected tab's text as a real text-based PDF
// 🧾 Export pure content only (no header, no label duplication)
    const handleDownloadPDF = (label: string, text: string) => {
        const pdf = new jsPDF({
            unit: "pt",
            format: "a4",
        });

        const margin = 40;
        const lineHeight = 18;
        const maxWidth = pdf.internal.pageSize.getWidth() - margin * 2;
        let y = margin;

        pdf.setFont("times", "normal");
        pdf.setFontSize(12);

        const wrapped = pdf.splitTextToSize(text.trim(), maxWidth);

        wrapped.forEach((line: string) => {
            if (y > pdf.internal.pageSize.getHeight() - margin) {
                pdf.addPage();
                y = margin;
            }

            const trimmed = line.trim();

            // 🔹 Detect ALL-CAPS section headers like "EXPERIENCE" or "TECHNICAL SKILLS"
            if (/^[A-Z\s]{3,}$/.test(trimmed)) {
                pdf.setFont("times", "bold");
            } else {
                pdf.setFont("times", "normal");
            }

            pdf.text(line, margin, y);
            y += lineHeight;
        });

        pdf.save(`${label.replace(/\s+/g, "_")}.pdf`);
    };


    if (!data) {
        return (
            <Card className="h-full overflow-auto bg-card/90 border border-border shadow-xl backdrop-blur-md transition-all duration-300">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Tailor Results
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground p-6">
                    No results yet. Submit your resume and job description to begin.
                </CardContent>
            </Card>
        );
    }

    const tabs = [
        { key: "analysis", label: "Job Analysis", content: data.jobPostingAnalysis },
        { key: "cover", label: "Cover Letter", content: data.coverLetter },
        { key: "resume", label: "Resume Tailoring", content: data.resumeTailoring },
        { key: "qualifications", label: "Additional Qualifications", content: data.additionalQualifications },
    ];

    return (
        <Card className="h-full overflow-auto bg-card/90 border border-border shadow-xl hover:shadow-2xl backdrop-blur-md transition-all duration-300">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                    Tailor Results
                </CardTitle>
            </CardHeader>

            <CardContent className="[&_.prose]:text-foreground">
                <Tabs defaultValue="analysis" className="w-full not-prose">
                    <TabsList className="not-prose flex flex-wrap gap-2 mb-4 p-1 rounded-xl bg-[var(--surface)] border border-border/50 shadow-sm">
                        {tabs.map(({ key, label }) => (
                            <TabsTrigger
                                key={key}
                                value={key}
                                className="not-prose rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {tabs.map(({ key, content, label }) => (
                        <TabsContent
                            key={key}
                            value={key}
                            className="p-4 rounded-lg bg-[var(--surface)] text-muted-foreground animate-in fade-in-50 overflow-auto max-h-[70vh]"
                        >
                            {/* Header with Copy + Download buttons */}
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-foreground">{label}</h3>
                                <div className="flex items-center gap-1">
                                    {/* Copy */}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleCopy(content || "", key)}
                                                    className="hover:bg-primary/10 transition-colors"
                                                >
                                                    {copiedTab === key ? (
                                                        <Check className="h-4 w-4 text-green-400" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {copiedTab === key ? "Copied!" : "Copy content"}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    {/* Download */}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDownloadPDF(label, content || "")}
                                                    className="hover:bg-primary/10 transition-colors"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Download as PDF</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            <div
                                id={`tab-content-${key}`}
                                className="prose prose-invert prose-lg max-w-none leading-relaxed"
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {convertToMarkdown(content || "")}
                                </ReactMarkdown>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
}
