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
                        <TabsTrigger
                            value="analysis"
                            className="not-prose rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            Job Analysis
                        </TabsTrigger>
                        <TabsTrigger
                            value="cover"
                            className="not-prose rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            Cover Letter
                        </TabsTrigger>
                        <TabsTrigger
                            value="resume"
                            className="not-prose rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            Resume Tailoring
                        </TabsTrigger>
                        <TabsTrigger
                            value="qualifications"
                            className="not-prose rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            Additional Qualifications
                        </TabsTrigger>
                    </TabsList>

                    {[
                        { key: "analysis", label: "Job Analysis", content: data.jobPostingAnalysis },
                        { key: "cover", label: "Cover Letter", content: data.coverLetter },
                        { key: "resume", label: "Resume Tailoring", content: data.resumeTailoring },
                        { key: "qualifications", label: "Additional Qualifications", content: data.additionalQualifications },
                    ].map(({ key, content }) => (
                        <TabsContent
                            key={key}
                            value={key}
                            className="p-4 rounded-lg bg-[var(--surface)] text-muted-foreground animate-in fade-in-50 overflow-auto max-h-[70vh]"
                        >
                            <div className="prose prose-invert prose-lg max-w-none leading-relaxed">
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
