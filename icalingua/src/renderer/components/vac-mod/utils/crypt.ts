import crypto from 'crypto'
const VERSION = 1
const IV_LENGTH = 16
const MSG_HEADER = ['auroraencryptmsg', 'encryptedamsg', 'aem', 'ema', 'eames']

export function encryptMessage(content: string, secret: string): string {
    let iv = crypto.randomBytes(IV_LENGTH)
    let cipher = crypto.createCipheriv('aes-128-gcm', secret.split('').reverse().join(''), iv)
    let hex = cipher.update(content.split('').reverse().join(''), 'utf8', 'hex')
    hex += cipher.final('hex')
    let authTag = cipher.getAuthTag()
    let selectedMsgHeaderArray = MSG_HEADER[Math.floor(Math.random() * MSG_HEADER.length)].split('')
    for (let i = 0; i < selectedMsgHeaderArray.length; i++) {
        selectedMsgHeaderArray[i] =
            Math.round(Math.random()) == 1
                ? selectedMsgHeaderArray[i].toUpperCase()
                : selectedMsgHeaderArray[i].toLowerCase()
    }

    let msg =
        selectedMsgHeaderArray.reverse().join('') +
        '?' +
        hex.split('').reverse().join('') +
        '"' +
        Buffer.from(authTag).toString('base64') +
        ':' +
        Buffer.from(iv).toString('base64')
    return msg
}

export function decryptMessage(content: string, secret: string): string {
    let questionPos = content.indexOf('?'),
        quotationPos = content.indexOf('"'),
        colonPos = content.indexOf(':')
    let iv = Buffer.from(content.substring(colonPos), 'base64')
    let authTag = Buffer.from(content.substring(quotationPos + 1, colonPos), 'base64')
    if (questionPos == -1 || colonPos == -1 || quotationPos == -1 || iv.length != IV_LENGTH)
        throw new Error('Invalid encrypted message.')
    let msgHeader = content.substring(0, questionPos).split('').reverse().join('').toLowerCase()
    if (!MSG_HEADER.includes(msgHeader)) throw new Error('Invalid encrypted message.')
    let cipher = crypto.createDecipheriv('aes-128-gcm', secret.split('').reverse().join(''), iv)
    cipher.setAuthTag(authTag)
    let msg = cipher.update(
        content
            .substring(questionPos + 1, quotationPos)
            .split('')
            .reverse()
            .join(''),
        'hex',
        'utf8',
    )
    msg += cipher.final('utf8')
    msg = msg.split('').reverse().join('')
    return msg
}
