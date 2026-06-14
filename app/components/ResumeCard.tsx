import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback,imagePath } }: { resume: Resume }) => {
    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <h2 className="font-bold text-black wrap-break-words">
                        {companyName}
                    </h2>

                    <h3 className="text-lg text-gray-500 wrap-break-words">
                        {jobTitle}
                    </h3>
                </div>
                <div className="shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            <div className="gradient-border animate-in fade-in duration-1000">
                <div className="w-full h-full">
                    <img
                    src={imagePath}
                    alt = "resume"
                    className="w-full h-125 object-contain object-top bg-white"
                    />
                     </div>

            </div>

        </Link>
    )
}

export default ResumeCard