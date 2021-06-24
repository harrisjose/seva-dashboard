import { useRef, useState } from 'react'
import styles from '../styles/home.module.css'

export default function Upload({ children }) {
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  const onUpload = async (e) => {
    const { target } = e
    let file = target.files ? target.files[0] : null

    if (file) {
      let formData = new FormData()
      formData.append('file', file, file.name)

      setLoading(true)
      try {
        await fetch('/api/upload', { method: 'POST', body: formData })
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
  }

  return (
    <div className={styles.card} onClick={() => inputRef.current.click()}>
      {children(loading)}
      <input
        ref={inputRef}
        type="file"
        id="input"
        onChange={onUpload}
        style={{ display: 'none' }}
      ></input>
    </div>
  )
}
