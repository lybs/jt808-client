import {bcdToString, integerToObject} from '../tools/util'
import UnpackingModel from '../model/UnpackingModel'

export default function (buffer, callback) {
  let allPackArray = stickyHandle(buffer)
  let allEscapePackArray = reverseEscape(allPackArray)
  let verifyCodeRightArray = verifyCode(allEscapePackArray)

  let unpackingList = []

  verifyCodeRightArray.map((bufferArr) => {
    let unpacking = toUnpacking(Buffer.from(bufferArr))
    if (unpacking) unpackingList.push(unpacking)
  })

  callback(null, unpackingList)
}

function toUnpacking (buffer) {
  try {
    let unpacking = new UnpackingModel()
    let pos = integerToObject(0)

    unpacking.setId(buffer.readUInt16BE(pos.add(1).toInteger()))

    let attributes = buffer.readUInt16BE(pos.add(2).toInteger())
    let length = attributes & 0x03FF
    let encryption = attributes & 0x1C00
    let subcontracting = attributes & 0x2000
    let reserved = attributes & 0xC000

    unpacking.setLength(length)
    unpacking.setEncryption(encryption)
    unpacking.setSubcontracting(subcontracting)
    unpacking.setReserved(reserved)

    let serialNo = bcdToString(buffer.slice(pos.add(2).toInteger(), pos.toInteger() + 6))
    unpacking.setSerialNo(serialNo)

    unpacking.setFlowId(buffer.readUInt16BE(pos.add(6).toInteger()))

    if (subcontracting === 0x01) {
      unpacking.setPacketsTotal(buffer.readUInt16BE(pos.add(2).toInteger()))
      unpacking.setPacketsIndex(buffer.readUInt16BE(pos.add(2).toInteger()))
    }

    unpacking.setContentBuffer(buffer.slice(pos.add(subcontracting === 0x01 ? 4 : 2).toInteger(), pos.toInteger() + length))

    return unpacking
  } catch (e) {
    return null
  }
}

function stickyHandle (buffer) {
  let everyPackArray = []
  let allPackArray = []

  buffer.map((item) => {
    if (item === 0x7E) {
      if (everyPackArray[0] && everyPackArray.length > 1 && everyPackArray[0] === 0x7E) {
        everyPackArray.push(item)

        if (everyPackArray.length > 15) { // 7E(TYPE) + 消息头(至少TYPE[12]) + 验证码(TYPE) + 7E(TYPE)
          allPackArray.push(everyPackArray)
        }

        everyPackArray = []
        return
      } else {
        everyPackArray = []
      }
    }

    everyPackArray.push(item)
  })

  return allPackArray
}

function reverseEscape (allPackArray) {
  let allEscapePackArray = []

  allPackArray.map((pack) => {
    let tmpArray = []

    pack.map((item) => {
      if (item === 0x01 && tmpArray[tmpArray.length - 1] === 0x7D) {
        return
      }

      if (item === 0x02 && tmpArray[tmpArray.length - 1] === 0x7D) {
        tmpArray.pop()
        tmpArray.push(0x7E)
        return
      }

      tmpArray.push(item)
    })

    allEscapePackArray.push(tmpArray)
  })

  return allEscapePackArray
}

function verifyCode (allEscapePackArray) {
  let verifyCodeRightArray = []

  allEscapePackArray.map((pack) => {
    let verifyCode = pack.slice(1, pack.length - 2).reduce(function (code, value) {
      return code ^ value
    })

    if (verifyCode === pack[pack.length - 2]) {
      verifyCodeRightArray.push(pack)
    }
  })

  return verifyCodeRightArray
}
