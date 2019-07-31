import * as constants from '../../../jt808/constants'
import packaging from './packaging'

import loginReplyHandle from '../handle/loginReplyHandle'

export default function (socket, params, id, subId) {
  let flowId = socket.getFlowId()
  socket.setFlowIdStatus(flowId, {isResponse: false, id: id, subId: subId})

  if (id === constants.TERMINAL_BUSINESS_ID_LOGIN_AUTH) {
    socket.setSerialNo(params.serialNo)
  }

  packaging(socket.getSerialNo(), socket.isUTC, id, subId, flowId, params, (err, buffer) => {
    if (err) {
      return
    }

    send(socket, buffer, flowId, id, subId, {
      numbers: constants.RESEND_NUMBERS,
      timeInterval: constants.RESEND_TIME_INTERVAL,
      loopCondition () {
        if (socket.hasFlowIdStatus(flowId)) return !socket.getFlowIdStatus(flowId).isResponse
        return false
      },
      success () {
        socket.deleteFlowIdStatus(flowId)
      },
      failure () {
        if (id === constants.TERMINAL_BUSINESS_ID_LOGIN_AUTH) {
          loginReplyHandle(socket, constants.PLATFORM_REPLY_TIMEOUT)
        }
        socket.deleteFlowIdStatus(flowId)
      }
    })
  })
}

function send (socket, buffer, flowId, id, subId, resendOption) {
  socket.write(buffer, flowId, id, subId)

  if (Object.prototype.toString.call(resendOption) === '[object Object]' &&
    typeof resendOption['numbers'] === 'number' && resendOption['numbers'] > 1 &&
    typeof resendOption['timeInterval'] === 'number' &&
    typeof resendOption['loopCondition'] === 'function' &&
    typeof resendOption['success'] === 'function') {
    loopSend(socket, buffer, flowId, id, subId, resendOption['numbers'] - 1, resendOption['timeInterval'], resendOption['loopCondition'], resendOption['success'], resendOption['failure'])
  }
}

function loopSend (socket, buffer, flowId, id, subId, numbers, timeInterval, loopConditionFun, successFun, failureFun) {
  try {
    setTimeout(() => {
      if (loopConditionFun() === true) {
        if (numbers < 1) {
          if (typeof failureFun === 'function') {
            failureFun()
          }
          return
        }

        socket.write(buffer, flowId, id, subId)
        loopSend(socket, buffer, flowId, id, subId, numbers - 1, timeInterval, loopConditionFun, successFun, failureFun)
      } else {
        successFun()
      }
    }, timeInterval)
  } catch (e) {
    failureFun()
  }
}
