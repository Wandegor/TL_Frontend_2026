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

export function Converter() {
  const [base, setBase] = useState("PLN");
  const [quote, setQuote] = useState("JPY");
  const [amount, setAmount] = useState(100);

  const [filters, setFilters] = useState<CurrencyPair[]>([
    { base: "PLN", quote: "CAD" },
    { base: "PLN", quote: "JPY" },
  ]);

  const baseCurrency = CURRENCIES.find((currency) => currency.code === base);
  const quoteCurrency = CURRENCIES.find((currency) => currency.code === quote);
  if (!baseCurrency || !quoteCurrency) {
    return null;
  }
  const CURRENCY_CODES = CURRENCIES.map((currency) => currency.code);

  const priceChange = priceChanges[base][quote];
  const rate = priceChange.price;

  const converted = Number((amount * rate).toFixed(2));

  const savePair = (pair: CurrencyPair) => {
    const saved = filters.some(
      (p) => p.base === pair.base && p.quote === pair.quote,
    );
    if (saved) {
      return;
    }
    setFilters((prev) => [...prev, pair]);
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

  const clearFilters = () => {
    setFilters([]);
  }

  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <div className={styles.left}>
          <header className={styles.head}>
            <p className={styles.kicker}>
              {amount} {baseCurrency.name} is
            </p>

            <h1 className={styles.title}>
              {converted} {quoteCurrency.name}
            </h1>

            <p className={styles.date}>{priceChange.dateTime}</p>
          </header>
          <div className={styles.currencyRows}>
            <CurrencyInput
              amount={amount}
              currencyCode={base}
              currencies={CURRENCY_CODES}
              onAmountChange={setAmount}
              onCurrencyChange={handleBaseChange}
              amountLabel="Сумма"
              currencyLabel="Исходная валюта"
            />

            <CurrencyInput
              amount={converted ?? 0}
              currencyCode={quote}
              currencies={CURRENCY_CODES}
              onCurrencyChange={handleQuoteChange}
              amountLabel="Результат"
              currencyLabel="Целевая валюта"
            />
          </div>
          // TODO: сделать кнопку-Swap валют
          <Filter
            currentPair={{ base, quote }}
            savedPairs={filters}
            onSave={savePair}
            onSelect={(pair) => {
              setBase(pair.base);
              setQuote(pair.quote);
            }}
            onClear={clearFilters}
          />
        </div>
        <div className={styles.right}>
          <ScheduleFilters />
          <img
            className={styles.schedule}
            src={graph}
            alt="Currency exchange rate graph"
          />
        </div>
      </div>
      <MoreAbout baseCurrency={baseCurrency} quoteCurrency={quoteCurrency} />
    </section>
  );
}
