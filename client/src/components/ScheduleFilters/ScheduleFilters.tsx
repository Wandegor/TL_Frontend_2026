import styles from "./ScheduleFilters.module.scss";
import { Button } from "../Button/Button.tsx";

const intervals = [
  { label: "1 MIN", value: 1 },
  { label: "2 MIN", value: 2 },
  { label: "3 MIN", value: 3 },
  { label: "4 MIN", value: 4 },
  { label: "5 MIN", value: 5 },
];

type ScheduleFiltersProps = {
  selectedInterval: number;
  onTimeIntervalChange: (interval: number) => void;
};

export const ScheduleFilters = ({
  selectedInterval,
  onTimeIntervalChange,
}: ScheduleFiltersProps) => {
  return (
    <div className={styles.wrapper}>
      {intervals.map((interval) => (
        <Button
          key={interval.label}
          size="small"
          variant="gray"
          className={
            selectedInterval === interval.value ? styles.active : undefined
          }
          onClick={() => {
            onTimeIntervalChange(interval.value);
          }}
        >
          {interval.label}
        </Button>
      ))}
    </div>
  );
};
