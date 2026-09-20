import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../db.js'

const router = Router()

const BLOOD_GROUPS = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG']

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

router.post('/register/donor', async (req, res) => {
  const { email, password, name, bloodGroup, city, phone, declarationAccepted } = req.body

  if (!email || !password || !name || !bloodGroup || !city || !phone) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  if (!BLOOD_GROUPS.includes(bloodGroup)) {
    return res.status(400).json({ error: 'Invalid blood group' })
  }
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Phone must be 10 digits' })
  }
  if (!declarationAccepted) {
    return res.status(400).json({ error: 'Please confirm the information is accurate' })
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'DONOR',
        donor: {
          create: { name, bloodGroup, city, phone, declarationAccepted: true },
        },
      },
    })

    res.status(201).json({
      message: 'Registered. Awaiting admin verification.',
      token: signToken(user),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    res.json({ token: signToken(user), role: user.role })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router