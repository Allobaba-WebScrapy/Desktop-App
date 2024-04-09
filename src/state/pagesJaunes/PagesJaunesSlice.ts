import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { store } from "../store";
import { toast } from "@/components/ui/use-toast";

interface RequestDataState {
  url: string;
  startPage: number;
  endPage: number;
  businessType: string;
}

interface Address {
  link: string;
  text: string;
}

interface CardInfo {
  title: string;
  activite: string;
  address: Address;
  phones: string[] | string;
}

export interface CardType {
  selected: boolean;
  card_id: string;
  card_url: string;
  info: CardInfo;
}

// Interface
interface PagesJaunesState {
  requestData: RequestDataState;
  cards: CardType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  progress: any;
  cardsNumbers: number;
  loading: boolean;
  error: { type: string; message: string } | null;
  uniqueObjects: string[];
  dublicateNumbers: string[];
  oldRequests: string[];
}

// Initial state
const initialState: PagesJaunesState = {
  requestData: {
    url: "",
    startPage: 1,
    endPage: 1,
    businessType: "ALL",
  },
  cards: [],
  progress: [],
  cardsNumbers: 0,
  loading: false,
  error: null,
  uniqueObjects: [],
  dublicateNumbers: [],
  oldRequests: [],
};

// Create slice
const pagesJaunes = createSlice({
  name: "pagesJaunes",
  initialState,
  reducers: {
    setRequestData: (state, action: PayloadAction<RequestDataState>) => {
      state.requestData = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addCard: (state, action: PayloadAction<CardType>) => {
      state.cards = [...state.cards, action.payload];
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setProgress: (state, action: PayloadAction<any>) => {
      state.progress.push(action.payload);
    },
    updateProgressCardNumbersForEachPage: (state) => {
      // Find the last object with "Scraping url" in progress
      for (let i = state.progress.length - 1; i >= 0; i--) {
        if (state.progress[i].message.includes("Scraping Page")) {
          // Update the cardsNumbers property
          state.progress[i].limiCard.scrapedCardsNumbers += 1;
          break;
        }
      }
    },
    setCompletedScrapePage: (state) => {
      // Find the last object with "Scraping url" in progress
      for (let i = state.progress.length - 1; i >= 0; i--) {
        if (state.progress[i].message.includes("Scraping Page")) {
          // Update the cardsNumbers property
          state.progress[i].limiCard.loading = false;
          break;
        }
      }
    },
    clearProgress: (state) => {
      state.progress = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (
      state,
      action: PayloadAction<{ type: string; message: string } | null>
    ) => {
      state.error = action.payload;
    },
    addUniqueObject: (state, action: PayloadAction<string>) => {
      state.uniqueObjects.push(action.payload);
    },
    addOldRequest: (state) => {
      state.oldRequests.push(JSON.stringify(state.requestData));
    },
    updateCardSelectedState: (
      state,
      action: PayloadAction<{ index: number; value: boolean }>
    ) => {
      console.log("select update", action.payload.index, action.payload.value);
      state.cards[action.payload.index].selected = action.payload.value;
    },
    removeSelectedCards: (state, action: PayloadAction<string[]>) => {
      state.cards = state.cards.filter(
        (card) => !action.payload.includes(JSON.stringify(card))
      );
    },
  },
});

// ------------------------------------- Scrape Function ----------------------------------------
export const scrapData = createAsyncThunk("users/scrapData", async () => {
  try {
    store.dispatch(setLoading(true));
    store.dispatch(clearProgress());
    store.dispatch(
      setProgress({
        type: "progress",
        message: "Sending request to the server...",
      })
    );
    const requestData = store.getState().pagesJaunes.requestData;
    console.log(requestData);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: requestData.url,
        startPage: requestData.startPage,
        endPage: requestData.endPage,
        businessType: requestData.businessType,
      }),
    };
    const response = await fetch(
      `${import.meta.env.VITE_APP_PAGESJAUNES}/stream`,
      requestOptions
    );
    if (!response.ok || !response.body) {
      throw response.statusText;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        store.dispatch(setLoading(false));
        break;
      }

      const decodedChunk = decoder.decode(value, { stream: true });
      // Split the chunk into separate data events
      const dataEvents = decodedChunk.split("\n\n");
      for (const dataEvent of dataEvents) {
        // Extract the JSON part from the SSE message
        const jsonPart = dataEvent.replace("data: ", "").trim();

        // Skip empty strings
        if (!jsonPart) {
          continue;
        }

        const obj = JSON.parse(jsonPart);

        console.log("--- Yielded Response:", obj);
        console.log(store.getState().pagesJaunes.progress);
        if (obj.type === "response" && obj.message.card_url !== undefined) {
          if (
            !store.getState().pagesJaunes.uniqueObjects.includes(decodedChunk)
          ) {
            store.dispatch(addUniqueObject(decodedChunk));
            store.dispatch(addCard(obj.message));
            store.dispatch(updateProgressCardNumbersForEachPage());
          } else {
            toast({
              variant: "destructive",
              title: "Product is already in the table.",
              description: "The duplicate version doesn't added to table!",
            });
            console.log("duplicated");
          }
        } else if (obj.type === "progress") {
          store.dispatch(setProgress(obj));
        } else if (obj.type === "error") {
          store.dispatch(setProgress(obj));
        } else if (obj.type === "done") {
          store.dispatch(setProgress(obj));
          store.dispatch(setLoading(false));
        }
      }
    }
  } catch (error) {
    console.log(error);
    store.dispatch(setProgress({ type: "error", message: "Fetch Error" }));
    store.dispatch(setLoading(false));
  }
});

export const {
  setRequestData,
  removeSelectedCards,
  updateCardSelectedState,
  addCard,
  setError,
  addOldRequest,
  setProgress,
  clearProgress,
  updateProgressCardNumbersForEachPage,
  setCompletedScrapePage,
  setLoading,
  addUniqueObject,
} = pagesJaunes.actions;

export default pagesJaunes.reducer;
