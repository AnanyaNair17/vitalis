import express from 'express';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Update donor availability
router.patch(
  '/availability',
  requireAuth,
  requireRole('DONOR'),
  async (req, res) => {
    const { available } = req.body;

    if (typeof available !== 'boolean') {
      return res.status(400).json({
        error: 'Available must be true or false',
      });
    }

    try {
      const donor = await prisma.donor.findUnique({
        where: {
          userId: req.user.id,
        },
      });

      if (!donor) {
        return res.status(404).json({
          error: 'Donor profile not found',
        });
      }

      const updatedDonor = await prisma.donor.update({
        where: {
          id: donor.id,
        },
        data: {
          available,
        },
        select: {
          id: true,
          available: true,
        },
      });

      return res.json({
        message: 'Availability updated successfully',
        ...updatedDonor,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        error: 'Server error',
      });
    }
  }
);
// Update donor profile contact information and location
router.patch(
  '/profile',
  requireAuth,
  requireRole('DONOR'),
  async (req, res) => {
    const { phone, city } = req.body;

    if (
      phone === undefined &&
      city === undefined
    ) {
      return res.status(400).json({
        error: 'Provide phone or city to update',
      });
    }

    if (
      (phone !== undefined &&
        (typeof phone !== 'string' || !phone.trim())) ||
      (city !== undefined &&
        (typeof city !== 'string' || !city.trim()))
    ) {
      return res.status(400).json({
        error: 'Phone and city must be non-empty strings',
      });
    }

    try {
      const donor = await prisma.donor.findUnique({
        where: {
          userId: req.user.id,
        },
      });

      if (!donor) {
        return res.status(404).json({
          error: 'Donor profile not found',
        });
      }

      const updatedDonor = await prisma.donor.update({
        where: {
          id: donor.id,
        },
        data: {
          ...(phone !== undefined && { phone: phone.trim() }),
          ...(city !== undefined && { city: city.trim() }),
        },
        select: {
          id: true,
          name: true,
          phone: true,
          city: true,
        },
      });

      return res.json({
        message: 'Profile updated successfully',
        donor: updatedDonor,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        error: 'Server error',
      });
    }
  }
);

export default router;