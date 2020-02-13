/**
 * 获取渠道包链接
 *
 * @export
 * @param {*} source
 * @returns
 */
export default function (source) {
  let params = {}
  switch (source) {
    case '10day':
      params = {
        ckey: 'CK1393851856061',
        qq: 'bb_10day_h5',
        other: 'bb_10day_h5'
      }
      break
    case '3day':
      params = {
        ckey: 'CK1397763500312',
        qq: 'bb_3day_h5',
        other: 'bb_3day_h5'
      }
      break
    case 'pay8':
      params = {
        ckey: 'CK1398876964100',
        qq: 'bb_red_pay8',
        other: 'bb_red_pay8'
      }
      break
    case 'pay10':
      params = {
        ckey: 'CK1398876964101',
        qq: 'bb_red_pay10',
        other: 'bb_red_pay10'
      }
      break
    case 'pay20':
      params = {
        ckey: 'CK1398876964102',
        qq: 'bb_red_pay20',
        other: 'bb_red_pay20'
      }
      break
    case 'bb_red_mdm':
      params = {
        ckey: 'CK1399062175544',
        qq: 'shhs_xxl_qs5',
        other: 'shhs_xxl_qs5'
      }
      break
    case 'bb_dyj': // 波波大赢家
      params = {
        ckey: 'CK1387900164056',
        qq: 'red_qq',
        other: 'red_other'
      }
      break
    case 'bb_wx_pyq': // 任务中心-分享到朋友圈
      params = {
        ckey: 'CK1398267283125',
        qq: 'red_qq',
        other: 'red_other'
      }
      break
    case 'bb_wx_ssr': // 任务中心-分享晒晒收入
      params = {
        ckey: 'CK1398267283126',
        qq: 'red_qq',
        other: 'red_other'
      }
      break
    case '7': // 赚钱小技巧
      params = {
        ckey: 'CK1399493082979',
        qq: 'red_qq',
        other: 'red_other'
      }
      break
    default:
      params = {
        ckey: 'CK1384545684987',
        qq: 'red_qq',
        other: 'red_other'
      }
      break
  }

  let downLinkWx = `http://a.app.qq.com/o/simple.jsp?pkgname=tv.yixia.bobo&ckey=${params.ckey}`
  let downLinkQQ = `http://d.bbobo.com/bb/down/${params.qq}`
  let downLinkDefault = `http://d.bbobo.com/bb/down/${params.other}`
  return {
    downLinkWx,
    downLinkQQ,
    downLinkDefault
  }
}
