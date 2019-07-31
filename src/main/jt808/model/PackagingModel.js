import {stringToBcd, integerToObject} from '../tools/util'

export default class PackagingModel {
  constructor ({id = 0, serialNo = '', flowId = 0, contentBuffer = null, encryption = 0, subcontracting = 0, reserved = 0, packetsTotal = 0, packetsIndex = 0}) {
    this.id = id
    this.serialNo = serialNo
    this.flowId = flowId
    this.contentBuffer = contentBuffer
    this.length = contentBuffer !== null ? contentBuffer.length : 0
    this.encryption = encryption
    this.subcontracting = subcontracting
    this.reserved = reserved
    this.packetsTotal = packetsTotal
    this.packetsIndex = packetsIndex
  }

  toBuffer () {
    if (this.contentBuffer === null) {
      throw new Error('contentBuffer is not null')
    }
    let headerBuffer = this.getHeaderBuffer()
    let msgBuffer = Buffer.concat([headerBuffer, this.contentBuffer], headerBuffer.length + this.contentBuffer.length)
    let verifyCodeBuffer = this.getVerifyCodeBuffer(msgBuffer)
    let escapeBeforeBuffer = Buffer.concat([msgBuffer, verifyCodeBuffer], msgBuffer.length + verifyCodeBuffer.length)

    return this.getEscapeAndAddIdentifier(escapeBeforeBuffer)
  }

  getHeaderBuffer () {
    let buffer = Buffer.alloc(this.subcontracting === 0x01 ? 14 : 12)
    let pos = integerToObject(0)

    let attributes = this.length | (this.encryption << 10 & 0x1C00) | (this.subcontracting << 13) | (this.reserved << 14 & 0xC000)
    let serialNoBuf = stringToBcd(this.serialNo.padStart(12, '0'))

    buffer.writeUInt16BE(this.id, pos.toInteger())
    buffer.writeUInt16BE(attributes, pos.add(2).toInteger())

    serialNoBuf.copy(buffer, pos.add(2).toInteger(), 0, 6)

    buffer.writeUInt16BE(this.flowId, pos.add(6).toInteger())

    if (this.subcontracting === 0x01) {
      buffer.writeUInt16BE(this.packetsTotal, pos.add(2).toInteger())
      buffer.writeUInt16BE(this.packetsIndex, pos.add(2).toInteger())
    }

    return buffer
  }

  getVerifyCodeBuffer (buffer) {
    let verifyCode = buffer.reduce(function (code, value) {
      return code ^ value
    })
    return Buffer.alloc(1, verifyCode)
  }

  getEscapeAndAddIdentifier (escapeBeforeBuffer) {
    let escapeArr = []

    escapeBeforeBuffer.map((value) => {
      if (value === 0x7E) {
        escapeArr[escapeArr.length] = 0x7D
        escapeArr[escapeArr.length] = 0x02
        return
      }
      if (value === 0x7D) {
        escapeArr[escapeArr.length] = 0x7D
        escapeArr[escapeArr.length] = 0x01
        return
      }
      escapeArr[escapeArr.length] = value
    })

    escapeArr.unshift(0x7E)
    escapeArr.push(0x7E)

    return Buffer.from(escapeArr)
  }
}
