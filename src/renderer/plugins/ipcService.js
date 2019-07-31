import {ipcRenderer} from 'electron'
import {CLIENT_NORMAL_MSG, CRAWLER_NORMAL_MSG} from '../../constants/msg'

const ipcService = Object.create(null)
const callbackCache = []

ipcService.install = Vue => {
  Vue.prototype.$ipcRenderer = {
    emit: (msgType, msgData) => {
      ipcRenderer.send(CLIENT_NORMAL_MSG, {
        type: msgType,
        data: msgData
      })
    },
    on: (type, mark, callback) => {
      callbackCache.push({
        type,
        mark,
        callback
      })
    },
    detach: (type, mark) => {
      const idx = callbackCache.findIndex(v => v.type === type && v.mark === mark)
      idx > -1 ? callbackCache.splice(idx, 1) : console.error(`error type ${type}`)
    }
  }
  ipcRenderer.on(CRAWLER_NORMAL_MSG, (sender, msg) => {
    callbackCache.forEach(cache => {
      if (cache.type === msg.type) {
        cache.callback && cache.callback(msg.data)
      }
    })
  })
}

export default ipcService
