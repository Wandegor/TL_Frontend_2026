import type { Currency } from "../types/currency.ts";
import type { PriceChange } from "../types/priceChange.ts";

export type ConverterState = {
  currencies: Currency[];
  priceHistory: PriceChange[];
  isLoading: boolean;
  error: Error | null;
  toastError: Error | null;
};

export const initialState: ConverterState = {
  currencies: [],
  priceHistory: [],
  isLoading: false,
  error: null,
  toastError: null,
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_CURRENCIES_SUCCESS"; payload: Currency[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "FETCH_PRICE_START" }
  | { type: "FETCH_PRICE_SUCCESS"; payload: PriceChange[] }
  | { type: "FETCH_PRICE_ERROR"; payload: string }
  | { type: "CLEAR_PRICE_ERROR" };

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
    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: { name: "Fetch_Error", message: action.payload },
      };

    case "FETCH_PRICE_START":
      return {
        ...state,
        toastError: null,
      };
    case "FETCH_PRICE_SUCCESS":
      return {
        ...state,
        priceHistory: action.payload,
      };
    case "FETCH_PRICE_ERROR":
      return {
        ...state,
        toastError: { name: "Fetch_Price_Error", message: action.payload },
      };
    case "CLEAR_PRICE_ERROR":
      return {
        ...state,
        toastError: null,
      };
    default:
      return state;
  }
};
