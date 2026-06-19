import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
    resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
    resume: Resume;
}) => {
    const { fs } = usePuterStore();

    const [resumeUrl, setResumeUrl] = useState("");

    useEffect(() => {
        const loadResume = async () => {
            try {
                if (!imagePath) return;

                const blob = await fs.read(imagePath);

                if (!blob) return;

                const url = URL.createObjectURL(blob);
                setResumeUrl(url);
            } catch (error) {
                console.error("Resume image error:", error);
            }
        };

        loadResume();
    }, [imagePath, fs]);

    let parsedFeedback: any = { overallScore: 0 };

    try {
        if (typeof feedback === "string" && feedback !== "") {
            parsedFeedback = JSON.parse(feedback);
        } else if (feedback) {
            parsedFeedback = feedback;
        }
    } catch (err) {
        console.error("Invalid feedback:", feedback);
    }

    return (
        <Link
            to={`/resume/${id}`}
            className="resume-card animate-in fade-in duration-1000"
        >
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    {companyName && (
                        <h2 className="text-black! font-bold wrap-break-word">
                            {companyName}
                        </h2>
                    )}

                    {jobTitle && (
                        <h3 className="text-lg wrap-break-word text-gray-500">
                            {jobTitle}
                        </h3>
                    )}

                    {!companyName && !jobTitle && (
                        <h2 className="text-black! font-bold">
                            Resume
                        </h2>
                    )}
                </div>

                <div className="shrink-0">
                    <ScoreCircle
                        score={parsedFeedback?.overallScore || 0}
                    />
                </div>
            </div>

            {resumeUrl ? (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="w-full h-88 max-sm:h-50 object-cover object-top"
                        />
                    </div>
                </div>
            ) : (
                <div className="gradient-border h-88 flex items-center justify-center">
                    <p className="text-gray-500">
                        Resume preview unavailable
                    </p>
                </div>
            )}
        </Link>
    );
};

export default ResumeCard;