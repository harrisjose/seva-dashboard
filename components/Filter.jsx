import FilterIcon from '../assets/filter.svg'

export const FILTERS = {
  all: 0,
  greater: 1,
  lesser: 2,
}

function FilterInput({ ...props }) {
  return (
    <select {...props}>
      <option value={FILTERS.all}> All Donations</option>
      <option value={FILTERS.greater}> &gt;= 10K </option>
      <option value={FILTERS.lesser}> &lt; 10K </option>
    </select>
  )
}

export default function Filter({ onChange, value }) {
  return (
    <>
      <FilterIcon
        style={{
          width: '20px',
          height: '20px',
          verticalAlign: 'middle',
          marginRight: '10px',
        }}
      />
      <FilterInput
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </>
  )
}
