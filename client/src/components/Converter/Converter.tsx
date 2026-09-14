import { currencies } from "../../data/currencies.ts";
import styles from "./Converter.module.scss";
import { CurrencyInput } from "../CurrencyInput/CurrencyInput.tsx";
import { MoreAbout } from "../MoreAbout/MoreAbout.tsx";
import { Filter } from "../Filter/Filter.tsx";
import type { CurrencyPair } from "../../types/currencyPair.ts";
import { ScheduleFilters } from "../ScheduleFilters/ScheduleFilters.tsx";
import graph from "../../assets/graf.png";

export const Converter = () => {
  const baseCurrency = currencies[2];
  const quoteCurrency = currencies[3];

  const filters: CurrencyPair[] = [
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
          <div className={styles["currency-rows"]}>
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
          <Filter savedPairs={filters} />
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
};
