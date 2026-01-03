class LocalStorage {
  public static set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  public static get<T>(key: string): T | null {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : null
  }

  public static remove(key: string) {
    localStorage.removeItem(key)
  }

  public static clear() {
    localStorage.clear()
  }
}

export default LocalStorage
