export default class UnpackingModel {
  constructor (unpacking) {
    this._id = 0
    this._serialNo = ''
    this._flowId = 0
    this._contentBuffer = null
    this._length = 0
    this._encryption = 0
    this._subcontracting = 0
    this._reserved = 0
    this._packetsTotal = 0
    this._packetsIndex = 0

    if (unpacking instanceof UnpackingModel) {
      this._id = unpacking._id
      this._serialNo = unpacking._serialNo
      this._flowId = unpacking._flowId
      this._contentBuffer = unpacking._contentBuffer
      this._length = unpacking._length
      this._encryption = unpacking._encryption
      this._subcontracting = unpacking._subcontracting
      this._reserved = unpacking._reserved
      this._packetsTotal = unpacking._packetsTotal
      this._packetsIndex = unpacking._packetsIndex
    }
  }

  getId () {
    return this._id
  }

  setId (id) {
    this._id = id
  }

  getSerialNo () {
    return this._serialNo
  }

  setSerialNo (serialNo) {
    this._serialNo = serialNo
  }

  getFlowId () {
    return this._flowId
  }

  setFlowId (flowId) {
    this._flowId = flowId
  }

  getContentBuffer () {
    return this._contentBuffer
  }

  setContentBuffer (contentBuffer) {
    this._contentBuffer = contentBuffer
  }

  getLength () {
    return this._length
  }

  setLength (length) {
    this._length = length
  }

  getEncryption () {
    return this._encryption
  }

  setEncryption (encryption) {
    this._encryption = encryption
  }

  getSubcontracting () {
    return this._subcontracting
  }

  setSubcontracting (subcontracting) {
    this._subcontracting = subcontracting
  }

  getReserved () {
    return this._reserved
  }

  setReserved (reserved) {
    this._reserved = reserved
  }

  getPacketsTotal () {
    return this._packetsTotal
  }

  setPacketsTotal (packetsTotal) {
    this._packetsTotal = packetsTotal
  }

  getPacketsIndex () {
    return this._packetsIndex
  }

  setPacketsIndex (packetsIndex) {
    this._packetsIndex = packetsIndex
  }
}
