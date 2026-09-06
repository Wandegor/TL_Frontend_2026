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
      <LineChart
        responsive={true}
        data={data}
        style={{
          maxWidth: "100%",
          aspectRatio: 2.0,
        }}
        margin={{ left: -15 }}
      >
        <XAxis dataKey="time" padding={{ right: 15 }} />
        <YAxis dataKey="price" />
        <Tooltip />
        <Line type="linear" dataKey="price" />\
      </LineChart>
    </div>
  );
};
