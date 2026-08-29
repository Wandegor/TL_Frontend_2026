import styles from "./MoreAbout.module.scss";
import type { Currency } from "../../types/currency.ts";
import arrow from "../../assets/arrow.svg";

type MoreAboutProps = {
  baseCurrency: Currency;
  quoteCurrency: Currency;
};

export const MoreAbout = ({ baseCurrency, quoteCurrency }: MoreAboutProps) => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <button className={styles.button} type="button" onClick={() => {}}>
          {baseCurrency.code}/{quoteCurrency.code}: about
          <span className={styles.arrow} aria-hidden="true">
            <img src={arrow} alt="" className={styles.arrowOpen} />
          </span>
        </button>

        <div className={styles.line} />
      </div>

      <article className={styles.article}>
        <h2>
          {baseCurrency.title} - {baseCurrency.code} - {baseCurrency.symbol}
        </h2>
        <p> {baseCurrency.description} </p>
      </article>

      <article className={styles.article}>
        <h2>
          {quoteCurrency.title} - {quoteCurrency.code} - {quoteCurrency.symbol}
        </h2>
        <p> {quoteCurrency.description} </p>
      </article>
    </section>
  );
};
