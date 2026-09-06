import { useEffect, useState } from "react";
import type { CurrencyPair } from "../types/currencyPair.ts";
import type { Currency } from "../types/currency.ts";
import type { PriceChange } from "../types/priceChange.ts";

export function useConverter(
  currencies: Currency[],
  priceChange: PriceChange | undefined,
) {
  const [base, setBase] = useState<string | null>(null);
  const [quote, setQuote] = useState<string | null>(null);
  const [amount, setAmount] = useState(100);
  const [converted, setConverted] = useState(0);
  const [filters, setFilters] = useState<CurrencyPair[]>([]);

  const convertFormula = (amount: number, rate: number) => {
    return Number((amount * rate).toFixed(2));
  };

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

  useEffect(() => {
    if (!priceChange) {
      return;
    }

    setConverted(convertFormula(amount, priceChange.price));
  }, [priceChange]);

  const baseCurrency = currencies.find((currency) => currency.code === base);
  const quoteCurrency = currencies.find((currency) => currency.code === quote);
  const currencyCodes = currencies.map((currency) => currency.code);

  const rate = priceChange?.price ?? 0; // временно

  const savePair = (pair: CurrencyPair) => {
    const saved = filters.some(
      (p) => p.base === pair.base && p.quote === pair.quote,
    );
    if (saved) {
      return;
    }
    setFilters((prev) => [...prev, pair]);
  };

  const handleAmountChange = (value: number) => {
    setAmount(value);
    setConverted(convertFormula(value, rate));
  };

  const handleQuoteAmountChange = (value: number) => {
    setConverted(value);
    setAmount(Number((value / rate).toFixed(2)));
  };

  const handleBaseChange = (value: string) => {
    if (value === quote) {
      return;
    }

    setBase(value);
  };

  const handleQuoteChange = (value: string) => {
    if (value === base) {
      return;
    }

    setQuote(value);
  };

  const handleSwap = () => {
    setBase(quote);
    setQuote(base);
  };

  const selectPair = (pair: CurrencyPair) => {
    setBase(pair.base);
    setQuote(pair.quote);
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
