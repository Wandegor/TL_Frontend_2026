import { CURRENCIES } from "./data/currencies.ts";
import styles from "./Converter.module.scss";
import { CurrencyInput } from "./components/CurrencyInput/CurrencyInput.tsx";
import { MoreAbout } from "./components/MoreAbout/MoreAbout.tsx";
import { Filter } from "./components/Filter/Filter.tsx";
import type { CurrencyPair } from "./types/currencyPair.ts";
import { ScheduleFilters } from "./components/ScheduleFilters/ScheduleFilters.tsx";
import graph from "./assets/graf.png";
import { useState } from "react";
import { priceChanges } from "./data/priceChanges.ts";
import { Button } from "./components/Button/Button.tsx";

export function Converter() {
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
    { base: CURRENCIES[1].code, quote: CURRENCIES[3].code },
  ]);
  const baseCurrency = CURRENCIES.find((currency) => currency.code === base);
  const quoteCurrency = CURRENCIES.find((currency) => currency.code === quote);
  if (!baseCurrency || !quoteCurrency) {
    return null;
  }
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
  const selectPair = (pair: CurrencyPair) => {
    const newRate = priceChanges[pair.base][pair.quote].price;
    setBase(pair.base);
    setQuote(pair.quote);
    setConverted(Number((amount * newRate).toFixed(2)));
  };
  const handleBaseChange = (value: string) => {
    if (value === quote) {
      return;
    }
    const newRate = priceChanges[value][quote].price;
    setBase(value);
    setConverted(Number((amount * newRate).toFixed(2)));
  };
  const handleQuoteChange = (value: string) => {
    if (value === base) {
      return;
    }
    const newRate = priceChanges[base][value].price;
    setQuote(value);
    setConverted(Number((amount * newRate).toFixed(2)));
  };
  const handleSwap = () => {
    const newRate = priceChanges[quote][base].price;
    setBase(quote);
    setQuote(base);
    setConverted(Number((amount * newRate).toFixed(2)));
  };
  const handleAmountChange = (value: number) => {
    setAmount(value);
    setConverted(Number((value * rate).toFixed(2)));
  };
  const handleQuoteAmountChange = (value: number) => {
    setConverted(value);
    setAmount(Number((value / rate).toFixed(2)));
  };
  const clearFilters = () => {
    setFilters([]);
  };
  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <div className={styles.left}>
          <header className={styles.head}>
            <p className={styles.kicker}>
              {" "}
              {amount} {baseCurrency.name} is{" "}
            </p>{" "}
            <h1 className={styles.title}>
              {" "}
              {converted} {quoteCurrency.name}{" "}
            </h1>{" "}
            <p className={styles.date}>
              {" "}
              {new Date(priceChange.dateTime).toUTCString()}{" "}
            </p>
          </header>
          <div className={styles.currencyRows}>
            <CurrencyInput
              amount={amount}
              currencyCode={base}
              currencies={CURRENCY_CODES}
              onAmountChange={handleAmountChange}
              onCurrencyChange={handleBaseChange}
              amountLabel="Сумма"
              currencyLabel="Исходная валюта"
            />{" "}
            <Button size="tiny" variant="gray" onClick={handleSwap}>
              {" "}
              swap{" "}
            </Button>
            <CurrencyInput
              amount={converted}
              currencyCode={quote}
              currencies={CURRENCY_CODES}
              onAmountChange={handleQuoteAmountChange}
              onCurrencyChange={handleQuoteChange}
              amountLabel="Результат"
              currencyLabel="Целевая валюта"
            />
          </div>
          <Filter
            currentPair={{ base, quote }}
            savedPairs={filters}
            onSave={savePair}
            onSelect={(pair) => selectPair(pair)}
            onClear={clearFilters}
          />
        </div>
        <div className={styles.right}>
          <ScheduleFilters />{" "}
          <img
            className={styles.schedule}
            src={graph}
            alt="Currency exchange rate graph"
          />
        </div>
      </div>
      {/*Когда меняется валюта, меняется ключ => пересоздание компонента и isOpen внутри сбрасывается*/}{" "}
      <MoreAbout
        key={`${base}-${quote}`}
        baseCurrency={baseCurrency}
        quoteCurrency={quoteCurrency}
      />
    </section>
  );
}
