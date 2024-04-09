import InfoCard from "@/components/global/autoscout24/InfoCard";
import ProductsDownloadCard from "@/components/global/autoscout24/ProductsDownloadCard";
import ProductsTable from "@/components/global/autoscout24/ProductsTable";
import { ProgressCard } from "@/components/global/autoscout24/ProgressCard";
import { ScrapySearchCar } from "@/components/global/autoscout24/SearchCard";
import { Toaster } from "@/components/ui/toaster";
import {
  RequestDataState,
  addOldRequest,
  findDublicateNumbers,
  scrapData,
  setError,
  setRequestData,
} from "@/state/autoscout24/AutoScout24Slice";
import { AppDispatch, RootState } from "@/state/store";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const AutoScout24 = () => {
  const isLoading = useSelector(
    (state: RootState) => state.autoscout24.loading
  );
  const oldRequestData = useSelector(
    (state: RootState) => state.autoscout24.oldRequests
  );
  const dispatch = useDispatch<AppDispatch>();

  const isValidUrl = (url: string) => {
    return (
      url.trim().startsWith("https://www.autoscout24.fr/lst") ||
      url.trim().startsWith("https://www.autoscout24.com/lst")
    );
  };
  const validateForm = (RequestData: RequestDataState) => {
    if (!isValidUrl(RequestData.url)) {
      dispatch(
        setError("URL should start with https://www.autoscout24.fr/lst")
      );
      return false;
    } else if (Number.isNaN(RequestData.startPage)) {
      dispatch(setError("Start page should be a number"));
      return false;
    } else if (RequestData.startPage < 1) {
      dispatch(setError("Start page should be greater than 0"));
      return false;
    } else if (RequestData.startPage > 20) {
      dispatch(setError("Start page should be less than 20"));
      return false;
    } else if (Number.isNaN(RequestData.offers)) {
      dispatch(setError("Products should be a number"));
      return false;
    } else if (RequestData.offers < 1) {
      dispatch(setError("Products should be greater than 0"));
      return false;
    } else if (RequestData.offers > 100) {
      dispatch(setError("Products should be less than 100"));
      return false;
    }
    return true;
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setError(null));

    const form_data: { [k: string]: string | number | FormDataEntryValue } =
      Object.fromEntries(new FormData(e.currentTarget));
    form_data.url = form_data.url as string;
    form_data.startPage = parseInt(form_data.startPage as string);
    form_data.offers = parseInt(form_data.offers as string);
    form_data.waitingTime = parseInt(form_data.waitingTime as string);
    form_data.businessType = form_data.businessType as string;
    const RequestData = {
      url: form_data.url,
      startPage: form_data.startPage,
      offers: form_data.offers,
      waitingTime: form_data.waitingTime,
      businessType: form_data.businessType,
    };

    if (!validateForm(RequestData)) {
      return;
    }
    if (oldRequestData.includes(JSON.stringify(RequestData))) {
      const confirm = window.confirm(
        "You have already scraped this url! Do you want to continue?"
      );
      if (confirm) {
        dispatch(setRequestData(RequestData));
        dispatch(scrapData());
      } else {
        return;
      }
    } else {
      dispatch(setRequestData(RequestData));
      dispatch(addOldRequest());
      dispatch(scrapData());
    }

    // console.log(form_data);
    // console.log(oldRequestData);
  };
  // test if there is nay repeated number in cars vendor numbers
  useEffect(() => {
    if (!isLoading) {
      dispatch(findDublicateNumbers());
    }
  }, [dispatch, isLoading]);
  return (
    <div className="flex flex-col w-full  items-center">
      <Toaster />
      <div className="flex flex-col gap-2 w-full h-fit justify-center 2xl:flex-row items-center 2xl:items-start">
        <div className="">
          <ScrapySearchCar handleSubmit={handleSubmit} />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex flex-col gap-2 ">
            <ProgressCard />
            {!isLoading && <InfoCard />}
          </div>
          <div>
            <ProductsDownloadCard />
          </div>
        </div>
      </div>
      <ProductsTable />
    </div>
  );
};

export default AutoScout24;
