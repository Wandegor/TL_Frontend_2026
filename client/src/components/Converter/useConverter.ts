import { useState } from "react";
import { currencies } from "../../data/currencies.ts";
import { priceChanges } from "../../data/priceChanges.ts";
import type { CurrencyPair } from "../../types/currencyPair.ts";

export function useConverter() {
  const [base, setBase] = useState(currencies[1].code);
  const [quote, setQuote] = useState(currencies[3].code);
  const initAmount = 100;
  const [baseAmount, setBaseAmount] = useState(initAmount);
  const [quoteAmount, setQuoteAmount] = useState(
    priceChanges[base][quote].price * baseAmount,
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

  const priceDate = new Date(priceChanges[base][quote].dateTime).toUTCString();
  const rate = priceChanges[base][quote].price;

  const savePair = (pair: CurrencyPair) => {
    const saved = filters.some(
      (p) => p.base === pair.base && p.quote === pair.quote,
    );
    if (saved) {
      return;
    }
    setFilters((prev) => [...prev, pair]);
  };

  const convertFormula = (baseAmount: number, rate: number) => {
    return Number((baseAmount * rate).toFixed(2));
  };
  const convertReverseFormula = (baseAmount: number, rate: number) => {
    return Number((baseAmount / rate).toFixed(2));
  };

  const selectPair = (pair: CurrencyPair) => {
    const newRate = priceChanges[pair.base][pair.quote].price;
    setBase(pair.base);
    setQuote(pair.quote);
    setQuoteAmount(convertFormula(baseAmount, newRate));
  };

  const handleBaseChange = (value: string) => {
    if (value === quote) {
      handleSwap();
      return;
    }
    const newRate = priceChanges[value][quote].price;
    setBase(value);
    setQuoteAmount(convertFormula(baseAmount, newRate));
  };
  const handleQuoteChange = (value: string) => {
    if (value === base) {
      handleSwap();
      return;
    }
    const newRate = priceChanges[base][value].price;
    setQuote(value);
    setQuoteAmount(convertFormula(baseAmount, newRate));
  };

  const handleSwap = () => {
    const newRate = priceChanges[quote][base].price;
    setBase(quote);
    setQuote(base);
    setQuoteAmount(convertFormula(baseAmount, newRate));
  };

  const handleBaseAmountChange = (value: number) => {
    setBaseAmount(value);
    setQuoteAmount(convertFormula(value, rate));
  };
  const handleQuoteAmountChange = (value: number) => {
    setQuoteAmount(value);
    setBaseAmount(convertReverseFormula(value, rate));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  return {
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
  };
}
