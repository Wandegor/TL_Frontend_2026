import styles from "./Converter.module.scss";
import { CurrencyInput } from "../CurrencyInput/CurrencyInput.tsx";
import { MoreAbout } from "../MoreAbout/MoreAbout.tsx";
import { Filter } from "../Filter/Filter.tsx";
import { ScheduleFilters } from "../ScheduleFilters/ScheduleFilters.tsx";
import graph from "../../assets/graf.png";
import { Button } from "../Button/Button.tsx";
import { Toast } from "../Toast/Toast.tsx";
import { useConverter } from "./useConverter.ts";

export const Converter = () => {
  const {
    state,
    baseAmount,
    quoteAmount,
    filters,
    baseCurrency,
    quoteCurrency,
    currencyCodes,
    priceDate,
    savePair,
    selectPair,
    handleBaseChange,
    handleQuoteChange,
    handleSwap,
    handleBaseAmountChange,
    handleQuoteAmountChange,
    clearFilters,
    clearToastError,
  } = useConverter();

  if (state.error) {
    return (
      <div className={styles.status}>
        <div className={styles.error}>{state.error.message}</div>
      </div>
    );
  }

  if (
    state.isLoading ||
    !baseCurrency ||
    !quoteCurrency ||
    !priceDate ||
    state.currencies.length === 0
  ) {
    return (
      <div className={styles.status}>
        <div className={styles.loading}>
          Loading <span className={styles.slashes} />
        </div>
      </div>
    );
  }

  return (
    <>
      {state.toastError && (
        <Toast message={state.toastError.message} onClose={clearToastError} />
      )}

      <section className={styles.card}>
        <div className={styles.top}>
          <div className={styles.left}>
            <header className={styles.head}>
              <p className={styles.kicker}>
                {baseAmount} {baseCurrency.name} is
              </p>
              <h1 className={styles.title}>
                {quoteAmount} {quoteCurrency.name}
              </h1>
              <p className={styles.date}>{priceDate}</p>
            </header>
            <div className={styles.currencyRows}>
              <CurrencyInput
                amount={baseAmount}
                currencyCode={baseCurrency.code}
                currencies={currencyCodes}
                onAmountChange={handleBaseAmountChange}
                onCurrencyChange={handleBaseChange}
                amountLabel="Исходное значение"
                currencyLabel="Исходная валюта"
              />
              <Button size="tiny" variant="gray" onClick={handleSwap}>
                swap
              </Button>
              <CurrencyInput
                amount={quoteAmount}
                currencyCode={quoteCurrency.code}
                currencies={currencyCodes}
                onAmountChange={handleQuoteAmountChange}
                onCurrencyChange={handleQuoteChange}
                amountLabel="Результат"
                currencyLabel="Целевая валюта"
              />
            </div>
            <Filter
              currentPair={{
                base: baseCurrency.code,
                quote: quoteCurrency.code,
              }}
              savedPairs={filters}
              onSave={savePair}
              onSelect={selectPair}
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
        <MoreAbout
          key={`${baseCurrency.code}-${quoteCurrency.code}`}
          baseCurrency={baseCurrency}
          quoteCurrency={quoteCurrency}
        />
      </section>
    </>
  );
};
