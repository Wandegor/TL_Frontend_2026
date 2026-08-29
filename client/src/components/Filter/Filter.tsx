import type { CurrencyPair } from "../../types/currencyPair.ts";
import styles from "./Filter.module.scss";

type SavedPairsProps = {
  savedPairs: CurrencyPair[];
};

export const Filter = ({ savedPairs }: SavedPairsProps) => {
  return (
    <>
      <div className={styles.buttonWrapper}>
        <button className={styles.saveButton} type="button" onClick={() => {}}>
          + SAVE FILTER
        </button>
        <button className={styles.clearButton} type="button" onClick={() => {}}>
          CLEAR FILTERS
        </button>
      </div>
      <div className={styles.filtersWrapper}>
        {savedPairs.map((pair) => (
          <button
            className={styles.filterButton}
            key={`${pair.base}-${pair.quote}`}
            type="button"
            onClick={() => {}}
          >
            {pair.base}/{pair.quote}
          </button>
        ))}
      </div>
    </>
  );
};
