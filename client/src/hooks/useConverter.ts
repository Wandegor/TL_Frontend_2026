import { useState } from "react";
import { currencies } from "../data/currencies.ts";
import { priceChanges } from "../data/priceChanges.ts";
import type { CurrencyPair } from "../types/currencyPair.ts";

export function useConverter() {
  const [base, setBase] = useState(currencies[1].code);
  const [quote, setQuote] = useState(currencies[3].code);
  const initAmount = 100;
  const [amount, setAmount] = useState(initAmount);
  const [converted, setConverted] = useState(
    priceChanges[base][quote].price * amount,
  );

  const [filters, setFilters] = useState<CurrencyPair[]>([
    {
      base: currencies[1].code,
      quote: currencies[0].code,
    },
    {
      base: currencies[1].code,
      quote: currencies[3].code,
    },
  ]);
  const baseCurrency = currencies.find((currency) => currency.code === base);
  const quoteCurrency = currencies.find((currency) => currency.code === quote);

  // теоретически такого быть не может, но всё же
  if (!baseCurrency || !quoteCurrency) {
    throw new Error("Currency not found");
  }

  const currencyCodes = currencies.map((currency) => currency.code);

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
