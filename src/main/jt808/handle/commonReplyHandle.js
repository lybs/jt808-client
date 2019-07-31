import responseHandleWindow from '../../ipc/responseHandleWindow'

export default function (socket, commonReply) {
  let replyFlowId = commonReply.getReplyFlowId()
  let replyId = commonReply.getReplyId()
  let replyResult = commonReply.getReplyResult()

  if (!socket.hasFlowIdStatus(replyFlowId)) {
    console.log('平台通用应答出错：流水号找不到')
    return
  }

  if (socket.getFlowIdStatus(replyFlowId).id !== replyId) {
    console.log('平台通用应答出错：跟保存的类型不一致')
    return
  }

  socket.getFlowIdStatus(replyFlowId).isResponse = true

  responseHandleWindow(replyId, socket.getFlowIdStatus(replyFlowId).subId, function (err, type) {
    if (err) {
      console.log('平台通用应答出错：')
      return
    }
    socket.emit('mainWindowResponse', {type: type, data: replyResult})
  })
}
