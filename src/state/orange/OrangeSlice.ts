import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface RequestUrlState {
//   url: string;
//   params: {
//     page: number;
//     tri: string;
//   };
//   limit: number;
//   businessType: string;
// }

export interface RequestDataState {
  activites_name: string;
  type: string;
  start_pages: number;
  limit_pages: number;
}

interface Address {
  text: string;
  link: string;
}

export interface CardData {
  selected: boolean;
  title: string;
  category: string;
  adress: Address;
  phone: string[] | string;
  email: string;
}

export interface CardType {
  message: CardData;
  response: any;
}

// Interface
interface OrangeState {
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
const initialState: OrangeState = {
  requestData: {
    activites_name: "",
    type: "All",
    start_pages: 1,
    limit_pages: 1,
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
const orange = createSlice({
  name: "orange",
  initialState,
  reducers: {
    setRequestData: (state, action: PayloadAction<RequestDataState>) => {
      state.requestData = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addCard: (state, action: PayloadAction<CardType>) => {
      if(action.payload.message !== undefined){
        state.cards = [...state.cards, action.payload];
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setProgress: (state, action: PayloadAction<any>) => {
      state.progress.push(action.payload);
    },
    updateProgressCardNumbersForEachPage: (
      state,
      action: PayloadAction<any>
    ) => {
      // Find the last object with "Scraping url" in progress
      for (let i = state.progress.length - 1; i >= 0; i--) {
        if (state.progress[i].message.includes("Get Non Deplicate Card")) {
          // Update the cardsNumbers property
          state.progress[i].card_progress = action.payload;
          break;
        }
      }
    },
    clearProgress: (state) => {
      state.progress = [];
    },
    setCardNumbers: (state) => {
      state.cardsNumbers += 1;
    },
    clearCardNumbers: (state) => {
      state.cardsNumbers = 0;
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
    findDublicateNumbers: (state) => {
      const allNumbers: string[] = [];

      for (const card of state.cards) {
        if (typeof card.message.phone == typeof []) {
          for (const number of card.message.phone) {
            if (allNumbers.includes(number)) {
              if (!state.dublicateNumbers.includes(number)) {
                state.dublicateNumbers.push(number);
              }
            } else {
              allNumbers.push(number);
            }
          }
        }
      }
    },
    updateCardSelectedState: (
      state,
      action: PayloadAction<{ index: number; value: boolean }>
    ) => {
      console.log("select update", action.payload.index, action.payload.value);
      state.cards[action.payload.index].message.selected = action.payload.value;
    },
    removeSelectedCards: (state, action: PayloadAction<string[]>) => {
      state.cards = state.cards.filter(
        (card) => !action.payload.includes(JSON.stringify(card))
      );
    },
  },
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
  setCardNumbers,
  clearCardNumbers,
  updateProgressCardNumbersForEachPage,
  setLoading,
  addUniqueObject,
  findDublicateNumbers,
} = orange.actions;

export default orange.reducer;
