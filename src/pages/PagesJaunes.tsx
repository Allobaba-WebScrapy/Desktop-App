import React from "react";
import CarsTable from "@/components/global/pagesJaunes/CardsTable";
import { SearchForm } from "@/components/global/pagesJaunes/SearchForm";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/toaster";
import { addOldRequest, setError, setRequestData, scrapData } from "@/state/pagesJaunes/PagesJaunesSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useSelector, useDispatch } from "react-redux";
import { processUrl } from "@/lib/pagesjaunes_utils"
import { Route, Routes, useNavigate } from "react-router-dom";
import LoadingPage from "@/components/global/pagesJaunes/LoadingPage";


const PagesJaunes = () => {
    const oldRequestData = useSelector((state: RootState) => state.pagesJaunes.oldRequests);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();


    // Check if the url is valid
    const isValidUrl = (url: string) => {
        return url.trim().startsWith("https://www.pagesjaunes.fr/annuaire")
    }

    // Handle the form submit
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(setError(null))

        const form_data: { [k: string]: string | number | FormDataEntryValue } = Object.fromEntries(new FormData(e.currentTarget));
        form_data.url = form_data.url as string;
        form_data.startPage = form_data.startPage as string;
        form_data.endPage = form_data.endPage as string;
        form_data.sortOption = form_data.sortOption as string;
        form_data.businessType = form_data.businessType as string;
        if (isValidUrl(form_data.url)) {
            // Process Url and set Request Data
            const baseUrl =
            {
                url: form_data.url,
                params: {
                    startPage: form_data.startPage,
                    tri: form_data.sortOption,
                },
                endPage: form_data.endPage,
                businessType: form_data.businessType,
            }
            const RequestData = processUrl(baseUrl);
            // Check if the url is already scraped
            if (oldRequestData.includes(JSON.stringify(form_data))) {
                const confirm = window.confirm('You have already scraped this url! Do you want to continue?');
                if (confirm) {
                    dispatch(setRequestData(RequestData));
                    navigate("/scrapy/pagesjaunes/loading")
                    dispatch(scrapData());
                } else {

                    return
                }
            } else {
                dispatch(setRequestData(RequestData));
                dispatch(addOldRequest());
                navigate("/scrapy/pagesjaunes/loading")
                dispatch(scrapData());
            }
        } else {
            dispatch(setError({ type: "url", message: "Invalid URL" }))
        }
    }

    return (
        <div className="flex flex-col w-full items-center justify-center">
                <Toaster />
                <Routes>
                // <Route path="/*" element={
                        <React.Fragment>
                            <div>
                                <SearchForm handleSubmit={handleSubmit} />
                            </div>
                        </React.Fragment>
                    } />
                    <Route path="loading" element={
                        <React.Fragment>
                            <div>
                                <LoadingPage />
                            </div>
                        </React.Fragment>
                    } />
                    <Route path="results" element={
                        <React.Fragment>
                            <div className="flex items-center">
                                <CarsTable />
                            </div>
                        </React.Fragment>
                    } />
                </Routes>
        </div>
    )
};

export default PagesJaunes;