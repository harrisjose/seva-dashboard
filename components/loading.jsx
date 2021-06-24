import styles from './loading.module.css'

export default function Loading({ className }) {
  return (
    <div className={`${styles.wrapper} ${className ? className : ''}`}>
      <div className={styles.loading}></div>
    </div>
  )
}
