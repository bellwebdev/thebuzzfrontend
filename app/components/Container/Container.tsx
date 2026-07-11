import styles from "./Container.module.css";

interface ContainerChildren {
  children: React.ReactNode;
}

export function Container({ children }: ContainerChildren) {
  return (
    <>
      <div className={styles.container}>{children}</div>
    </>
  );
}
