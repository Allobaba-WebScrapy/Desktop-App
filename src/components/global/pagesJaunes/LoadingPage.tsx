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
import { Loader2, RefreshCcw, LucideArrowRight } from "lucide-react";
import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    downloadCardsAsCsv,
    downloadCardsAsJson,
    downloadCardsAsXml,
} from "@/lib/pagesjaunes_utils";
import { scrapData } from "@/state/pagesJaunes/PagesJaunesSlice";

type Step = {
    type: string;
    message?: string;
    limiCard?: {
        scrapedCardsNumbers: number,
        avalaibleCardsNumbers: number,
        loading: boolean
    };
};
type CardProps = React.ComponentProps<typeof Card>;
type LoadingPageProps = CardProps;

const LoadingPage: React.FC<LoadingPageProps> = ({ className, ...props }) => {
    const requestData = useSelector((state: RootState) => state.pagesJaunes.requestData);
    const cards = useSelector((state: RootState) => state.pagesJaunes.cards);
    const progress = useSelector(
        (state: RootState) => state.pagesJaunes.progress
    );
    const isLoading = useSelector(
        (state: RootState) => state.pagesJaunes.loading
    );
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (requestData.url === "") {
            navigate("/scrapy/pagesjaunes")
        }
    });

    return (
        <div className="h-full w-[380px] sm:w-[600px] md:w-[760px] 2xl:w-[600px]">
            {/* ----------------------------------------------- */}
            <Card className={cn("w-full", className)} {...props}>
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
                                {step.limiCard !== undefined ?
                                    <span className={`flex h-2 w-2 translate-y-1 rounded-full ${step.limiCard.scrapedCardsNumbers < step.limiCard.avalaibleCardsNumbers && step.limiCard.loading ? "bg-yellow-500" : "bg-green-500"}`} /> :
                                    <span className={`flex h-2 w-2 translate-y-1 rounded-full ${(step.type.includes("progress") || step.type.includes("done")) ? "bg-green-500" : "bg-red-500"}`} />
                                }
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {step.message}
                                    </p>
                                    {step.limiCard !== undefined && (
                                        <p className="font-normal">
                                            {step.limiCard.scrapedCardsNumbers} cards scraped / {step.limiCard.avalaibleCardsNumbers} cards available
                                        </p>
                                    )}
                                    <p className={`text-sm text-muted-foreground ${(step.type.includes("progress") || step.type.includes("done")) ? "text-green-500" : "text-red-500"}`}>{step.type}</p>
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
                                onClick={() => navigate("/scrapy/pagesjaunes/results")}
                                className="h-20 w-full flex gap-5 justify-center items-center bg-zinc-700 text-white text-xl hover:bg-zinc-600"
                            >
                                View Results
                                <LucideArrowRight className="outline rounded-full outline-2 outline-offset-2 outline-white w-4 h-4" />
                            </Button>
                            <div className="flex justify-around items-center">
                                <Button
                                    onClick={() => downloadCardsAsCsv()}
                                    className="h-16 w-[30%] text-xs sm:text-base flex gap-2 justify-center items-center"
                                >
                                    {/* <Download /> */}
                                    Download CSV
                                </Button>
                                <Button
                                    onClick={() => downloadCardsAsJson()}
                                    className="h-16 w-[30%] text-xs sm:text-base flex gap-2 justify-center items-center"
                                >
                                    {/* <Download /> */}
                                    Download JSON
                                </Button>
                                <Button
                                    onClick={() => downloadCardsAsXml()}
                                    className="h-16 w-[30%] text-xs sm:text-base flex gap-2 justify-center items-center"
                                >
                                    {/* <Download /> */}
                                    Download XML
                                </Button>
                            </div>
                        </div>
                    ) :
                        <Button
                            onClick={() => dispatch(scrapData())}
                            className="h-20 w-full flex gap-5 justify-center items-center bg-red-500 text-white text-xl hover:bg-zinc-600"
                        >
                            <RefreshCcw className="w-6 h-6" />
                            Try again
                        </Button>}
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoadingPage;
