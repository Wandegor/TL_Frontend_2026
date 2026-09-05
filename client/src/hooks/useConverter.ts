import { useState } from "react";
import { CURRENCIES } from "../data/currencies.ts";
import { priceChanges } from "../data/priceChanges.ts";
import type { CurrencyPair } from "../types/currencyPair.ts";

export function useConverter() {
  const [base, setBase] = useState(CURRENCIES[1].code);
  const [quote, setQuote] = useState(CURRENCIES[3].code);
  const [amount, setAmount] = useState(100);
  const [converted, setConverted] = useState(
    priceChanges[base][quote].price * amount,
  );

  const [filters, setFilters] = useState<CurrencyPair[]>([
    {
      base: CURRENCIES[1].code,
      quote: CURRENCIES[0].code,
    },
    {
      base: CURRENCIES[1].code,
      quote: CURRENCIES[3].code,
    },
  ]);
  const baseCurrency = CURRENCIES.find((currency) => currency.code === base);
  const quoteCurrency = CURRENCIES.find((currency) => currency.code === quote);

  const CURRENCY_CODES = CURRENCIES.map((currency) => currency.code);

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
    CURRENCY_CODES,
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
