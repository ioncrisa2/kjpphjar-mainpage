/**
 * Script untuk generate bcrypt hash dari password admin.
 * Jalankan: node scripts/generate-hash.js
 * Lalu copy hasilnya ke .env sebagai ADMIN_PASSWORD_HASH
 */

const bcrypt = require('bcryptjs')

const password = process.argv[2]

if (!password) {
  console.error('Usage: node scripts/generate-hash.js <your-password>')
  process.exit(1)
}

const hash = bcrypt.hashSync(password, 12)
console.log('\n✅ Password hash generated successfully!\n')
console.log('ADMIN_PASSWORD_HASH=' + hash)
console.log('\nCopy the line above into your .env file.\n')
