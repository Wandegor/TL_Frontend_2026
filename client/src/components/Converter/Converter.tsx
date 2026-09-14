import styles from "../Converter/Converter.module.scss";
import { CurrencyInput } from "../CurrencyInput/CurrencyInput.tsx";
import { MoreAbout } from "../MoreAbout/MoreAbout.tsx";
import { Filter } from "../Filter/Filter.tsx";
import { ScheduleFilters } from "../ScheduleFilters/ScheduleFilters.tsx";
import graph from "../../assets/graf.png";
import { Button } from "../Button/Button.tsx";
import { useConverter } from "../../hooks/useConverter.ts";

export const Converter = () => {
  const {
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
  } = useConverter();

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
            <p className={styles.date}>
              {new Date(priceChange.dateTime).toUTCString()}
            </p>
          </header>
          <div className={styles["currency-rows"]}>
            <CurrencyInput
              amount={amount}
              currencyCode={base}
              currencies={currencyCodes}
              onAmountChange={handleAmountChange}
              onCurrencyChange={handleBaseChange}
              amountLabel="Сумма"
              currencyLabel="Исходная валюта"
            />
            <Button size="tiny" variant="gray" onClick={handleSwap}>
              swap
            </Button>
            <CurrencyInput
              amount={converted}
              currencyCode={quote}
              currencies={currencyCodes}
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
          <ScheduleFilters />
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
};
