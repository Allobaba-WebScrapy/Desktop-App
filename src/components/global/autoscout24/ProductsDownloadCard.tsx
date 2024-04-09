import { RootState } from "@/state/store";
import React from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  downloadProductasAsCsv,
  downloadProductsAsJson,
} from "@/lib/autoscout24utils";
import { Button } from "@/components/ui/button";

interface ProductsDownloadCardProps {}
const ProductsDownloadCard: React.FC<ProductsDownloadCardProps> = () => {
  const cars = useSelector((state: RootState) => state.autoscout24.cars);

  return (
    <Card className={"w-[380px] sm:w-[600px] md:w-[380px]"}>
      <CardHeader className="gap-4">
        <CardTitle className="text-xl ">Download</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col gap-4">
          <ul>
            <li>Products: {cars.length}</li>
          </ul>
          <div className="flex gap-2">

          <Button onClick={downloadProductasAsCsv}>Download CSV</Button>
          <Button onClick={downloadProductsAsJson}>Download Json</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsDownloadCard;
