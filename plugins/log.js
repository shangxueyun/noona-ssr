/*
 * @Author: ouyangwei@yixia.com
 * @Date: 2018-08-17 17:10:11
 * @Last Modified by: 欧阳威
 * @Last Modified time: 2019-05-06 14:17:00
 */
import * as Utils from '~/utils'
import Detect from '~/plugins/detect'
import DeepLink from '~/plugins/deepLink'

/**
 *
 *
 * @export
 * @class Log
 */
class Log {
  /**
   * 日志收集
   *
   * @param {*} options
   * @param {*} key
   * @memberof Log
   */
  collect (options) {
    let params = Utils.getParams()
    let source = ''
    try {
      source = Utils.getQueryString('source')
    } catch (error) {
      console.error(error)
    }
    // 大数据投递
    let data = {
      app: options.app || 'H5',
      page: options.page || 'index',
      pcid: '',
      udid: params.udid || '',
      abid: '',
      event: options.event || 'pageView',
      param: {
        login: 0,
        plat: Detect.os.platform,
        source: source || 0
      }
    }
    data.param = Object.assign({}, data.param, options.param || options.params)
    let image = new Image(1, 1)
    image.onload = function () {}
    image.src = `${process.env.logUrl}/h5/?data=` + window.encodeURIComponent(JSON.stringify(data))

    // 唤起已安装客户端及下载
    let key = options && options.key
    if (key && key != 'pageView' && key !== 'play' && key !== 'replay' && key !== 'endPlay' && key !== 'againPlay') {
      DeepLink.callInstalledApp(options.params)
    }
  }
  // 日志事件
  event (options) {
    const events = {
      // share/media
      openBanner: 'openBanner', // 打开banner
      mediaInfoTitle: 'mediaInfoTitle', // 媒资信息标题
      mediaInfoImage: 'mediaInfoImage', // 媒资信息图片
      mediaInfoLink: 'mediaInfoLink', // 媒资信息超链接
      joinGroupBtn: 'joinGroupBtn', // 加入小组
      // 视频列表
      moreVideo: 'moreVideo', // 更多视频
      moreNews: 'moreNews', // 更多资讯
      // 小组相关事件
      viewNow: 'viewNow', // 立即查看
      teamNow: 'teamNow', // 立即组队
      // 视频播放相关事件
      hotVideo: 'hotVideo', // 热门视频
      recVideo: 'recVideo', // 推荐视频
      play: 'play', // 视频播放
      retry: 'retry', // 重试
      endPlay: 'endPlay', // 视频结束
      replay: 'replay', // 视频重播
      againPlay: 'againPlay', // 视频再播
      keepPlaying: 'keepPlaying', // 继续观看
      goPlay: 'goPlay', // 去看看

      // share/user
      pgcPic: 'pgcPic', // 用户头像
      followBtn: 'followBtn', // 关注按钮
      userVideo: 'userVideo', // 用户视频
      videoLike: 'videoLike', // 点赞

      // share/group
      bottomBanner: 'bottomBanner', // 底部banner
      middleBanner: 'middleBanner', // 中间banner
      openAppBtn: 'openAppBtn',
      joinBtn: 'joinBtn', // 加入
      recJoinBtn: 'recJoinBtn', // 推荐加入

      // share/invite
      inviteDownload: 'inviteDownload', // 邀请好友分享下载按钮
      inviteCopy: 'inviteCopy', // 邀请好友分享复制邀请码

      // common
      pageView: 'pageView', // 页面加载
      topBanner: 'topBanner', // 底部banner
      download: 'download', // 下载
      delete: 'delete', // 删除页面
      mediaListPgcPic: 'mediaListPgcPic', // 媒资列表用户头像
      mediaListFollowBtn: 'mediaListFollowBtn', // 媒资列表关注按钮
      mediaListComment: 'mediaListComment', // 媒资列表评论
      mediaListLike: 'mediaListLike', // 媒资列表喜欢(赞)
      mediaListShare: 'mediaListShare', // 媒资列表分享
      mediaListContent: 'mediaListContent' // 媒资列表内容(text/news/link)
      // mediaListTitle: 'mediaListTitle', // 媒资列表标题
      // mediaListImage: 'mediaListImage', // 媒资列表图片
    }

    this.collect({
      event: events[options.key],
      ...options
    })
  }
}

export default new Log()
