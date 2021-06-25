/* eslint-disable react/display-name */
import { useRouter } from 'next/router'
import { useState } from 'react'
import { format, parse } from 'date-fns'
import { isEmpty } from 'lodash'
import { readFile } from '../../lib/storage'
import { columns, FORMAT } from '../../lib/constants'

import Link from 'next/link'
import Head from 'next/head'
import DataGrid from 'react-data-grid'
import DatePicker from '../../components/DatePicker'
import DonorDialog from '../../components/DonorDialog'
import Filter from '../../components/Filter'
import { FILTERS } from '../../components/Filter'

import EmptyIcon from '../../assets/alert.svg'
import BackIcon from '../../assets/back.svg'
import styles from '../../styles/dashboard.module.css'

function getColumns(columns, filter) {
  return Object.entries(columns || {}).map(([name, col]) => {
    let column = {
      key: col.id,
      name: col.label,
    }
    if (['total', 'paid', 'refund', 'fees'].includes(name)) {
      column.formatter = ({ row }) => {
        let value = row[name]
        if (row.exchangeRate > 0) {
          value = value / row.exchangeRate
        }
        return new Intl.NumberFormat('en-IN').format(value)
      }
    }
    if (name === 'donorInfo') {
      column.formatter = ({ row }) => {
        return <a className={styles.link}>View Details</a>
      }
      column.editor = ({ row, onClose }) => {
        return <DonorDialog data={row.donorInfo} close={onClose} />
      }
      column.editorOptions = {
        createPortal: true,
      }
    }
    return column
  })
}

function getFilteredRows(rows, filter) {
  const filterFn = (r) => {
    let value = r.paid

    if (r.exchangeRate > 0) {
      value = value / r.exchangeRate
    }

    if (filter === FILTERS.all) return true
    else if (filter === FILTERS.greater) return value >= 10000
    else if (filter === FILTERS.lesser) return value < 10000
  }

  return (rows || []).filter(filterFn)
}

export async function getServerSideProps({ params }) {
  const { date } = params
  try {
    const dateObj = parse(date.join('/'), FORMAT, new Date())
    const data = await readFile(dateObj)

    return {
      props: { ...data, columns },
    }
  } catch (error) {
    return {
      props: { rows: null, columns },
    }
  }
}

export default function Dashboard({ rows, columns, total }) {
  const router = useRouter()
  const { date } = router.query
  const dateObj = parse(date.join('/'), FORMAT, new Date())

  const updateDate = (value) => {
    router.push({
      pathname: '/dashboard/[...date]',
      query: { date: format(value, FORMAT).split('/') },
    })
  }

  const [selectedFilter, updateFilter] = useState(FILTERS.all)

  const gridColumns = getColumns(columns)
  const gridRows = getFilteredRows(rows, selectedFilter)

  return (
    <div className={styles.container}>
      <Head>
        <title>Seva Scholarship</title>
        <meta name="description" content="Seva Scholarship" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.header}>
        <Link passHref href="/">
          <BackIcon className={styles.back} />
        </Link>
        <div className={styles.filter}>
          <DatePicker onChange={updateDate} value={dateObj}></DatePicker>
        </div>
        <div className={styles.filter}>
          <Filter onChange={updateFilter} value={selectedFilter}></Filter>
        </div>
      </div>

      <div>
        <DataGrid
          className="rdg-light"
          columns={gridColumns}
          rows={gridRows}
          minHeight={150}
          emptyRowsRenderer={() => (
            <div className={styles.empty}>
              <EmptyIcon
                style={{
                  marginRight: '10px',
                }}
              />
              No Data Found
            </div>
          )}
        />
      </div>
    </div>
  )
}
