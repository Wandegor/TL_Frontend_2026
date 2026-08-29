import { CURRENCIES } from "./data/currencies.ts";
import styles from "./Converter.module.scss";
import { CurrencyInput } from "./components/CurrencyInput/CurrencyInput.tsx";
import { MoreAbout } from "./components/MoreAbout/MoreAbout.tsx";
import { Filter } from "./components/Filter/Filter.tsx";
import type { CurrencyPair } from "./types/currencyPair.ts";
import { ScheduleFilters } from "./components/ScheduleFilters/ScheduleFilters.tsx";
import graph from "./assets/graf.png";

export function Converter() {
  const baseCurrency = CURRENCIES[2];
  const quoteCurrency = CURRENCIES[3];

  const savedPairs: CurrencyPair[] = [
    { base: "PLN", quote: "CAD" },
    { base: "PLN", quote: "JPY" },
  ];

  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <div className={styles.left}>
          <header className={styles.head}>
            <p className={styles.kicker}>1 Polish zloty is</p>

            <h1 className={styles.title}>0.99 Japanese yen</h1>

            <p className={styles.date}> Fri, 05 Apr 2026 10:35 UTC</p>
          </header>
          <div className={styles.currencyRows}>
            <CurrencyInput
              amount={1}
              currencyCode={"PLN"}
              currencies={["PLN", "JPY"]}
              onAmountChange={() => {}}
              onCurrencyChange={() => {}}
              amountLabel="Сумма"
              currencyLabel="Исходная валюта"
            />

            <CurrencyInput
              amount={0.99}
              currencyCode={"JPY"}
              currencies={["PLN", "JPY"]}
              onCurrencyChange={() => {}}
              amountLabel="Результат"
              currencyLabel="Целевая валюта"
            />
          </div>
          <Filter savedPairs={savedPairs} />
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
      <MoreAbout baseCurrency={baseCurrency!} quoteCurrency={quoteCurrency!} />
    </section>
  );
}
