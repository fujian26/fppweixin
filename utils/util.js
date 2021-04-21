const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
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

function isSameDay(format1, format2) {
  var date1 = new Date(format1)
  var date2 = new Date(format2)

  return date1.getFullYear() == date2.getFullYear() &&
    date1.getMonth() == date2.getMonth() &&
    date1.getDate() == date2.getDate()
}

function isToday(format) {
  var date = new Date(format)
  var now = new Date()

  return date.getFullYear() == now.getFullYear() &&
    date.getMonth() == now.getMonth() &&
    date.getDate() == now.getDate()
}

function stringToByte(str) {
  var bytes = new Array();
  var len, c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10FFFF) {
      bytes.push(((c >> 18) & 0x07) | 0xF0);
      bytes.push(((c >> 12) & 0x3F) | 0x80);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00FFFF) {
      bytes.push(((c >> 12) & 0x0F) | 0xE0);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007FF) {
      bytes.push(((c >> 6) & 0x1F) | 0xC0);
      bytes.push((c & 0x3F) | 0x80);
    } else {
      bytes.push(c & 0xFF);
    }
  }
  return bytes;
}


function byteToString(arr) {
  if (typeof arr === 'string') {
    return arr;
  }
  var str = '',
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}

function isStringEmpty(str) {
  return str == null || str == undefined || str.length == 0
}

module.exports = {
  formatTime,
  getDistanceTime,
  isSameDay,
  isToday,
  stringToByte,
  byteToString,
  isStringEmpty
}