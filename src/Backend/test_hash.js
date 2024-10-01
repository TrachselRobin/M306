const crypto = require('crypto');
const hash = crypto.createHash('sha256');

function hashPassword(password) {
    return hash.update(toString(password)).digest('base64');
}

console.log(hashPassword('1234')); // 1234 = 84i8fNlTuVH/344GJ12UlG3FLwPtllNkl/vlNEadONY=