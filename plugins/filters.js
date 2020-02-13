import Vue from 'vue'

/**
 * 格式化for key
 *
 * @export
 * @param {*} val
 */
export function formatKey (val) {
  return val + Math.floor(Math.random() * 100000000) + ''
}

/**
 * 格式化图片地址
 *
 * @export
 * @param {*} covers
 */
export function formatImgUrl (covers, item) {
  // cover 1原图；2封图或上图下文；3左文右图小图；4详情页图片；5(640*640)；6(240*240)；7gif；8webp
  let coverObj = covers && covers[1]
  if (coverObj) {
    // mediaType(1视频video；2音频audio；3图文imageText；4纯文本text；5资讯news；6外链link；7小组group；)
    const mediaType = item.basic.mediaType
    // coverType 0未知、1左文右图、2三图、3无图、4大图
    const coverType = item.basic.coverType
    switch (mediaType) {
      case 1: // 视频
        if (covers[2]) {
          coverObj = covers[2]
        }
        break
      case 3: // 图文
        if (covers[7]) {
          coverObj = coverObj.lock ? covers[7] : covers[1]
        } else {
          coverObj = covers[6] || covers[1]
        }
        break
      case 5: // 资讯
        if (covers[3] && (coverType == 1 || coverType == 2)) {
          coverObj = covers[3]
        } else if (covers[2] && coverType == 4) {
          coverObj = covers[2]
        } else {
          coverObj = covers[4] || covers[1]
        }
        break
      case 6: // 外链
        // link 左文右图（小图）: 宽*高 <= 300*180  或  宽 / 高< 1 或 宽 / 高 > 2；展示图片取3
        // 上图下文（大图16：9）: 宽*高 > 300*180  并且  宽 / 高 >= 1 并且 宽 / 高 <= 2；展示图片取2
        if (coverObj && coverObj.width && coverObj.height) {
          const scaleWH = (coverObj.width / coverObj.height).toFixed(3)
          if (coverObj.width * coverObj.height > 300 * 180 && scaleWH >= 1 && scaleWH <= 2) {
            coverObj = covers[2] || covers[1]
          } else {
            coverObj = covers[3] || covers[1]
          }
        }
        break
      default:
        break
    }
    // 图文锁定封图
    const coverUrl = (coverObj.lock && mediaType == 3) ? coverObj.url + coverObj.mh : coverObj.url
    return { 'background-image': `url(${coverUrl})` }
  } else {
    return { 'background': 'transparent' }
  }
}

/**
 * 格式化图片标识(锁)
 *
 * @export
 * @param {*} covers
 */
export function formatImgFlagClass (covers) {
  let className = 'none'
  const coverObj = covers && covers[1]
  if (coverObj) {
    if (covers[8] || covers[7]) {
      className = coverObj.lock ? 'gif-lock' : 'gif'
    } else {
      className = coverObj.lock ? 'lock' : 'none'
    }
  }
  return className
}

/**
 * 格式化图片九宫格样式
 *
 * @export
 * @param {*} covers
 */
export function formatImgListClass (cover) {
  // coverType // 1左文右图、2三图、3无图、4大图
  const length = cover && cover.length
  let className
  switch (length) {
    case 1:
      // PGC固定16：9卡片：宽 / 高 >= 1.3
      // UGC：宽 / 高 < 1.3
      // const coverObj = cover[0] && cover[0][1]
      // const scaleWH = (coverObj.width / coverObj.height).toFixed(3)
      // className = scaleWH >= 1.3 ? 'one' : 'custom'
      className = 'one'
      break
    case 2:
    case 4:
      className = 'two'
      break
    default:
      className = 'three'
      break
  }
  return className
}

/**
 * 格式化添加时间
 *
 * @export
 * @param {*} time
 */
export function formatAddTime (time) {
  let formatTime
  const addTime = parseInt(time) * 1000
  // let currDate = new Date().toLocaleDateString().split('/').join('-') // 今天
  const timeHrs = new Date().getTime() - 24 * 60 * 60 * 1000
  // 前48小时时间
  const timeY = new Date().getTime() - ((24 * 60 * 60 * 1000) * 2)
  // 前72小时时间
  const timeD = new Date().getTime() - ((24 * 60 * 60 * 1000) * 3)

  if (addTime < timeD) {
    const date = new Date(addTime)
    const y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    formatTime = y + '-' + m + '-' + d
  } else if (addTime < timeY) {
    formatTime = '2 days ago'
  } else if (addTime < timeHrs) {
    formatTime = 'yesterday'
  } else {
    // let times = formatTimeF(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(/\//g, '-')
    // times = times + 2
    // const hours = Math.floor(24 - ((addTime - timeHrs) / (60 * 60 * 1000) % 24))
    // formatTime = hours + (hours > 1 ? ' hours ago' : ' hour ago')
    // formatTime = times
    let initialTime = []
    initialTime.push(new Date(0).getHours(), new Date(0).getMinutes(), new Date(0).getSeconds())

    var GetTime = []
    GetTime.push(new Date(new Date().getTime() - addTime).getHours(), new Date(new Date().getTime() - addTime).getMinutes(), new Date(new Date().getTime() - addTime).getSeconds())
    const hours = Math.floor(24 - ((addTime - timeHrs) / (60 * 60 * 1000) % 24))
    if (hours > 0) {
      if (hours >= 2) {
        formatTime = `${hours} hrs ago`
      } else {
        formatTime = `1 hr ago`
      }
    } else {
      if ((GetTime[1] - initialTime[1]) > 0) {
        if ((GetTime[1] - initialTime[1]) >= 2) {
          formatTime = `${(GetTime[1] - initialTime[1])} mins ago`
        } else {
          formatTime = '1 min ago'
        }
      } else {
        formatTime = '1 min ago'
      }
    }
  }

  return formatTime
}
// 8小时差
export function formatTimeF (date = new Date(), type) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return type === 'requestTime' ? [year, month, day, hour, minute, second].map(formatNumber).join('') : [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 格式化时间 +0
export function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 格式化视频时长
 *
 * @export
 * @param {*} time
 */
export function formatVideoDuration (duration) {
  let timeHou = Math.floor(duration / 60 / 60)
  let timeMin = Math.floor(duration / 60 % 60)
  let timeSec = Math.floor(duration % 60)

  timeHou = timeHou > 0 && timeHou < 10 ? '0' + timeHou : timeHou
  timeMin = timeMin < 10 ? '0' + timeMin : timeMin
  timeSec = timeSec < 10 ? '0' + timeSec : timeSec

  const timeStr = (timeHou ? timeHou.toString() + ':' : '') + timeMin.toString() + ':' + timeSec.toString()

  return timeStr
}

const filters = {
  formatKey,
  formatImgUrl,
  formatImgFlagClass,
  formatImgListClass,
  formatAddTime,
  formatVideoDuration
}

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

export default filters
