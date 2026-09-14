import type { CurrencyPair } from "../../types/currencyPair.ts";
import styles from "./Filter.module.scss";
import { Button } from "../Button/Button.tsx";

type SavedPairsProps = {
  savedPairs: CurrencyPair[];
};

export const Filter = ({ savedPairs }: SavedPairsProps) => {
  return (
    <>
      <div className={styles["button-wrapper"]}>
        <Button size="large" variant="blue">
          + SAVE FILTER
        </Button>

        <Button size="large" variant="red">
          CLEAR FILTERS
        </Button>
      </div>
      <div className={styles["filters-wrapper"]}>
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
