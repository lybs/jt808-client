import * as constants from '../../../jt808/constants'
import {integerToObject} from '../tools/util'
import unpacking from './unpacking'

import CommonReplyModel from '../model/MessageType/CommonReplyModel'
import commonReplyHandle from '../handle/commonReplyHandle'

export default function (socket, buffer, callback) {
  unpacking(buffer, (err, unpackingList) => {
    if (err) {
      return
    }

    unpackingList.map((item) => {
      switch (item.getId()) {
        case constants.PLATFORM_BUSINESS_ID_COMMON_REPLY:
          platformCommonReply(socket, item)
          break
        default:
          console.log('不存在的业务ID：' + item.getId())
      }

      callback(item.getFlowId(), item.getId())
    })
  })
}

function platformCommonReply (socket, msg) {
  try {
    let buffer = msg.getContentBuffer()
    let pos = integerToObject(0)
    let commonReply = new CommonReplyModel(msg)

    let replyFlowId = buffer.readUInt16BE(pos.toInteger())
    let replyId = buffer.readUInt16BE(pos.add(2).toInteger())
    let replyResult = buffer.readUInt8(pos.add(2).toInteger())

    commonReply.setReplyFlowId(replyFlowId)
    commonReply.setReplyId(replyId)
    commonReply.setReplyResult(replyResult)

    if (constants.PLATFORM_REPLY_UNIVERSAL_ALL_LIST.indexOf(replyResult) === -1) {
      throw new Error('不存在该应答结果：' + replyResult)
    }

    commonReplyHandle(socket, commonReply)
  } catch (e) {
    console.log('平台通用应答解析失败 ' + e)
  }
}
