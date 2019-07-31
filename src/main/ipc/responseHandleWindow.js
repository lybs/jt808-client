import * as constants from '../../jt808/constants'
import {MAIN_WINDOW_RESPONSE} from './requestAndResponse'

export default function (id, subId, callback) {
  if (id === -1) {
    callback(null, MAIN_WINDOW_RESPONSE.CONNECT)
    return
  }
  if (id === -2) {
    callback(null, MAIN_WINDOW_RESPONSE.LOGIN)
    return
  }
  if (id === -3) {
    callback(null, MAIN_WINDOW_RESPONSE.CONSOLE)
    return
  }
  if (id === constants.TERMINAL_BUSINESS_ID_HEART_BEAT) {
    callback(null, MAIN_WINDOW_RESPONSE.PING)
    return
  }
  if (id === constants.TERMINAL_BUSINESS_ID_LOGIN_AUTH) {
    callback(null, MAIN_WINDOW_RESPONSE.LOGIN)
    return
  }
  if (id === constants.TERMINAL_BUSINESS_ID_LOCATION_INFO_REPORT) {
    callback(null, MAIN_WINDOW_RESPONSE.GPS)
    return
  }

  callback(new Error('找不到应答类型'))
}
