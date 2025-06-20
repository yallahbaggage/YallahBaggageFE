export const formatDate = (date: string | Date): string => {
  if (!date) return ''
  const d = new Date(date)

  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short', // 'Jun' instead of 'June'
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // for 24-hour format; remove if you want AM/PM
  }).replace(',', '') // remove the comma after the date
}
