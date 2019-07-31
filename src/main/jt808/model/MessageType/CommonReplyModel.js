import UnpackingModel from '../UnpackingModel'

export default class CommonReplyModel extends UnpackingModel {
  constructor (unpacking) {
    super(unpacking)

    this.replyFlowId = 0
    this.replyId = 0
    this.replyResult = 0
  }

  getReplyFlowId () {
    return this.replyFlowId
  }

  setReplyFlowId (replyFlowId) {
    this.replyFlowId = replyFlowId
  }

  getReplyId () {
    return this.replyId
  }

  setReplyId (replyId) {
    this.replyId = replyId
  }

  getReplyResult () {
    return this.replyResult
  }

  setReplyResult (replyResult) {
    this.replyResult = replyResult
  }
}
