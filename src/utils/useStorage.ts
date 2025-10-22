export default function useStorage(key: string, type: string = 'local') {
  const storage = type === 'session' ? sessionStorage : localStorage
  return {
    set(value: string) {
      const data = {
        value,
        time: Date.now(),
      }
      storage.setItem(key, JSON.stringify(data))
    },
    get() {
      const item = storage.getItem(key)
      if (!item) return null
      try {
        return JSON.parse(item).value
      } catch {
        return null
      }
    },
    remove() {
      storage.removeItem(key)
    },
    clear() {
      storage.clear()
    },
  }
}
