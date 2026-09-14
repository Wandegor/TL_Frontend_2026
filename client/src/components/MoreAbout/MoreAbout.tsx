import styles from "./MoreAbout.module.scss";
import type { Currency } from "../../types/currency.ts";
import arrow from "../../assets/arrow.svg";
import { useState } from "react";
import { Button } from "../Button/Button.tsx";
import { CurrencyInfo } from "../CurrencyInfo/CurrencyInfo.tsx";

type MoreAboutProps = {
  baseCurrency: Currency;
  quoteCurrency: Currency;
};

export const MoreAbout = ({ baseCurrency, quoteCurrency }: MoreAboutProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
              className={isOpen ? styles["arrow-open"] : ""}
            />
          </span>
        </Button>

        {isOpen && <div className={styles.line} />}
      </div>

      {isOpen && (
        <div>
          <CurrencyInfo currency={baseCurrency} />
          <CurrencyInfo currency={quoteCurrency} />
        </div>
      )}
    </section>
  );
};
