import React from "react";
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
import { Loader2 } from "lucide-react";

interface SearchFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function SearchForm({
  handleSubmit,
}: React.PropsWithChildren<SearchFormProps>) {
  const isLoading = useSelector((state: RootState) => state.orange.loading);

  return (
    <Card className="w-[380px] sm:w-[600px] md:w-[760px] 2xl:w-[600px]">
      <CardHeader>
        <CardTitle>Let's get some data</CardTitle>
        <CardDescription>

          1- Select the Activites you want to scrape.
          <br />
          2- Choose the starting page number.{" "}
          <span className="text-yellow-400">
            "Starting page number cannot exceed a number larger than the total
            pages"
          </span>
          <br />
          3- Select the number of pages to scrape (between 1 and 5).
          <br />
          4- Choose the type of data (B2B, B2C, or All).
          <br />
          5- start scraping.
          <br />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="sortOption">Activites</Label>
              <Select name="sortOption" required>
                <SelectTrigger id="sortOption">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Boulangeries">Boulangeries</SelectItem>
                  <SelectItem value="Fleuristes">Fleuristes</SelectItem>
                  <SelectItem value="Restaurants">Restaurants</SelectItem>
                  <SelectItem value="Médecins">Médecins</SelectItem>
                  <SelectItem value="Coiffeurs">Coiffeurs</SelectItem>
                  <SelectItem value="Garages">Garages</SelectItem>
                  <SelectItem value="Super marchés">Super marchés</SelectItem>
                  <SelectItem value="Dentistes">Dentistes</SelectItem>
                  <SelectItem value="Serruriers">Serruriers</SelectItem>
                  <SelectItem value="Bricolage">Bricolage</SelectItem>
                  <SelectItem value="Mairies">Mairies</SelectItem>
                  <SelectItem value="Cafés">Cafés</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="startPage" className="">
                Start page
              </Label>
              <Input
                id="startPage"
                name="startPage"
                type="number"
                min={1} // minimum value
                placeholder="Start scraping"
                required
              // value={startPage}
              // onChange={e => setstartPage(e.target.value)}
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
                placeholder="Limit scraping from (1 to 5)"
                // value={limitPage}
                // onChange={e=>setlimitPage(e.target.value)}
                required
              />
            </div>
            <div>
              <RadioGroup
                defaultValue="ALL"
                name="type"
                className="flex flex-row gap-4"
              >
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
