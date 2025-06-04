export const globalHelpers = {
  isObjectWithKey(obj: any, key: string): boolean {
    return obj && typeof obj === 'object' && key in obj
  },
  isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined
  },
  capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1)
  },
  isFunction(value: any): boolean {
    return typeof value === 'function'
  },
  isString(value: any): boolean {
    return typeof value === 'string'
  },
  isNumber(value: any): boolean {
    return typeof value === 'number'
  },
  isBoolean(value: any): boolean {
    return typeof value === 'boolean'
  },
  isArray(value: any): boolean {
    return Array.isArray(value)
  },
  isObject(value: any): boolean {
    return value !== null && typeof value === 'object'
  },
  isDate(value: any): boolean {
    return value instanceof Date
  },
  isUndefined(value: any): boolean {
    return value === undefined
  },
  isNull(value: any): boolean {
    return value === null
  },
  isStringEmpty(value: string): boolean {
    return value === ''
  },
  isStringNullOrEmpty(value: string): boolean {
    return value === '' || value === null
  },
  formatMoney(amount: string | number| null | undefined, currency:string = 'tr-TR'): string {
    if (!amount) {
      amount = 0;
    }
    return Number(amount).toLocaleString(currency, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
