import CryptoJS from "crypto-js"

const encryptionKey = CryptoJS.enc.Hex.parse(process.env.KEY || "")
const iv = CryptoJS.enc.Hex.parse(process.env.IV || "")

export const aesEncryptor = CryptoJS.algo.AES.createEncryptor(encryptionKey, {iv: iv})
export const aesDecryptor = CryptoJS.algo.AES.createDecryptor(encryptionKey, {iv: iv})