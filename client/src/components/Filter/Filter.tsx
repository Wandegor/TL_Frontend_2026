import type { CurrencyPair } from "../../types/currencyPair.ts";
import styles from "./Filter.module.scss";
import { Button } from "../Button/Button.tsx";

type SavedPairsProps = {
  currentPair: CurrencyPair;
  savedPairs: CurrencyPair[];
  onSave: (pair: CurrencyPair) => void;
  onSelect: (pair: CurrencyPair) => void;
  onClear: () => void;
};

export const Filter = ({
  currentPair,
  savedPairs,
  onSave,
  onSelect,
  onClear,
}: SavedPairsProps) => {
  return (
    <>
      <div className={styles.buttonWrapper}>
        <Button size="large" variant="blue" onClick={() => onSave(currentPair)}>
          + SAVE FILTER
        </Button>

        <Button size="large" variant="red" onClick={() => onClear()}>
          CLEAR FILTERS
        </Button>
      </div>
      <div className={styles.filtersWrapper}>
        {savedPairs.map((pair) => (
          <Button
            key={`${pair.base}-${pair.quote}`}
            size="small"
            variant="gray"
            onClick={() => onSelect(pair)}
          >
            {pair.base}/{pair.quote}
          </Button>
        ))}
      </div>
    </>
  );
};
