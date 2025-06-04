import { Logging } from "./logging-helper";

class DateFunctions {
  //NOTE: Format Date: Returns date in 'dd/MM/yyyy' format
  static formatDate(date: Date): string {
    if (!date) return ''
    return new Intl.DateTimeFormat('en-GB').format(date)
  }

  //NOTE: Format DateTime: Returns 'dd/MM/yyyy HH:mm' format
  static formatDateTime(date: string | Date | null, localTime: boolean = false): string | null {
    if (!date) return '-';

    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) {
      Logging.logError("Invalid date value:"+ date);
      return '-';
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: localTime ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    }).format(parsedDate);
  }


  //NOTE: Format DateTime String
  static formatDateTimeStr(dateStr: string | null, localTime: boolean = false): string | null {
    if (!dateStr) return null
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return null
    return this.formatDateTime(date, localTime)
  }

  //NOTE: Format Date String to 'dd/MM/yyyy'
  static formatDateStr(dateStr: string): string {
    if (!dateStr || dateStr === '') return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    return this.formatDate(date)
  }

  //NOTE: Convert to Date Only (year, month, day)
  static toDateOnly(dateTime: Date): Date {
    return new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate())
  }

  static isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  //NOTE: Check if a date falls on a weekend (Saturday or Sunday)
  static isWeekend(date: Date): boolean {
    const weekday: number = date.getDay() //NOTE: getDay() returns 0 for Sunday and 6 for Saturday
    return weekday === 0 || weekday === 6 //INFO 0 = Sunday, 6 = Saturday
  }

  static getTimeZoneOffset(): string {
    const offset = new Date().getTimezoneOffset();
    if (offset === 0) return "Z";

    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset > 0 ? "-" : "+";

    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  static convertToIsoDate(
    input: string | Date,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  ): string {
    let date;

    if (typeof input === 'string') {
      if (input.includes('T')) {
        //NOTE: Handle valid ISO string directly
        date = new Date(input);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid ISO string format');
        }
      } else {
        //NOTE: Handle custom date formats (DD.MM.YYYY or DD/MM/YYYY)
        const dateRegex = /^(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{4})$/;
        const match = input.match(dateRegex);
        if (match) {
          const [, dayStr, monthStr, yearStr] = match;
          const day = parseInt(dayStr, 10);
          const month = parseInt(monthStr, 10) - 1; //NOTE: Month is 0-based
          const year = parseInt(yearStr, 10);

          //NOTE: Create the date using local time
          date = new Date(year, month, day, hours, minutes, seconds, milliseconds);
        } else {
          throw new Error(
            'Invalid date string format. Expected format: DD.MM.YYYY, DD/MM/YYYY or a valid Date string'
          );
        }
      }
    } else if (input instanceof Date) {
      //NOTE: Clone the date object to avoid modifying the original
      date = new Date(
        input.getFullYear(),
        input.getMonth(),
        input.getDate(),
        hours,
        minutes,
        seconds,
        milliseconds
      );
    } else {
      throw new Error('Invalid input type: must be a string or Date object');
    }

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date value after processing');
    }

    //NOTE: Format the date into an ISO-like string without converting to UTC
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    const offset = this.getTimeZoneOffset();

    return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
  }

  //NOTE: Reset time part of a date to start of day (00:00:00.000)
  static resetTimeToStartOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  //NOTE: Reset time part of a date to end of day (23:59:59.999)
  static resetTimeToEndOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  }

  //NOTE: Add days to a date and reset time to start of day
  static addDaysAndResetTime(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return this.resetTimeToStartOfDay(newDate);
  }

  //NOTE: Compare two dates ignoring time part
  static compareDatesIgnoreTime(date1: Date, date2: Date): number {
    const d1 = this.resetTimeToStartOfDay(date1);
    const d2 = this.resetTimeToStartOfDay(date2);
    return d1.getTime() - d2.getTime();
  }

  //NOTE: Get the earlier date between two dates
  static getEarlierDate(date1: Date, date2: Date): Date {
    return this.compareDatesIgnoreTime(date1, date2) <= 0 ? date1 : date2;
  }

  //NOTE: Get the later date between two dates
  static getLaterDate(date1: Date, date2: Date): Date {
    return this.compareDatesIgnoreTime(date1, date2) >= 0 ? date1 : date2;
  }
}

export { DateFunctions }
