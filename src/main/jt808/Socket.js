import net from 'net'
import {EventEmitter} from 'events'

import send from './send/send'
import parse from './receive/parse'

import connectReplyHandle from './handle/connectReplyHandle'
import consoleReplyHandle from './handle/consoleReplyHandle'

export default class Socket extends EventEmitter {
  constructor () {
    super()
    this.init()
  }

  init () {
    this.client = null
    this.serialNo = null
    this.connectStatus = false
    this.flowId = 0xFFFF
    this.map = new Map()
    this.isUTC = false
  }

  connect (host, port, isUTC) {
    this.disconnect()
    this.isUTC = !!isUTC
    this.client = net.connect({port: port, host: host})
    this.addListenerClientEvents()
  }

  disconnect () {
    if (this.client) {
      this.removeListenerClientEvents()
      this.client.end()
      this.client.destroy()
    }

    this.init()
  }

  addListenerClientEvents () {
    this.client.on('connect', () => {
      this.connectStatus = true
      connectReplyHandle(this, this.connectStatus)
    })

    this.client.on('error', (e) => {
      consoleReplyHandle(this, {
        type: 'String',
        data: 'socket error'
      })
    })

    this.client.on('close', () => {
      this.connectStatus = false
      connectReplyHandle(this, this.connectStatus)
    })

    this.client.on('end', () => {
      consoleReplyHandle(this, {
        type: 'String',
        data: 'socket end'
      })
    })

    this.client.on('data', (buffer) => {
      parse(this, buffer, (flowId, id) => {
        consoleReplyHandle(this, {
          type: 'Buffer',
          data: {
            type: 'Recv',
            buffer: buffer,
            flowId: flowId,
            id: id
          }
        })
      })
    })
  }

  removeListenerClientEvents () {
    if (this.client) {
      this.client.removeAllListeners()
    }
  }

  send (params, id, subId) {
    send(this, params, id, subId)
  }

  write (buffer, flowId, id, subId) {
    if (this.client) {
      this.client.write(buffer)

      consoleReplyHandle(this, {
        type: 'Buffer',
        data: {
          type: 'Send',
          buffer: buffer,
          flowId: flowId,
          id: id,
          subId: subId
        }
      })
    }
  }

  setSerialNo (serialNo) {
    this.serialNo = serialNo
  }

  getSerialNo () {
    return this.serialNo
  }

  getFlowId () {
    if (this.flowId >= 0xffff) {
      this.flowId = 0
    }

    return this.flowId++
  }

  hasFlowIdStatus (flowId) {
    return this.map.has(flowId)
  }

  deleteFlowIdStatus (flowId) {
    if (this.hasFlowIdStatus(flowId)) return this.map.delete(flowId)
    return true
  }

  getFlowIdStatus (flowId) {
    return this.map.get(flowId)
  }

  setFlowIdStatus (flowId, value) {
    this.map.set(flowId, value)
  }
}
