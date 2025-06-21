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


export const formatDateWithoutTime = (date: string | Date): string => {
  if (!date) return ''
  const d = new Date(date)

  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short', 
    year: 'numeric'
  })
}

export const parseDateTimeString = (input: string): string | null => {
  const [datePart, timePart] = input.split(' ')
  const [day, month, year] = datePart.split('/').map(Number)
  const [hours, minutes] = timePart.split(':').map(Number)

  const parsedDate = new Date(year, month - 1, day, hours, minutes)

  return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString()
}

export function formatIsoToReadable(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${formattedDate} ${formattedTime}`;
}
