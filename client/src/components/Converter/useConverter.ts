import { useState, useEffect, useCallback, useReducer } from "react";
import type { CurrencyPair } from "../../types/currencyPair.ts";
import { getPriceChanges } from "../../api/priceChangeApi.ts";
import { getCurrencies } from "../../api/currencyApi.ts";
import {
  converterReducer,
  initialState,
} from "../../reducer/converterReducer.ts";

export function useConverter() {
  const [state, dispatch] = useReducer(converterReducer, initialState);

  const [baseCode, setBaseCode] = useState<string | null>(null);
  const [quoteCode, setQuoteCode] = useState<string | null>(null);
  const [filters, setFilters] = useState<CurrencyPair[]>([]);

  const [amountInfo, setAmountInfo] = useState({ value: 100, source: "base" });

  const loadCurrencies = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const currencies = await getCurrencies();
      dispatch({ type: "FETCH_CURRENCIES_SUCCESS", payload: currencies });

      if (currencies.length >= 2) {
        setBaseCode((prev) => prev ?? currencies[0].code);
        setQuoteCode((prev) => prev ?? currencies[1].code);
        setFilters((prev) => {
          if (prev.length > 0) return prev;
          return [{ base: currencies[0].code, quote: currencies[1].code }];
        });
      }
    } catch {
      dispatch({
        type: "FETCH_ERROR",
        payload: "COULD NOT GET DATA FROM THE SERVER",
      });
    }
  }, []);

  const loadPriceHistory = useCallback(async (base: string, quote: string) => {
    dispatch({ type: "FETCH_PRICE_START" });
    const pastTime = 5 * 60 * 1000;
    const fromDateTime = new Date(Date.now() - pastTime).toISOString();

    try {
      const priceHistory = await getPriceChanges({
        paymentCurrency: base,
        purchasedCurrency: quote,
        fromDateTime: fromDateTime,
      });

      dispatch({ type: "FETCH_PRICE_SUCCESS", payload: priceHistory });
    } catch {
      dispatch({
        type: "FETCH_PRICE_ERROR",
        payload: "COULD NOT GET PRICE DATA FROM THE SERVER",
      });
    }
  }, []);

  useEffect(() => {
    loadCurrencies().then();
  }, [loadCurrencies]);

  useEffect(() => {
    if (baseCode && quoteCode) {
      loadPriceHistory(baseCode, quoteCode).then();
    }
  }, [baseCode, quoteCode, loadPriceHistory]);

  const currencies = state.currencies;
  const priceChange = state.priceHistory.at(-1);
  const rate = priceChange?.price ?? 0;

  const convertFormula = (baseAmount: number, rate: number) => {
    return Number((baseAmount * rate).toFixed(2));
  };
  const convertReverseFormula = (amount: number, rate: number) => {
    return Number((amount / rate).toFixed(2));
  };

  let baseAmount;
  let quoteAmount;

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
      (p) => p.base === pair.base && p.quote === pair.quote,
    );
    if (!saved) {
      setFilters((prev) => [...prev, pair]);
    }
  };

  const handleBaseAmountChange = (value: number) => {
    setAmountInfo({ value, source: "base" });
  };

  const handleQuoteAmountChange = (value: number) => {
    setAmountInfo({ value, source: "quote" });
  };

  const handleSwap = () => {
    setBaseCode(quoteCode);
    setQuoteCode(baseCode);
  };

  const handleBaseChange = (value: string) => {
    if (value === quoteCode) {
      handleSwap();
      return;
    }
    setBaseCode(value);
  };

  const handleQuoteChange = (value: string) => {
    if (value === baseCode) {
      handleSwap();
      return;
    }
    setQuoteCode(value);
  };

  const selectPair = (pair: CurrencyPair) => {
    setBaseCode(pair.base);
    setQuoteCode(pair.quote);
  };

  const clearFilters = () => setFilters([]);
  const clearToastError = () => dispatch({ type: "CLEAR_PRICE_ERROR" });

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
  };
}
