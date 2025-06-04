export const Logging = {
  logError(message: string) {
    const timestamp = new Date().toISOString()
    console.error(`${timestamp} - ERROR: ${message}`)
  },

  logWarning(message: string) {
    if (import.meta.env.MODE === 'development') {
      const timestamp = new Date().toISOString()
      console.warn(`${timestamp} - WARNING: ${message}`)
    }
  },

  logInfo(message: string) {
    if (import.meta.env.MODE === 'development') {
      const timestamp = new Date().toISOString()
      console.info(`${timestamp} - INFO: ${message}`)
    }
  },

  logDebug(message: string) {
    if (import.meta.env.MODE === 'development') {
      const timestamp = new Date().toISOString()
      console.debug(`${timestamp} - DEBUG: ${message}`)
    }
  },
}
