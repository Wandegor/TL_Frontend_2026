import type { Currency } from "../types/currency.ts";
import type { PriceChange } from "../types/priceChange.ts";

export type ConverterState = {
  currencies: Currency[];
  priceHistory: PriceChange[];
  isLoading: boolean;
  error: Error | null;
};

export const initialState: ConverterState = {
  currencies: [],
  priceHistory: [],
  isLoading: false,
  error: null,
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_CURRENCIES_SUCCESS"; payload: Currency[] }
  | { type: "FETCH_PRICE_SUCCESS"; payload: PriceChange[] }
  | { type: "FETCH_ERROR"; payload: string };

export const converterReducer = (state: ConverterState, action: Action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "FETCH_CURRENCIES_SUCCESS":
      return {
        ...state,
        isLoading: false,
        currencies: action.payload,
      };
    case "FETCH_PRICE_SUCCESS":
      return {
        ...state,
        isLoading: false,
        priceHistory: action.payload,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: { name: "Fetch_Error", message: action.payload },
      };
    default:
      return state;
  }
};
