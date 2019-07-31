import * as constants from '../../jt808/constants'
import {MAIN_WINDOW_REQUEST} from './requestAndResponse'

export default function (ipc) {
  return {
    [MAIN_WINDOW_REQUEST.CONNECT] (event, params) {
      ipc.socketConnect(params.host, params.port, params.isUTC)
    },
    [MAIN_WINDOW_REQUEST.DISCONNECT] () {
      ipc.socketDisconnect()
    },
    [MAIN_WINDOW_REQUEST.LOGIN] (event, params) {
      ipc.socketWrite(params, constants.TERMINAL_BUSINESS_ID_LOGIN_AUTH)
    },
    [MAIN_WINDOW_REQUEST.PING] (event, params) {
      ipc.socketWrite(params, constants.TERMINAL_BUSINESS_ID_HEART_BEAT)
    },
    [MAIN_WINDOW_REQUEST.GPS] (event, params) {
      ipc.socketWrite(params, constants.TERMINAL_BUSINESS_ID_LOCATION_INFO_REPORT)
    },
    [MAIN_WINDOW_REQUEST.PENETRATE] (event, params) {
      ipc.socketPenetrateWrite(params)
    }
  }
}
