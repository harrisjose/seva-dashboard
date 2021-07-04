import Head from 'next/head'
import Link from 'next/link'
import { format } from 'date-fns'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { ToastProvider } from 'react-toast-notifications'

import Upload from '../components/UploadFile'
import Loading from '../components/loading'
import styles from '../styles/index.module.css'

export default function Home() {
  const router = useRouter()
  const today = format(new Date(), 'dd/MM/yyyy', new Date())

  useEffect(() => {
    router.prefetch(`/dashboard/${today}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ToastProvider placement="bottom-right">
      <div className={styles.container}>
        <Head>
          <title>Seva Scholarship</title>
          <meta name="description" content="Seva Scholarship" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <div className={styles.grid}>
            <Link passHref href={`/dashboard/${today}`}>
              <a className={styles.card}>
                <h2>Dashboard &rarr;</h2>
                <p>View donor details by date</p>
              </a>
            </Link>

            <Upload className={styles.card}>
              {(loading) => (
                <>
                  <h2>
                    Upload {loading ? <Loading /> : String.fromCharCode(8593)}
                  </h2>
                  <p>Upload CSV from Milaap</p>
                </>
              )}
            </Upload>
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}
