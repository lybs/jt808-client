import moment from 'moment'
import {workTime} from '../../constants/config'

const expireDate = workTime.expire
const weekLimit = workTime.weekLimit
const morningLimit = workTime.morningLimit
const afternoonLimit = workTime.afternoonLimit

export default function loop (callback) {
  let now = moment()
  let date = parseInt(now.format('YYYYMMDD'))
  let time = parseInt(now.format('HHmmss'))
  let d = parseInt(now.format('E'))

  let isWorkingTime = false

  let isExpired = date > parseInt(expireDate)
  let isWeekWorkingTime = !isExpired && weekLimit.indexOf(d) !== -1
  let isMorningWorkingTime = isWeekWorkingTime && parseInt(morningLimit[0]) < time && time < parseInt(morningLimit[1])
  let isAfternoonWorkingTime = isWeekWorkingTime && parseInt(afternoonLimit[0]) < time && time < parseInt(afternoonLimit[1])

  if (isMorningWorkingTime || isAfternoonWorkingTime) {
    isWorkingTime = true
  }

  callback(isWorkingTime, isExpired)

  setTimeout(function () {
    loop(callback)
  }, 1000)
}
