import { JSEncrypt } from 'jsencrypt'

const crypt = new JSEncrypt()
// 设置公钥
crypt.setPublicKey('-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDwHQU77tsMBNbKnzVd+OZeINs7rPgGdV8owrau1Ox9a5axrJ2nak3dDQiD9Zt/UfkckZhqFYhDmzxYOgkYDmoP4fTMeqIwY4e0m4+WDTF6Ef74tEW2SeNwUVqBtcKD+DGEx9QTaWjOLu+wIw4f4gRuuro27oSctyNJfiJ625C32QIDAQAB-----END PUBLIC KEY-----')
// 设置私钥
crypt.setPrivateKey('-----BEGIN RSA PRIVATE KEY-----MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAPAdBTvu2wwE1sqfNV345l4g2zus+AZ1XyjCtq7U7H1rlrGsnadqTd0NCIP1m39R+RyRmGoViEObPFg6CRgOag/h9Mx6ojBjh7Sbj5YNMXoR/vi0RbZJ43BRWoG1woP4MYTH1BNpaM4u77AjDh/iBG66ujbuhJy3I0l+InrbkLfZAgMBAAECgYEA2+hYQNmzeEB+T7icceJhadgBsZfq2E9qxbP/CAQuS3fb3gHPqeKsSUWEhQbOUT9MPaQCyTXLRM/J5qvQZF3fN8KAOxJUXxu8iy2qb2XPv/9/1dZf0i2uCDivjaCc8/PviXMZs0a0P4HDHsHHffn6vcYIiEnhCf2eMMIdV3nZxeECQQD4jr4qKMVVMtOme11COJgBnlHVv6CmTLeTGv8rz4LMzeBSJJfMVjfLpHf8Ivo4mVdx7VBlbNIVi7jwBVPLE4CtAkEA902M6tJ8BahnEX6oP1p6W2A2ChA6leE7wWnrtzDjiCG9nNExUFHhdCE5EceV8nfLIcX9XE/t6voEyVJU5pD9XQJBAJqBEJBgW5nESHA6SxQ43bRT14bI4XG+SnZ0151CFop8hy5IdNud1H0PtU3T6Dp6hzLYU5tYc5bVDZaVmSqo6tkCQFzNJDFGVTYGUM8W2WoUuM+rVfwGxQVTZQoahlLTLL778lxzf+7lGxZqFTFf1RwM6hQ9aOsIL3663aryk1uGUx0CQAp0fGJM/Y5Ic+rrZA46kV5+BtXJulkIRTVBTMW1vv714iCk6selXIzQo2sU0gD0BUVlx8V1yoKileuksRbuU5k=-----END RSA PRIVATE KEY-----')

export default {
  // RSA加密
  rsaEncrypt: (text) => {
    if (typeof text !== 'string') {
      return text
    } else {
      return crypt.encrypt(text)
    }
  },
  // RSA解密
  rsaDecrypt: (text) => {
    if (typeof text !== 'string') {
      return text
    } else {
      return crypt.decrypt(text)
    }
  },
  // 金额格式化
  formatMoney: (s, n) => {
    if (isNaN(s) || String(s) === '') return s
    n = n > 0 && n <= 20 ? n : 2
    s = parseFloat((s + '').replace(/[^\d.-]/g, '')).toFixed(n) + ''
    var l = s.split('.')[0].split('').reverse()
    var r = s.split('.')[1]
    t = ''
    for (var i = 0; i < l.length; i++) {
      var t
      t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
    }
    return t.split('').reverse().join('') + '.' + r
  }
}
