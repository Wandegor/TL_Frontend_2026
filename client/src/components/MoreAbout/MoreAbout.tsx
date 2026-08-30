import styles from "./MoreAbout.module.scss";
import type { Currency } from "../../types/currency.ts";
import arrow from "../../assets/arrow.svg";
import { useState } from "react";
import { Button } from "../Button/Button.tsx";

type MoreAboutProps = {
  baseCurrency: Currency;
  quoteCurrency: Currency;
};

export const MoreAbout = ({ baseCurrency, quoteCurrency }: MoreAboutProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <Button
          size="medium"
          variant="gray"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {baseCurrency.code}/{quoteCurrency.code}: about
          <span className={styles.arrow} aria-hidden="true">
            <img
              src={arrow}
              alt=""
              className={isOpen ? styles.arrowOpen : ""}
            />
          </span>
        </Button>

        {isOpen && <div className={styles.line} />}
      </div>

      {isOpen && (
        <div>
          <article className={styles.article}>
            <h2>
              {baseCurrency.name} - {baseCurrency.code} - {baseCurrency.symbol}
            </h2>
            <p>{baseCurrency.description || "Description is not available"}</p>
          </article>

          <article className={styles.article}>
            <h2>
              {quoteCurrency.name} - {quoteCurrency.code} -{" "}
              {quoteCurrency.symbol}
            </h2>
            <p>{quoteCurrency.description || "Description is not available"}</p>
          </article>
        </div>
      )}
    </section>
  );
};
