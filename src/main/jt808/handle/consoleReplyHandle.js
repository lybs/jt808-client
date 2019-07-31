import moment from 'moment'

import responseHandleWindow from '../../ipc/responseHandleWindow'
import * as constants from '../../../jt808/constants'

export default function (socket, {type, data}) {
  responseHandleWindow(-3, null, function (err, res) {
    if (err) {
      return
    }

    let date = socket.isUTC ? moment().utc().format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss')

    if (type === 'String') {
      if (!data) {
        return
      }

      socket.emit('mainWindowResponse', {type: res, data: date + ' ' + data})
    }

    if (type === 'Buffer') {
      if (!data || !data['type'] || ['Send', 'Recv'].indexOf(data['type']) === -1 || !data['buffer'] || !Buffer.isBuffer(data['buffer'])) {
        return
      }

      let string = data['type'] === 'Send' ? '发送:' : '接收:'
      string += data['buffer'].toString('hex').toUpperCase()

      if (data['flowId']) {
        string += ' 流水号:' + data['flowId'].toString(16).padStart(4, '0').toUpperCase()
      }

      if (data['id']) {
        string += ' 业务ID:' + data['id'].toString(16).padStart(4, '0').toUpperCase() + ' ' + getNameById(data['id'])
      }

      if (string !== '') {
        socket.emit('mainWindowResponse', {type: res, data: date + ' ' + string})
      }
    }
  })
}

function getNameById (id) {
  let idMsg = ''

  switch (id) {
    case constants.TERMINAL_BUSINESS_ID_COMMON_REPLY:
      idMsg = '终端通用应答'
      break
    case constants.TERMINAL_BUSINESS_ID_HEART_BEAT:
      idMsg = '心跳'
      break
    case constants.TERMINAL_BUSINESS_ID_LOGIN_AUTH:
      idMsg = '登陆'
      break
    case constants.TERMINAL_BUSINESS_ID_LOCATION_INFO_REPORT:
      idMsg = '位置信息'
      break
    case constants.PLATFORM_BUSINESS_ID_COMMON_REPLY:
      idMsg = '平台通用应答'
      break
  }

  return idMsg
}
