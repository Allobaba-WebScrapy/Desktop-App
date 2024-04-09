import React from 'react';
import { addCard, addOldRequest, addUniqueObject, setError, setProgress, clearProgress, setLoading, setRequestData, updateProgressCardNumbersForEachPage, RequestDataState } from "@/state/orange/OrangeSlice";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { AppDispatch, RootState } from '@/state/store';
import { SearchForm } from '@/components/global/orange/SearchForm';
import LoadingPage from '@/components/global/orange/LoadingPage';
import CardsTable from '@/components/global/orange/CardsTable';


function MyForm() {

  const uniqueObjects = useSelector((state: RootState) => state.orange.uniqueObjects);

  const oldRequestData = useSelector((state: RootState) => state.orange.oldRequests);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast()

  const scrape = async (request:RequestDataState) => {
    dispatch(setLoading(true))
    dispatch(clearProgress())
    // Send the URLs to the server with fetch
    fetch(`${import.meta.env.VITE_APP_ORANGE}/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then(() => {
        navigate("/scrapy/orange/loading")
        // Start the EventSource connection
        const eventSource = new EventSource(`${import.meta.env.VITE_APP_ORANGE}/scrape`);

        eventSource.addEventListener("done", function () {
          // Close the connection when the 'done' event is received
          dispatch(setProgress({ type: "progress",message: "Scraping is done" }))
          dispatch(setLoading(false))
          eventSource.close();
        });

        eventSource.onmessage = function (event) {
          const obj = JSON.parse(event.data);
          if(obj.type==="progress"){
            dispatch(setProgress(JSON.parse(event.data)));
          }
          else if(obj.type==="error"){
            dispatch(setProgress(JSON.parse(event.data)));
            dispatch(setLoading(false))
            eventSource.close();
          }
          else if(obj.type==="response"){
              if (!uniqueObjects.includes(event.data)) {
                  dispatch(addUniqueObject(event.data))
                  // newCard["selected"] = false;
                  dispatch(addCard(obj));
                  dispatch(updateProgressCardNumbersForEachPage(obj.process));
              } else {
                  toast({
                      variant: "destructive",
                      title: "Card is already in the table.",
                      description: "The duplicate version doesn't added to table!",
                  });
                  console.log("duplicated");
              }
          }
        };

        eventSource.onerror = function () {
          dispatch(setProgress({ type: "error", progress: "EventSource failed" }));
          dispatch(setLoading(false))
          eventSource.close();
        };
      })
      .catch(() => {
        dispatch(setProgress({ type: "error", progress: "Fetch Connection Error" }));
        dispatch(setLoading(false))
      });
  };



  // Handle the form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setError(null))

    const form_data: { [k: string]: string | number | FormDataEntryValue } = Object.fromEntries(new FormData(e.currentTarget));
    form_data.startPage = form_data.startPage as string;
    form_data.endPage = form_data.endPage as string;
    form_data.sortOption = form_data.sortOption as string;
    form_data.type = form_data.type as string;
    // Process Url and set Request Data
    const request = { "activites_name": form_data.sortOption, "type":form_data.type, "start_pages": parseInt(form_data.startPage), "limit_pages": parseInt(form_data.endPage) }
    // Check if the url is already scraped
    if (oldRequestData.includes(JSON.stringify(form_data))) {
        const confirm = window.confirm('You have already scraped this url! Do you want to continue?');
        if (confirm) {
            dispatch(setRequestData(request));
            scrape(request)
        } else {

            return
        }
    } else {
        dispatch(setRequestData(request));
        dispatch(addOldRequest());
        scrape(request)
    }
}


  return (
    <div className="flex flex-col w-full items-center justify-center">
    {/* <Toaster /> */}
    <Routes>
        <Route path="/" element={
            <React.Fragment>
                <div>
                    <SearchForm handleSubmit={handleSubmit} />
                </div>
            </React.Fragment>
        } />
        <Route path="loading" element={
            <React.Fragment>
                <div>
                    <LoadingPage scrape={scrape} />
                </div>
            </React.Fragment>
        } />
        <Route path="results" element={
            <React.Fragment>
                <div className="flex items-center">
                  {/* ... Table Component */}
                  <CardsTable />
                </div>
            </React.Fragment>
        } />
    </Routes>
</div>
  );
}

export default MyForm;