import styles from "./CurrencyInfo.module.scss";
import type { Currency } from "../../types/currency.ts";

type CurrencyInfoProps = {
  currency: Currency;
};

export const CurrencyInfo = ({ currency }: CurrencyInfoProps) => {
  return (
    <article className={styles.article}>
      <h2>
        {currency.name} - {currency.code} - {currency.symbol}
      </h2>

      <p>{currency.description || "Description is not available"}</p>
    </article>
  );
};
