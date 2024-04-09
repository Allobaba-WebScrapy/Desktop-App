import React, { useEffect } from "react";
// import { BellIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LucideArrowLeft, LucideArrowRight } from "lucide-react";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    downloadCardsAsCsv,
    downloadCardsAsJson,
    downloadCardsAsXml,
} from "@/lib/orange_utils";

type Step = {
    type: string;
    message: string;
    card_progress?: any;
};
type CardProps = React.ComponentProps<typeof Card>;
type ScrapeFunction = (requestData: any) => Promise<void>;
type LoadingPageProps = CardProps & {
    scrape: ScrapeFunction;
};

const LoadingPage: React.FC<LoadingPageProps> = ({ className, scrape, ...props }) => {
    const requestData = useSelector((state: RootState) => state.orange.requestData);
    const cards = useSelector((state: RootState) => state.orange.cards);
    const progress = useSelector(
        (state: RootState) => state.orange.progress
    );
    const isLoading = useSelector(
        (state: RootState) => state.orange.loading
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (requestData.activites_name === "") {
            navigate("/scrapy/orange")
        }
    });

    return (
        <div className="h-full w-full">
            {/* ----------------------------------------------- */}
            <Card className={cn("w-[380px] sm:w-[600px] md:w-[600px] flex-grow", className)} {...props}>
                <CardHeader>
                    <CardTitle>Progress</CardTitle>
                    <CardDescription>
                        You have {progress.filter((item: Step) => item.type === 'progress').length} step passed,
                        You have {progress.filter((item: Step) => item.type === 'error').length} error.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div>
                        {progress.map((step: Step, index: number) => (
                            <div
                                key={index}
                                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                            >
                                {step.card_progress !== undefined ?
                                    <span className={`flex h-2 w-2 translate-y-1 rounded-full ${step.card_progress.nCard < step.card_progress.length || step.card_progress.length == 0 ? "bg-yellow-500" : "bg-green-500"}`} />
                                    :
                                    <span className={`flex h-2 w-2 translate-y-1 rounded-full ${step.type === "progress" ? "bg-green-500" : "bg-red-500"}`} />
                                }
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {step.message}
                                    </p>
                                    {step.card_progress !== undefined && (
                                        <p className="font-normal">
                                            Scrape Card : {step.card_progress.nCard}/{step.card_progress.length}
                                        </p>
                                    )}
                                    <p className={`text-sm text-muted-foreground ${step.type === "progress" ? "text-green-500" : "text-red-500"}`}>{step.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    {isLoading ? (
                        <Button
                            disabled
                            className="h-20 w-full bg-zinc-700 text-white text-lg"
                        >
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            Please wait
                        </Button>
                    ) : cards.length > 0 ? (
                        <div className="w-full flex flex-col gap-2">
                            <Button
                                onClick={() => navigate("/scrapy/orange/results")}
                                className="h-20 w-full flex gap-5 justify-center items-center bg-zinc-700 text-white text-xl hover:bg-zinc-600"
                            >
                                View Results
                                <LucideArrowRight className="outline rounded-full outline-2 outline-offset-2 outline-white w-4 h-4" />
                            </Button>
                            <div className="flex justify-around items-center">
                                <Button
                                    onClick={() => downloadCardsAsCsv()}
                                    className="h-20 w-[28%] text-base flex gap-2 justify-center items-center"
                                >
                                    {/* <Download /> */}
                                    Download CSV
                                </Button>
                                <Button
                                    onClick={() => downloadCardsAsJson()}
                                    className="h-20 w-[28%] text-base flex gap-2 justify-center items-center"
                                >
                                    {/* <Download /> */}
                                    Download JSON
                                </Button>
                                <Button
                                    onClick={() => downloadCardsAsXml()}
                                    className="h-20 w-[28%] text-base flex gap-2 justify-center items-center"
                                >
                                    {/* <Download /> */}
                                    Download XML
                                </Button>
                            </div>
                        </div>
                    ) :
                        <Button
                            onClick={() => scrape(requestData)}
                            className="h-20 w-full flex gap-5 justify-center items-center bg-red-500 text-white text-xl hover:bg-zinc-600"
                        >
                            <LucideArrowLeft className="outline rounded-full outline-2 outline-offset-2 outline-white w-4 h-4" />
                            Try again
                        </Button>}
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoadingPage;
