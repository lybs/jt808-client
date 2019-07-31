import responseHandleWindow from '../../ipc/responseHandleWindow'

export default function (socket, status) {
  responseHandleWindow(-2, null, function (err, type) {
    if (err) {
      return
    }
    socket.emit('mainWindowResponse', {type: type, data: status})
  })
}
