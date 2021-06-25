export const FORMAT = 'dd/MM/yyyy'

export const columns = {
  id: {
    id: 'id',
    label: 'ID',
  },
  date: {
    id: 'date',
    label: 'Date',
  },
  name: {
    id: 'name',
    label: 'Donor Name',
  },
  currency: {
    id: 'currency',
    label: 'Currency',
  },
  paid: {
    id: 'paid',
    label: 'Amount Paid (INR)',
  },
  refund: {
    id: 'refund',
    label: 'Refund (INR)',
  },
  fees: {
    id: 'fees',
    label: 'Fees (INR)',
  },
  total: {
    id: 'total',
    label: 'Total (INR)',
  },
  donorInfo: {
    id: 'donorInfo',
    label: 'Donor Information',
  },
}

export const DonorFields = [
  'Pan of donor',
  'Name as in pan',
  'Passport no',
  'Nationality',
  'Address',
  'City',
  'State',
  'Country',
  'Pincode',
]
