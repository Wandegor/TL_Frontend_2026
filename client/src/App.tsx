import { Converter } from "./components/Converter/Converter.tsx";
import styles from "./App.module.scss";

export const App = () => {
  return (
    <main className={styles.page}>
      <Converter />
    </main>
  );
};
