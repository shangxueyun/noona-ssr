import uuidV4 from 'uuid/v4'

/**
 * uuid 生成
 *
 * @export
 * @returns
 */
export function generateUUID () {
  let uuid = uuidV4()
  uuid = uuid.replace(/-/g, '')
  uuid = uuid.toUpperCase()
  window.localStorage.setItem('all_outside_uuid', uuid)
  return uuid
}

/**
 * 获取uuid
 *
 * @export
 * @returns
 */
export function getUUID () {
  let uuid = window.localStorage.getItem('all_outside_uuid') || ''
  return uuid || generateUUID()
}

/**
 *  获取udid
 *
 * @export
 * @param {*} [params={udid:String}]
 * @returns
 */
export function getUdid (params = {}) {
  let nativePublicParams = window.nativePublicParams || {}
  let udid = ''
  if (nativePublicParams && nativePublicParams._udid) { // 端内的 udid
    udid = nativePublicParams._udid || ''
  } else { // 端外的 udid (uuid 生成)
    udid = getUUID() || ''
  }
  return udid
}
