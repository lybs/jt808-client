const localStorageCache = Object.create(null)

localStorageCache.install = Vue => {
  Vue.prototype.$localStorageCache = {
    get (key) {
      return JSON.parse(localStorage.getItem(key))
    },
    set (key, json) {
      localStorage.setItem(key, JSON.stringify(json))
    }
  }
}

export default localStorageCache
