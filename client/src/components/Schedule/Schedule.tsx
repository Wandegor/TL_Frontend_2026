import styles from "./Schedule.module.scss";
import type { PriceChange } from "../../types/priceChange.ts";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

type ScheduleProps = {
  priceHistory: PriceChange[];
};

export const Schedule = ({ priceHistory }: ScheduleProps) => {
  const data = priceHistory.map((priceChange) => ({
    time: new Date(priceChange.dateTime).toLocaleTimeString(),
    price: priceChange.price,
  }));
  return (
    <div className={styles.wrapper}>
      <LineChart width={400} height={400} data={data}>
        <XAxis dataKey="time" />
        <YAxis dataKey="price" />
        <Tooltip />
        <Line type="monotone" dataKey="price" />\
      </LineChart>
    </div>
  );
};
