import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { ArrowUpRightFromSquare, Loader2 } from "lucide-react";


interface SearchFormProps {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function SearchForm({
    handleSubmit,
}: React.PropsWithChildren<SearchFormProps>) {
    const ATError = useSelector((state: RootState) => state.pagesJaunes.error);
    const isLoading = useSelector(
        (state: RootState) => state.pagesJaunes.loading
    );
    const [url, setUrl] = useState("");
    const [startPage, setStartPage] = useState("1");
    const [sortOption, setSortOption] = useState('PERTINENCE-ASC');

    // Manage the URL structure
    useEffect(() => {
        const urlParams = new URLSearchParams(url);
        const page = urlParams.get('page') || "1";
        const tri = ([
            "PERTINENCE-ASC",
            "NOTE_GLOBALE-DESC",
            "NOMBRE_GLOBAL_AVIS-DESC",
        ].includes(urlParams.get("tri") || "") &&
            urlParams.get("tri")) ||
            "PERTINENCE-ASC";;
        setStartPage(page)
        setSortOption(tri)
    }, [url]);

    return (
        <Card className="w-[380px] sm:w-[600px] md:w-[760px] 2xl:w-[600px]">
            <CardHeader>
                <CardTitle>Let's get some data</CardTitle>
                <CardDescription>
                    <div className="flex justify-between h-fit w-full">
                        <div>
                            1-Go to page page that you want to scrape in pagesjaunes.fr <br />
                            2-copy link that you awnt to scrape <br />
                            3-link should start with https://www.pagesjaunes.fr/annuaire
                            <br />
                        </div>
                        <div className="h-full flex justify-center">
                            <a
                                href=" https://www.pagesjaunes.fr/annuaire"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-500 hover:underline"
                            >
                                <ArrowUpRightFromSquare>Open</ArrowUpRightFromSquare>
                            </a>
                        </div>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                name="url"
                                placeholder="Paste URL Here"
                                required
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                            {(ATError && ATError.type === "url") && <p className="text-red-500 text-xs font-semibold pl-4">{ATError.message}</p>}
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="startPage">Start page</Label>
                            <Input
                                id="startPage"
                                name="startPage"
                                type="number"
                                min={1} // minimum value
                                placeholder="Start scraping from (1 to 10)"
                                required
                                value={startPage}
                                onChange={e => setStartPage(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="endPage">Limit page</Label>
                            <Input
                                type="number"
                                id="endPage"
                                name="endPage"
                                min={1} // minimum value
                                max={5} // maximum value
                                defaultValue={"1"}
                                placeholder="Limit scraping from (1 to 10)"
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="sortOption">
                                Sort Options
                            </Label>
                            <Select name="sortOption" value={sortOption} onValueChange={(option) => setSortOption(option)} required>
                                <SelectTrigger id="sortOption">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="PERTINENCE-ASC">
                                        PERTINENCE
                                    </SelectItem>
                                    <SelectItem value="DISTANCE-ASC">
                                        DISTANCE
                                    </SelectItem>
                                    <SelectItem value="NOTE_GLOBALE-DESC" >NOTE</SelectItem>
                                    <SelectItem value="NOMBRE_GLOBAL_AVIS-DESC">NOMBRE D'AVIS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <RadioGroup defaultValue="ALL" name="businessType" className="flex flex-row gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="B2B" id="r1" />
                                    <Label htmlFor="r1">B2B</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="B2C" id="r2" />
                                    <Label htmlFor="r2">B2C</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ALL" id="r3" />
                                    <Label htmlFor="r3">ALL</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <Button variant="outline" type="reset">
                            Reset
                        </Button>
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit">Start Scraping</Button>
                        )}
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
        </Card>
    );
}
