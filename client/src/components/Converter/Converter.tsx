import styles from "./Converter.module.scss";
import { CurrencyInput } from "../CurrencyInput/CurrencyInput.tsx";
import { MoreAbout } from "../MoreAbout/MoreAbout.tsx";
import { Filter } from "../Filter/Filter.tsx";
import { ScheduleFilters } from "../ScheduleFilters/ScheduleFilters.tsx";
import graph from "../../assets/graf.png";
import { Button } from "../Button/Button.tsx";
import { useConverter } from "./useConverter.ts";
import { useEffect, useReducer } from "react";
import { getPriceChanges } from "../../api/priceChangeApi.ts";
import { getCurrencies } from "../../api/currencyApi.ts";
import {
  converterReducer,
  initialState,
} from "../../reducer/converterReducer.ts";
import { Toast } from "../Toast/Toast.tsx";

export const Converter = () => {
  const [state, dispatch] = useReducer(converterReducer, initialState);

  const {
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
  } = useConverter(state.currencies, state.priceHistory.at(-1));

  const loadPriceHistory = async (base: string, quote: string) => {
    dispatch({ type: "FETCH_PRICE_START" });

    const pastTime = 5 * 60 * 1000;
    const fromDateTime = new Date(Date.now() - pastTime).toISOString();

    try {
      const priceHistory = await getPriceChanges({
        paymentCurrency: base,
        purchasedCurrency: quote,
        fromDateTime: fromDateTime,
      });

      dispatch({
        type: "FETCH_PRICE_SUCCESS",
        payload: priceHistory,
      });
    } catch {
      dispatch({
        type: "FETCH_PRICE_ERROR",
        payload: "COULD NOT GET PRICE DATA FROM THE SERVER",
      });
    }
  };

  const loadCurrencies = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const currencies = await getCurrencies();

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

  useEffect(() => {
    loadCurrencies().then();
  }, []);

  useEffect(() => {
    if (!baseCurrency || !quoteCurrency) {
      return;
    }

    loadPriceHistory(baseCurrency.code, quoteCurrency.code);
  }, [baseCurrency, quoteCurrency]);

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
        <Toast
          message={state.toastError.message}
          onClose={() => dispatch({ type: "CLEAR_PRICE_ERROR" })}
        ></Toast>
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
          key={`${baseCurrency.code}-${quoteCurrency.code}`}
          baseCurrency={baseCurrency}
          quoteCurrency={quoteCurrency}
        />
      </section>
    </>
  );
};
