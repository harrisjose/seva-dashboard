import { useRef, useState } from 'react'

export default function Upload({ children, ...rest }) {
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  const onUpload = async (e) => {
    const { target } = e
    let files = target.files ? target.files : null

    if (files) {
      try {
        let formData = new FormData()
        Array.from(files).forEach((file) =>
          formData.append('file', file, file.name)
        )

        setLoading(true)

        await fetch('/api/upload', { method: 'POST', body: formData })
      } catch (e) {
        console.error(e)
      }
      inputRef.current.value = ''
      setLoading(false)
    }
  }

  return (
    <div {...rest} onClick={() => inputRef.current.click()}>
      {children(loading)}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".csv"
        onChange={onUpload}
        style={{ display: 'none' }}
      ></input>
    </div>
  )
}
