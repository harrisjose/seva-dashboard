import { useRouter } from 'next/router'
import { read } from '../../lib/storage'
import { format, parse } from 'date-fns'
import { isEmpty } from 'lodash'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { DateUtils } from 'react-day-picker'
import Head from 'next/head'
import DataGrid from 'react-data-grid'
import styles from '../../styles/dashboard.module.css'

const FORMAT = 'dd/MM/yyyy'

export async function getServerSideProps({ params }) {
  const { date } = params
  const dateObj = parse(date.join('/'), FORMAT, new Date())

  const { data, error } = await read(dateObj)

  if (error) {
    return {
      props: { rows: null },
    }
  } else {
    return {
      props: data,
    }
  }
}

function parseDate(str, dateFormat, locale) {
  const parsed = parse(str, dateFormat, new Date(), { locale })
  if (DateUtils.isDate(parsed)) {
    return parsed
  }
  return undefined
}

function formatDate(date, dateFormat, locale) {
  return format(date, dateFormat, { locale })
}

export default function Dashboard({ rows, columns, total }) {
  const router = useRouter()
  const { date } = router.query
  const dateObj = parse(date.join('/'), FORMAT, new Date())

  const navigateToDate = (value) => {
    router.push({
      pathname: '/dashboard/[...date]',
      query: { date: format(value, FORMAT) },
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Seva Scholarship</title>
        <meta name="description" content="Seva Scholarship" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <DayPickerInput
            onDayChange={navigateToDate}
            formatDate={formatDate}
            format={FORMAT}
            parseDate={parseDate}
            placeholder={`${format(dateObj, FORMAT)}`}
          />
        </div>
        <div>
          {!isEmpty(rows) ? (
            <DataGrid
              className="rdg-light"
              columns={Object.values(columns).map((c) => ({
                key: c.id,
                name: c.label,
              }))}
              rows={rows.map((r) => ({
                ...r,
                donorInfo: JSON.stringify(r.donorInfo),
              }))}
              minHeight={150}
            />
          ) : (
            <div className={styles.empty}>No Data Found</div>
          )}
        </div>
      </main>
    </div>
  )
}
