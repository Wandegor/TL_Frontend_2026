import type { CurrencyPair } from "../../types/currencyPair.ts";
import styles from "./Filter.module.scss";
import { Button } from "../Button/Button.tsx";

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
          <Button>
            {pair.base}/{pair.quote}
          </Button>
        ))}
      </div>
    </>
  );
};
