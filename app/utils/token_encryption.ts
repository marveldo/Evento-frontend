import crypto from "crypto"

const ENCRYPTION_KEY = crypto.createHash('sha256').update(String(process.env.NEXT_PUBLIC_ENCRYPTION_KEY)).digest('base64').substring(0, 32)
const IV_LENGTH = 16 ;
const algorithm = process.env.NEXT_ENCRYPTION_ALGORITHM as string




export function encryptToken(token : string | undefined) {
    if (token === undefined){
        throw new Error('Token is needed')
    }
    const iv = crypto.randomBytes(IV_LENGTH); // Initialization vector
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'utf-8'), iv);
    let encrypted = cipher.update(token, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // Return the IV and encrypted token as a single string
  }

export  function decryptToken(encryptedToken : string | undefined) {
    if (encryptedToken === undefined){
        throw new Error('Token is needed')
    }
    const [ivHex, encryptedData] = encryptedToken.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }