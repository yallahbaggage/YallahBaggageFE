export class StorageHelper {
  static async init() {}

  static clear() {
    localStorage.clear()
  }

  static delete(key: string) {
    localStorage.removeItem(key)
  }

  static write(key: string, value: string) {
    localStorage.setItem(key, value)
  }

  static read(key: string) {
    return localStorage.getItem(key)
  }
}
