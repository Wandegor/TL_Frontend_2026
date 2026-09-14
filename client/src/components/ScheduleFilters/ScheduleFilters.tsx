import styles from "./ScheduleFilters.module.scss";
import { Button } from "../Button/Button.tsx";

const intervals = ["1 min", "2 min", "3 min", "4 min", "5 min"];

export const ScheduleFilters = () => {
  return (
    <div className={styles.wrapper}>
      {intervals.map((interval) => (
        <Button key={interval} size="small" variant="gray">
          {interval}
        </Button>
      ))}
    </div>
  );
};
