const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function getDistanceTime(timeStr) {  

  var timeDate = new Date(timeStr.replace(/-/g, '/'))
  var nowTime = new Date().getTime()
  var diffTime = nowTime - timeDate.getTime()

  console.log('timeStr ' + timeStr + " nowTime " + nowTime + " timeDate.getTime() " + timeDate.getTime())

  var min = diffTime / 60 * 1000
  if (min <= 1) {
    return '刚刚'
  } else {
    var hour = diffTime / 60 * 60 * 1000
    if (hour == 0) {
      return min + '分钟前'
    } else if (hour < 24) {
      return hour + '小时前'
    } else {
      var day = hour / 24
      if (day <= 5) {
        return day + '天前'
      } else {
        return timeStr
      }
    }
  }  
}

module.exports = {
  formatTime,
  getDistanceTime
}
