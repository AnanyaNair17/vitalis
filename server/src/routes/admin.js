import { Router } from 'express'
import { prisma } from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth, requireRole('ADMIN'))

router.get('/donors', async (req, res) => {
  const { status } = req.query
  try {
    const donors = await prisma.donor.findMany({
      where: status ? { verificationStatus: status } : {},
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'asc' },
    })
    res.json(donors)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/hospitals', async (req, res) => {
  const { status } = req.query
  try {
    const hospitals = await prisma.hospital.findMany({
      where: status ? { verificationStatus: status } : {},
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'asc' },
    })
    res.json(hospitals)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/donors/:id/verify', async (req, res) => {
  const { decision } = req.body
  const id = Number(req.params.id)

  if (!['VERIFIED', 'REJECTED'].includes(decision)) {
    return res.status(400).json({ error: 'decision must be VERIFIED or REJECTED' })
  }

  try {
    const donor = await prisma.donor.update({
      where: { id },
      data: { verificationStatus: decision },
    })
    res.json(donor)
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Donor not found' })
    }
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/hospitals/:id/verify', async (req, res) => {
  const { decision } = req.body
  const id = Number(req.params.id)

  if (!['VERIFIED', 'REJECTED'].includes(decision)) {
    return res.status(400).json({ error: 'decision must be VERIFIED or REJECTED' })
  }

  try {
    const hospital = await prisma.hospital.update({
      where: { id },
      data: { verificationStatus: decision },
    })
    res.json(hospital)
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Hospital not found' })
    }
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router