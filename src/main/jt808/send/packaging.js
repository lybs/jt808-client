import moment from 'moment'

import * as constants from '../../../jt808/constants'
import {stringToBcd, integerToObject} from '../tools/util'
import PackagingModel from '../model/PackagingModel'

export default function (serialNo, isUTC, id, subId, flowId, params, callback) {
  switch (id) {
    case constants.TERMINAL_BUSINESS_ID_HEART_BEAT:
      generatePingBuffer(serialNo, id, flowId, callback)
      break
    case constants.TERMINAL_BUSINESS_ID_LOGIN_AUTH:
      generateLoginBuffer(serialNo, id, flowId, params, callback)
      break
    case constants.TERMINAL_BUSINESS_ID_LOCATION_INFO_REPORT:
      generateGpsBuffer(serialNo, isUTC, id, flowId, params, callback)
      break
    default:
  }
}

function generatePingBuffer (serialNo, id, flowId, callback) {
  callback(null, new PackagingModel({id: id, serialNo: serialNo, flowId: flowId, contentBuffer: Buffer.alloc(0)}).toBuffer())
}

function generateLoginBuffer (serialNo, id, flowId, {authCode}, callback) {
  let contentBuffer = Buffer.from(authCode, 'utf8')

  callback(null, new PackagingModel({id: id, serialNo: serialNo, flowId: flowId, contentBuffer: contentBuffer}).toBuffer())
}

function generateGpsBuffer (serialNo, isUTC, id, flowId, {warningFlagField, statusField, latitude, longitude, elevation, speed, direction}, callback) {
  let contentBuffer = Buffer.alloc(28)
  let pos = integerToObject(0)
  let timeBuffer = stringToBcd(isUTC ? moment().utc().format('YYMMDDHHmmss') : moment().format('YYMMDDHHmmss'))

  contentBuffer.writeUInt32BE(parseInt(warningFlagField, 2), pos.toInteger())
  contentBuffer.writeUInt32BE(parseInt(statusField, 2), pos.add(4).toInteger())
  contentBuffer.writeUInt32BE(parseInt(latitude * 1000000), pos.add(4).toInteger())
  contentBuffer.writeUInt32BE(parseInt(longitude * 1000000), pos.add(4).toInteger())
  contentBuffer.writeUInt16BE(parseInt(elevation), pos.add(4).toInteger())
  contentBuffer.writeUInt16BE(parseInt(speed * 10), pos.add(2).toInteger())
  contentBuffer.writeUInt16BE(parseInt(direction), pos.add(2).toInteger())

  timeBuffer.copy(contentBuffer, pos.add(2).toInteger(), 0, 6)

  callback(null, new PackagingModel({id: id, serialNo: serialNo, flowId: flowId, contentBuffer: contentBuffer}).toBuffer())
}
