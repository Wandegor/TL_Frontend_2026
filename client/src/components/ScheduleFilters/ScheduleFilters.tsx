import styles from "./ScheduleFilters.module.scss";

const intervals = ["1 min", "2 min", "3 min", "4 min", "5 min"];

export const ScheduleFilters = () => {
  return (
    <div className={styles.wrapper}>
      {intervals.map((interval) => (
        <button
          key={interval}
          className={styles.button}
          type="button"
          onClick={() => {}}
        >
          {interval}
        </button>
      ))}
    </div>
  );
};
