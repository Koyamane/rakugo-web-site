/*
 * @Author: dingyun
 * @Date: 2023-02-28 13:00:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-08 20:58:37
 * @Description:
 */
import CryptoJS from 'crypto-js'

const defaultKey = 'rakugo_blog_back_end_16393856782'

/**
  * @description AES加密
  * @param content 加密内容
  * @param key 加密密码，由字母或数字组成
      此方法使用AES-128-ECB加密模式，key需要为16位
      加密解密key必须相同，如：abcd1234abcd1234
  * @return 加密密文
  */
export const aesEncrypt = (content: string, key: string = defaultKey) => {
  const sKey = CryptoJS.enc.Utf8.parse(key)
  const sContent = CryptoJS.enc.Utf8.parse(content)
  const encrypted = CryptoJS.AES.encrypt(sContent, sKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

/**
  * @description AES解密
  * @param content 加密密文
  * @param key 加密密码，由字母或数字组成
        此方法使用AES-128-ECB加密模式，key需要为16位
        加密解密key必须相同，如：abcd1234abcd1234
  * @return 解密明文
  */
export const aesDecrypt = (content: string, key: string = defaultKey) => {
  const sKey = CryptoJS.enc.Utf8.parse(key)
  const decrypt = CryptoJS.AES.decrypt(content, sKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
