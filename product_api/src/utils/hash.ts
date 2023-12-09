import crypto from 'crypto'

export function hashPassword(password: string) {
    
    const role = crypto.randomBytes(16).toString("hex")
    const hash = crypto
        .pbkdf2Sync(password, role, 1000, 64, "sha512")
        .toString("hex")

    return { hash, role }
}

export function verifyPassword({
    candidatePassword, 
    role, 
    hash,
}:{
    candidatePassword: string, 
    role: string, 
    hash: string
}) {
    const candidateHash = crypto
        .pbkdf2Sync(candidatePassword, role, 1000, 64, "sha512")
        .toString("hex")

    return candidateHash === hash
}