// 终端业务ID
export const TERMINAL_BUSINESS_ID_COMMON_REPLY = 0x0001                     // 终端通用应答
export const TERMINAL_BUSINESS_ID_HEART_BEAT = 0x0002                       // 终端心跳
export const TERMINAL_BUSINESS_ID_LOGIN_AUTH = 0x0102                       // 终端登陆鉴权
export const TERMINAL_BUSINESS_ID_LOCATION_INFO_REPORT = 0x0200             // 位置信息汇报

// 平台业务ID
export const PLATFORM_BUSINESS_ID_COMMON_REPLY = 0x8001                     // 平台通用应答

// 平台统一应答结果列表
export const PLATFORM_REPLY_UNIVERSAL_ALL_LIST = [0x00, 0x01, 0x02, 0x03]

// 重发机制
export const RESEND_NUMBERS = 3                                             // 重发次数
export const RESEND_TIME_INTERVAL = 5000                                    // 重发时间间隔

// 应答超时
export const PLATFORM_REPLY_TIMEOUT = -1
