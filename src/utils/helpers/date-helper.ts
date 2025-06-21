export const formatDate = (date: string | Date): string => {
  if (!date) return ''
  const d = new Date(date)

  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short', // 'Jun' instead of 'June'
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

  // Create date in UTC to avoid timezone offset issues
  const parsedDate = new Date(Date.UTC(year, month - 1, day, hours, minutes))

  return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString()
}

// Helper function to create a date in UTC consistently
export const createUTCDate = (year: number, month: number, day: number, hours: number = 0, minutes: number = 0): string => {
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes))
  return date.toISOString()
}

// Helper function to get current date in UTC
export const getCurrentUTCDate = (): string => {
  return new Date().toISOString()
}

// Helper function to get start of today in UTC
export const getStartOfTodayUTC = (): string => {
  const now = new Date()
  const todayStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  return todayStart.toISOString()
}

// Helper function to get start of today in local timezone (for date picker)
export const getStartOfTodayLocal = (): string => {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return todayStart.toISOString()
}

// Helper function to get today's date for date picker min restriction
export const getTodayForDatePicker = (): string => {
  const today = new Date()
  // Create date at start of today and return as ISO string
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return todayStart.toISOString()
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
