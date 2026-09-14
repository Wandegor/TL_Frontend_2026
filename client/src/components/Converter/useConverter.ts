import { useCallback, useEffect, useReducer, useState } from "react";
import type { CurrencyPair } from "../../types/currencyPair.ts";
import { getCurrencies } from "../../api/currencyApi.ts";
import { getPriceChanges } from "../../api/priceChangeApi.ts";
import {
  converterReducer,
  initialState,
} from "../../reducer/converterReducer.ts";

const initial_amount = 100;
const initial_interval = 3;
const refresh_interval = 10000;
const minutes_to_ms = 60 * 1000;

type AmountSource = "base" | "quote";

type AmountInfo = {
  value: number;
  source: AmountSource;
};

export function useConverter() {
  const [state, dispatch] = useReducer(converterReducer, initialState);

  const [selectedBaseCode, setSelectedBaseCode] = useState<string | null>(null);
  const [selectedQuoteCode, setSelectedQuoteCode] = useState<string | null>(
    null,
  );

  const [filters, setFilters] = useState<CurrencyPair[]>([]);

  const [amountInfo, setAmountInfo] = useState<AmountInfo>({
    value: initial_amount,
    source: "base",
  });

  const [timeInterval, setTimeInterval] = useState(initial_interval);

  const currencies = state.currencies;

  const baseCode = selectedBaseCode ?? currencies[0]?.code ?? null;
  const quoteCode = selectedQuoteCode ?? currencies[1]?.code ?? null;

  const priceChange = state.priceHistory.at(-1);
  const rate = priceChange?.price ?? 0;

  const loadCurrencies = useCallback(async () => {
    dispatch({ type: "FETCH_START" });

    try {
      const currencies = await getCurrencies();

      dispatch({
        type: "FETCH_CURRENCIES_SUCCESS",
        payload: currencies,
      });
    } catch {
      dispatch({
        type: "FETCH_ERROR",
        payload: "COULD NOT GET DATA FROM THE SERVER",
      });
    }
  }, []);

  const loadPriceHistory = useCallback(
    async (base: string, quote: string, signal: AbortSignal) => {
      dispatch({ type: "FETCH_PRICE_START" });

      const fromDateTime = new Date(
        Date.now() - timeInterval * minutes_to_ms,
      ).toISOString();

      try {
        const priceHistory = await getPriceChanges(
          {
            paymentCurrency: base,
            purchasedCurrency: quote,
            fromDateTime,
          },
          signal,
        );

        if (signal.aborted) {
          return;
        }

        dispatch({
          type: "FETCH_PRICE_SUCCESS",
          payload: priceHistory,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (signal.aborted) {
          return;
        }

        dispatch({
          type: "FETCH_PRICE_ERROR",
          payload: "COULD NOT GET PRICE DATA FROM THE SERVER",
        });
      }
    },
    [timeInterval],
  );

  useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);

  useEffect(() => {
    if (!baseCode || !quoteCode) {
      return;
    }

    const controller = new AbortController();

    let timeoutId: ReturnType<typeof setTimeout>;

    const updatePriceHistory = async () => {
      await loadPriceHistory(baseCode, quoteCode, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      timeoutId = setTimeout(updatePriceHistory, refresh_interval);
    };

    updatePriceHistory();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [baseCode, quoteCode, timeInterval, loadPriceHistory]);

  const convertFormula = (baseAmount: number, rate: number) => {
    return Number((baseAmount * rate).toFixed(2));
  };
  const convertReverseFormula = (amount: number, rate: number) => {
    return Number((amount / rate).toFixed(2));
  };

  let baseAmount: number;
  let quoteAmount: number;

  if (amountInfo.source === "base") {
    baseAmount = amountInfo.value;
    quoteAmount = rate ? convertFormula(amountInfo.value, rate) : 0;
  } else {
    quoteAmount = amountInfo.value;
    baseAmount = rate ? convertReverseFormula(amountInfo.value, rate) : 0;
  }

  const baseCurrency = currencies.find(
    (currency) => currency.code === baseCode,
  );

  const quoteCurrency = currencies.find(
    (currency) => currency.code === quoteCode,
  );

  const currencyCodes = currencies.map((currency) => currency.code);

  const priceDate = priceChange?.dateTime.toUTCString() ?? "";

  const savePair = (pair: CurrencyPair) => {
    const saved = filters.some(
      (savedPair) =>
        savedPair.base === pair.base && savedPair.quote === pair.quote,
    );

    if (saved) {
      return;
    }

    setFilters((prev) => [...prev, pair]);
  };

  const selectPair = (pair: CurrencyPair) => {
    setSelectedBaseCode(pair.base);
    setSelectedQuoteCode(pair.quote);
  };

  const handleBaseAmountChange = (value: number) => {
    setAmountInfo({ value, source: "base" });
  };

  const handleQuoteAmountChange = (value: number) => {
    setAmountInfo({ value, source: "quote" });
  };

  const handleSwap = () => {
    setSelectedBaseCode(quoteCode);
    setSelectedQuoteCode(baseCode);
  };

  const handleBaseChange = (value: string) => {
    if (value === quoteCode) {
      handleSwap();
      return;
    }

    setSelectedBaseCode(value);
  };

  const handleQuoteChange = (value: string) => {
    if (value === baseCode) {
      handleSwap();
      return;
    }

    setSelectedQuoteCode(value);
  };

  const clearFilters = () => {
    setFilters([]);
  };

  const clearToastError = () => {
    dispatch({ type: "CLEAR_PRICE_ERROR" });
  };

  return {
    state,
    baseAmount,
    quoteAmount,
    filters,
    baseCurrency,
    quoteCurrency,
    currencyCodes,
    priceDate,
    savePair,
    selectPair,
    handleBaseChange,
    handleQuoteChange,
    handleSwap,
    handleBaseAmountChange,
    handleQuoteAmountChange,
    clearFilters,
    clearToastError,
    timeInterval,
    setTimeInterval,
  };
}
