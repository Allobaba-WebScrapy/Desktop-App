import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from "./ProgressBar";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

type ProgressCardProps = React.ComponentProps<typeof Card>;

export function ProgressCard({ className, ...props }: ProgressCardProps) {

  const cars = useSelector((state: RootState) => state.autoscout24.cars);
  const actionsHistory = useSelector(
    (state: RootState) => state.autoscout24.actionsHistory
  );
  const isLoading = useSelector(
    (state: RootState) => state.autoscout24.loading
  );
  const sumProductRequested = useSelector(
    (state: RootState) => state.autoscout24.sumProductRequested
  );
  
  let progress =Math.round( (cars.length / sumProductRequested ) * 97)
  if (progress > 97){
    progress = 97
  }
  
  
  return (
    <Card className={cn("w-[380px] sm:w-[600px] md:w-[380px] flex-grow", className)} {...props}>
      <CardHeader className="gap-4">
        {isLoading && (
          <div className="flex gap-1 items-baseline">
            <span>{progress}%</span>
            <ProgressBar progress={progress} />
          </div>
        ) }
        <CardTitle className="text-xltext-gray-800">Actions History</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          {actionsHistory.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No actions have been performed yet.
            </p>
          )  
          }
          {actionsHistory.map((task, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[50px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <div className="flex items-center justify-center">
                {(actionsHistory.length == index + 1) && isLoading? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex h-3 w-3 translate-y-1 rounded-full bg-green-500" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none capitalize">{task}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
