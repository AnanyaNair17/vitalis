import express from 'express';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get donor notifications
router.get('/notifications', requireAuth, requireRole('DONOR'), async (req, res) => {
  try {
    const donor = await prisma.donor.findUnique({
      where: { userId: req.user.id },
    });

    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

    const notifications = await prisma.requestMatch.findMany({
      where: { donorId: donor.id },
      include: {
        request: {
          select: {
            id: true,
            bloodGroup: true,
            city: true,
            urgent: true,
            status: true,
            createdAt: true,
            hospital: {
              select: { name: true, city: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get donor availability
router.get('/availability', requireAuth, requireRole('DONOR'), async (req, res) => {
  try {
    const donor = await prisma.donor.findUnique({
      where: { userId: req.user.id },
      select: { available: true },
    });

    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

    res.json({ available: donor.available });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// Update donor availability
router.patch('/availability', requireAuth, requireRole('DONOR'), async (req, res) => {
  const { available } = req.body;

  if (typeof available !== 'boolean') {
    return res.status(400).json({ error: 'Available must be true or false' });
  }

  try {
    const donor = await prisma.donor.findUnique({
      where: { userId: req.user.id },
    });

    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

    const updatedDonor = await prisma.donor.update({
      where: { id: donor.id },
      data: { available },
      select: { id: true, available: true },
    });

    res.json({
      message: 'Availability updated successfully',
      ...updatedDonor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update donor profile
router.patch('/profile', requireAuth, requireRole('DONOR'), async (req, res) => {
  const { phone, city } = req.body;

  if (phone === undefined && city === undefined) {
    return res.status(400).json({ error: 'Provide phone or city to update' });
  }

  if (
    (phone !== undefined && (typeof phone !== 'string' || !phone.trim())) ||
    (city !== undefined && (typeof city !== 'string' || !city.trim()))
  ) {
    return res.status(400).json({ error: 'Phone and city must be non-empty strings' });
  }

  try {
    const donor = await prisma.donor.findUnique({
      where: { userId: req.user.id },
    });

    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

    const updatedDonor = await prisma.donor.update({
      where: { id: donor.id },
      data: {
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(city !== undefined && { city: city.trim() }),
      },
      select: { id: true, name: true, phone: true, city: true },
    });

    res.json({ message: 'Profile updated successfully', donor: updatedDonor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
