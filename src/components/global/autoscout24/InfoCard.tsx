import { RootState } from "@/state/store";
import React from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoCardProps {}
const InfoCard: React.FC<InfoCardProps> = () => {
  const info = useSelector((state: RootState) => state.autoscout24.info);
  const cars = useSelector((state: RootState) => state.autoscout24.cars);
  const productsNumBeforeLastRequest = useSelector(
    (state: RootState) => state.autoscout24.productsNumBeforeLastRequest
  );
  const errors_lst = info.errors_list.filter(
    (error) => !error.startsWith("error/")
  );
  return (
    <Card className={"w-[380px] sm:w-[600px] md:w-[380px] flex-grow"}>
      <CardHeader className="gap-4">
        <CardTitle className="text-xl ">Response Info</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
        <ul>
        <li>Number of pages: {info.num_of_pages}</li>
        <li>Start from page: {info.start_from_page}</li>
        <li>Stop in page: {info.end_in_page}</li>
        <li>Products Got: {cars.length - productsNumBeforeLastRequest}</li>
        {errors_lst.length > 0 && (
          <li>
            Errors list:
            <ul>
              {errors_lst.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </li>
        )}
      </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
