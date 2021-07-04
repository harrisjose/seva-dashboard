import { useRef, useState } from 'react'
import { useToasts } from 'react-toast-notifications'

export default function Upload({ children, ...rest }) {
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const { addToast } = useToasts()

  const onUpload = async (e) => {
    const { target } = e
    let files = target.files ? Array.from(target.files) : null

    if (files) {
      setLoading(true)

      try {
        const isZip = files.some(({ type }) => type.includes('application/zip'))
        const url = isZip ? '/api/uploadZip' : '/api/upload'

        let formData = new FormData()
        files.forEach((file) => formData.append('file', file, file.name))

        await fetch(url, { method: 'POST', body: formData })
        addToast('Uploaded data!', { appearance: 'success' })
      } catch (e) {
        console.error(e)
        addToast(error?.message || 'Error Occurred', { appearance: 'error' })
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
        accept=".csv,.zip"
        onChange={onUpload}
        style={{ display: 'none' }}
      ></input>
    </div>
  )
}
