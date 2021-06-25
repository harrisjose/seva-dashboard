import DayPickerInput from 'react-day-picker/DayPickerInput'
import { DateUtils } from 'react-day-picker'
import { format, parse } from 'date-fns'
import CalendarIcon from '../assets/calendar.svg'
import { FORMAT } from '../lib/constants'

export const parseDate = (str, dateFormat, locale) => {
  const parsed = parse(str, dateFormat, new Date(), { locale })
  if (DateUtils.isDate(parsed)) {
    return parsed
  }
  return undefined
}

export const formatDate = (date, dateFormat, locale) => {
  return format(date, dateFormat, { locale })
}

export default function DatePicker({ value, onChange }) {
  return (
    <>
      <CalendarIcon
        style={{
          width: '20px',
          height: '20px',
          verticalAlign: 'middle',
          marginRight: '10px',
        }}
      />
      <DayPickerInput
        value={value}
        onDayChange={onChange}
        formatDate={formatDate}
        format={FORMAT}
        parseDate={parseDate}
      />
    </>
  )
}
