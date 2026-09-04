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
        <Button size="large" variant="blue">
          + SAVE FILTER
        </Button>

        <Button size="large" variant="red">
          CLEAR FILTERS
        </Button>
      </div>
      <div className={styles.filtersWrapper}>
        {savedPairs.map((pair) => (
          <Button
            key={`${pair.base}-${pair.quote}`}
            size="small"
            variant="gray"
          >
            {pair.base}/{pair.quote}
          </Button>
        ))}
      </div>
    </>
  );
};
