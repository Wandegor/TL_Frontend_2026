import { useEffect, useState } from "react";
import { priceChanges } from "../data/priceChanges.ts";
import type { CurrencyPair } from "../types/currencyPair.ts";
import type { Currency } from "../types/currency.ts";

export function useConverter(currencies: Currency[]) {
  const [base, setBase] = useState<string | null>(null);
  const [quote, setQuote] = useState<string | null>(null);
  const [amount, setAmount] = useState(100);
  const [converted, setConverted] = useState(0);
  const [filters, setFilters] = useState<CurrencyPair[]>([]);

  useEffect(() => {
    if (currencies.length < 2) return;

    setBase((prev) => prev ?? currencies[0].code);
    setQuote((prev) => prev ?? currencies[1].code);

    setFilters((prev) => {
      if (prev.length > 0) {
        return prev;
      }

      return [
        {
          base: currencies[0].code,
          quote: currencies[1].code,
        },
      ];
    });
  }, [currencies]);

  const baseCurrency = currencies.find((currency) => currency.code === base);
  const quoteCurrency = currencies.find((currency) => currency.code === quote);
  const currencyCodes = currencies.map((currency) => currency.code);

  // API не загрузилось
  if (!base || !quote || !baseCurrency || !quoteCurrency) {
    return {
      base,
      quote,
      amount,
      converted,
      filters,
      baseCurrency: null,
      quoteCurrency: null,
      currencyCodes,
      priceChange: null,
      savePair: () => {},
      selectPair: () => {},
      handleBaseChange: () => {},
      handleQuoteChange: () => {},
      handleSwap: () => {},
      handleAmountChange: () => {},
      handleQuoteAmountChange: () => {},
      clearFilters: () => {},
    };
  }

  const priceChange = priceChanges[base][quote];
  const rate = priceChange.price;

  const savePair = (pair: CurrencyPair) => {
    const saved = filters.some(
      (p) => p.base === pair.base && p.quote === pair.quote,
    );
    if (saved) {
      return;
    }
    setFilters((prev) => [...prev, pair]);
  };

  const convertFormula = (amount: number, rate: number) => {
    return Number((amount * rate).toFixed(2));
  };

  const selectPair = (pair: CurrencyPair) => {
    const newRate = priceChanges[pair.base][pair.quote].price;
    setBase(pair.base);
    setQuote(pair.quote);
    setConverted(convertFormula(amount, newRate));
  };

  const handleBaseChange = (value: string) => {
    if (value === quote) {
      return;
    }
    const newRate = priceChanges[value][quote].price;
    setBase(value);
    setConverted(convertFormula(amount, newRate));
  };
  const handleQuoteChange = (value: string) => {
    if (value === base) {
      return;
    }
    const newRate = priceChanges[base][value].price;
    setQuote(value);
    setConverted(convertFormula(amount, newRate));
  };

  const handleSwap = () => {
    const newRate = priceChanges[quote][base].price;
    setBase(quote);
    setQuote(base);
    setConverted(convertFormula(amount, newRate));
  };

  const handleAmountChange = (value: number) => {
    setAmount(value);
    setConverted(convertFormula(value, rate));
  };
  const handleQuoteAmountChange = (value: number) => {
    setConverted(value);
    setAmount(Number((value / rate).toFixed(2)));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  return {
    base,
    quote,
    amount,
    converted,
    filters,
    baseCurrency,
    quoteCurrency,
    currencyCodes,
    priceChange,
    savePair,
    selectPair,
    handleBaseChange,
    handleQuoteChange,
    handleSwap,
    handleAmountChange,
    handleQuoteAmountChange,
    clearFilters,
  };
}
