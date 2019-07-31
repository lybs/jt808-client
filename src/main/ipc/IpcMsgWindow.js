import {CLIENT_NORMAL_MSG, CRAWLER_NORMAL_MSG} from '../../constants/msg'
import requestHandleWindow from './requestHandleWindow'

export default class IpcMsgWindow {
  constructor (listener, sender, socket) {
    this.listener = listener
    this.sender = sender
    this.socket = socket
    this.handlerList = requestHandleWindow(this)

    this.addSocketListener()
    this.addIpcListener()
  }

  addSocketListener = () => {
    this.socket.on('mainWindowResponse', this.sendToClient)
  }

  socketConnect = (host, port, isUTC) => {
    this.socket.connect(host, port, isUTC)
  }

  socketDisconnect = () => {
    this.socket.disconnect()
  }

  socketWrite = (params, id, subId) => {
    this.socket.send(params, id, subId)
  }

  socketPenetrateWrite = ({content}) => {
    this.socket.write(Buffer.from(content, 'hex'))
  }

  addIpcListener = () => {
    this.listener.on(CLIENT_NORMAL_MSG, (event, data) => {
      try {
        this.handlerList[data.type](event, data.data)
      } catch (error) {
        console.error('handler event error:' + error.message)
      }
    })
  }

  sendToClient = ({type, data}) => {
    this.sender.send(CRAWLER_NORMAL_MSG, {type, data})
  }
}
