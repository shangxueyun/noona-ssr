/**
 * 验证是否是手机号
 *
 * @export
 * @param {any} phone
 * @returns
 */
export function isPhone (phone) {
  const phoneReg = /^1[3-9][0-9]\d{8}$/
  if (phoneReg.test(phone)) {
    return true
  }
  return false
}

/**
 * 验证是否是email
 *
 * @export
 * @param {any} email
 * @returns
 */
export function isEmail (email) {
  const emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
  if (emailReg.test(email)) {
    return true
  }
  return false
}

/**
 * 验证是否是邮编
 *
 * @export
 * @param {*} zipCode
 * @returns
 */
export function isZipCode (zipCode) {
  let regPost = /^[1-9]\d{5}$/
  if (regPost.test(zipCode)) {
    return true
  }
  return false
}

/**
 * 验证是否是邀请码
 *
 * @export
 * @param {any} masterCode
 * @returns
 */
export function isMasterCode (masterCode) {
  const Reg = /^\d{7,10}$/
  if (Reg.test(masterCode)) {
    return true
  }
  return false
}

/**
 * 验证身份证号
 *
 * @export
 * @param {any} email
 * @returns
 */
export function isIdCard (idCard) {
  const idCardReg = /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/
  if (idCardReg.test(idCard)) {
    return true
  }
  return false
}
