import styles from "./CurrencyInput.module.scss";

type CurrencyInputProps = {
  amount: number;
  currencyCode: string;
  currencies: string[];
  onAmountChange?: (value: number) => void;
  onCurrencyChange?: (value: string) => void;
  amountLabel: string;
  currencyLabel: string;
};

export const CurrencyInput = ({
  amount,
  currencyCode,
  currencies,
  onAmountChange,
  onCurrencyChange,
  amountLabel,
  currencyLabel,
}: CurrencyInputProps) => {
  return (
    <div className={styles.field}>
      <input
        className={styles.amount}
        type="number"
        value={amount}
        onChange={(e) => onAmountChange?.(Number(e.target.value))}
        aria-label={amountLabel}
      />

      <div className={styles.divider} aria-hidden="true" />

      <select
        className={styles.currency}
        value={currencyCode}
        onChange={(e) => onCurrencyChange?.(e.target.value)}
        aria-label={currencyLabel}
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
};
