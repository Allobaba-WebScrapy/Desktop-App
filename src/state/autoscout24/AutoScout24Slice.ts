import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { store } from '../store';
import { toast } from '@/components/ui/use-toast';
import { replaceErrorNotFoundWithDashs } from '@/lib/autoscout24utils';



export interface RequestDataState {
  url: string;
  businessType: string;
  startPage: number;
  offers: number;
  waitingTime: number;
}

interface ProductType {
  url:string,
  data:{
    title: string;
    model: string;
  vendor_info: {
      name: string;
      numbers: string[] | string;
      address: {
        url: string;
        text: string;
      },
      pro: boolean;
      company: string;
  }}
}

interface infoState {
  num_of_pages:number;
  num_of_offers:number;
  start_from_page: number;
  end_in_page: number;
  pages_url:string[];
  offers_got:number; 
  errors_list:string[];
  offers_user_want:number;
}

// Interface
interface AutoScout24State {
  requestData: RequestDataState;
  cars: ProductType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: infoState;
  loading: boolean;
  error: string | null;
  uniqueObjects: string[];
  dublicateNumbers: string[];
  oldRequests :  string[];
  sumProductRequested: number;
  productsNumBeforeLastRequest: number;
  actionsHistory:string[];
}

// Initial state
const initialState: AutoScout24State = {
  requestData: {'url':"",'startPage':1,'offers':1,'waitingTime':10,'businessType':'all'},
  cars: [],
  info: { num_of_pages:0,num_of_offers:0,start_from_page:0,end_in_page:0,pages_url:[],offers_got:0,errors_list:[],offers_user_want:0},
  loading: false,
  error: null,
  uniqueObjects: [],
  dublicateNumbers: [],
  oldRequests: [],
  sumProductRequested: 0,
  productsNumBeforeLastRequest:0,
  actionsHistory:[]
};

// Create slice
const autoscout24Slice = createSlice({
  name: 'autoscout24',
  initialState,
  reducers: {
    setRequestData: (state, action: PayloadAction<RequestDataState>) => {
      state.requestData = action.payload;
      state.productsNumBeforeLastRequest = state.cars.length;
      state.sumProductRequested = state.cars.length + action.payload.offers;
    }
    ,
    addCar: (state, action: PayloadAction<ProductType>) => {
      state.cars = [...state.cars,action.payload];
    },
    addActionToHistory: (state, action: PayloadAction<string>) => {
      state.actionsHistory = [...state.actionsHistory,action.payload].splice(-4)
    }
    ,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setInfo: (state, action: PayloadAction<infoState>) => {
      state.info = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addUniqueObject: (state, action: PayloadAction<string>) => {
      state.uniqueObjects.push(action.payload);
    },
    addOldRequest: (state) => {
      state.oldRequests.push(JSON.stringify(state.requestData));
    }
    ,
    findDublicateNumbers: (state) => {
        const allNumbers: string[] = [];
        state.dublicateNumbers = []
        for (const car of state.cars) {
          if (typeof car.data.vendor_info.numbers == typeof []) {
            for (const number of car.data.vendor_info.numbers) {
                if (allNumbers.includes(number)) {
                  if (!state.dublicateNumbers.includes(number)) {
                    state.dublicateNumbers.push(number);
                  }
                }else{
                  allNumbers.push(number);
                }
            }
          }
        }
    
    },
    removeSelectedProducts: (state,action:PayloadAction<string[]>) => {
      state.cars = state.cars.filter(car => !action.payload.includes(JSON.stringify(car))); 
    }
    
  }});


export const scrapData = createAsyncThunk(
  'users/scrapData',
  async () => {
    try {
      store.dispatch(setLoading(true));
      store.dispatch(addActionToHistory("Sending Request"));
      const requestData = store.getState().autoscout24.requestData; 
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: requestData.url,
          startPage: requestData.startPage,
          offersNumber: requestData.offers,
          waitingTime: requestData.waitingTime,
          businessType: requestData.businessType,
        }),
      };
      const response = await fetch(
        `${import.meta.env.VITE_APP_AUTOSCOUT24}/scrape`,
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
        const obj = JSON.parse(decodedChunk);
        console.log("--- Yielded Response:",obj);
        if (obj.url !== undefined) {
          if (!store.getState().autoscout24.uniqueObjects.includes(decodedChunk)) {
            store.dispatch(addUniqueObject(decodedChunk));
            obj["data"] = replaceErrorNotFoundWithDashs(obj["data"])
            store.dispatch(addCar(obj));
          } else {
            toast({
              variant: "destructive",
              title: "Product is already in the table.",
              description: "The duplicate version doesn't added to table!",
            });
            console.log("duplicated");
          }
        } else if (obj.error) {
          store.dispatch(setError(obj.error));
          toast({
            variant: "destructive",
            title: "Request blocked.",
            description: obj.error,
          });
          console.log(obj.error);
          setLoading(false);
        } else if (obj.type === "result_info") {
          store.dispatch(setInfo(obj.data));
        } else if (obj.type === "progress") {
          store.dispatch(addActionToHistory(obj.data.message));
        }
      }
    } catch (error) {
      console.log(error);
      store.dispatch(setLoading(false));
      // add later the other errors
    }
  },
)



export const { setRequestData,addActionToHistory,removeSelectedProducts,addCar,setError,addOldRequest,setInfo,setLoading,addUniqueObject,findDublicateNumbers } = autoscout24Slice.actions;

export default autoscout24Slice.reducer;
