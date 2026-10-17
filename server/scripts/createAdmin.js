import 'dotenv/config'
import bcrypt from 'bcrypt'
import { prisma } from '../src/db.js'

const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD

if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first')
  process.exit(1)
}

const existing = await prisma.user.findUnique({ where: { email } })
if (existing) {
  console.log('Admin already exists')
} else {
  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.create({ data: { email, passwordHash, role: 'ADMIN' } })
  console.log('Admin created:', email)
}

await prisma.$disconnect()