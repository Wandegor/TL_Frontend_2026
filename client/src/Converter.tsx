import styles from "./Converter.module.scss";
import { CurrencyInput } from "./components/CurrencyInput/CurrencyInput.tsx";
import { MoreAbout } from "./components/MoreAbout/MoreAbout.tsx";
import { Filter } from "./components/Filter/Filter.tsx";
import { ScheduleFilters } from "./components/ScheduleFilters/ScheduleFilters.tsx";
import graph from "./assets/graf.png";
import { Button } from "./components/Button/Button.tsx";
import { useConverter } from "./hooks/useConverter.ts";
import { useEffect, useReducer } from "react";
import { getCurrencies } from "./api/currencyApi.ts";
import { converterReducer, initialState } from "./reducer/converterReducer.ts";
import { mapCurrencyDtoToCurrency } from "./mappers/currencyMapper.ts";

export function Converter() {
  const [state, dispatch] = useReducer(converterReducer, initialState);

  useEffect(() => {
    const loadCurrencies = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const currencyDtos = await getCurrencies();
        const currencies = currencyDtos.map(mapCurrencyDtoToCurrency);

        dispatch({
          type: "FETCH_CURRENCIES_SUCCESS",
          payload: currencies,
        });
      } catch {
        dispatch({
          type: "FETCH_ERROR",
          payload: "COULD NOT GET DATA FROM THE SERVER",
        });
      }
    };
    loadCurrencies();
  }, []);

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
  } = useConverter(state.currencies);

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
          <div className={styles.currencyRows}>
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
}
