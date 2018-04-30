export function formatDate (timestamp, sep = '-', showTime = false) {
  if (!timestamp) return ''

  if (typeof sep === 'boolean') {
    showTime = sep
    sep = '-'
  }

  const d = new Date(timestamp)
  let year = d.getFullYear()
  let month = d.getMonth() + 1
  let date = d.getDate()
  let hour = ''
  let minute = ''
  let second = ''

  month = String(month)[1] ? month : `0${month}`
  date = String(date)[1] ? date : `0${date}`

  if (showTime) {
    hour = d.getHours()
    minute = d.getMinutes()
    second = d.getSeconds()
    hour = String(hour)[1] ? hour : `0${hour}`
    minute = String(minute)[1] ? minute : `0${minute}`
    second = String(second)[1] ? second : `0${second}`
  }

  let ret = [year, month, date].join(sep)
  return showTime ? ret + ' ' + [hour, minute, second].join(':') : ret
}

export function formatTime (time, sep = '-') {
  if (!Array.isArray(time)) {
    time = [time]
  }

  return time.map(val => {
    let ret = null
    if (val % 2 === 0) {
      val = String(val / 2)
      ret = val[1] ? `${val}:00` : `0${val}:00`
    } else {
      let n = parseInt(val / 2) + ''
      ret = n[1] ? `${n}:30` : `0${n}:30`
    }
    return ret
  }).join(sep)
}

export function formatPhone (phone) {
  if (!phone) return ''

  const first = phone.slice(0, 3)
  const last = phone.slice(-4)
  return `${first} **** ${last}`
}

export function formatNumber (str = '', unit = '米') {
  return (str + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ` ${unit}`
}

export function time2Number (timestr) {
  return (timestr || '').replace(/:00/g, '').replace(/:30/g, '.5') * 2
}

export function getTimestamp (timestr) {
  const [hours, minutes] = timestr.split(':')
  return new Date().setHours(hours, minutes)
}
