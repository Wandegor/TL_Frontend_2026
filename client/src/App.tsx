import { Converter } from "./Converter";
import styles from "./App.module.scss";

export default function App() {
  return (
    <main className={styles.page}>
      <Converter />
    </main>
  );
}
