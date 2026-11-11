import express from 'express';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create a blood request
router.post(
  '/',
  requireAuth,
  requireRole('HOSPITAL'),
  async (req, res) => {
    const { bloodGroup, city, urgent = false } = req.body;

    const validBloodGroups = [
      'A_POS',
      'A_NEG',
      'B_POS',
      'B_NEG',
      'AB_POS',
      'AB_NEG',
      'O_POS',
      'O_NEG',
    ];

    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({
        error: 'Invalid blood group',
      });
    }

    if (typeof city !== 'string' || !city.trim()) {
      return res.status(400).json({
        error: 'City is required',
      });
    }

    if (typeof urgent !== 'boolean') {
      return res.status(400).json({
        error: 'Urgent must be true or false',
      });
    }

    try {
      const hospital = await prisma.hospital.findUnique({
        where: {
          userId: req.user.id,
        },
      });

      if (!hospital) {
        return res.status(404).json({
          error: 'Hospital profile not found',
        });
      }

      if (hospital.verificationStatus !== 'VERIFIED') {
        return res.status(403).json({
          error: 'Hospital must be verified to create a blood request',
        });
      }

      const bloodRequest = await prisma.bloodRequest.create({
        data: {
          hospitalId: hospital.id,
          bloodGroup,
          city: city.trim(),
          urgent,
        },
      });

      return res.status(201).json({
        message: 'Blood request created successfully',
        request: bloodRequest,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        error: 'Server error',
      });
    }
  }
);
// Find compatible donors for a blood request
router.get(
  '/:id/matches',
  requireAuth,
  requireRole('HOSPITAL'),
  async (req, res) => {
    try {
      const requestId = Number(req.params.id);

      if (!Number.isInteger(requestId) || requestId <= 0) {
        return res.status(400).json({
          error: 'Invalid request ID',
        });
      }

      const hospital = await prisma.hospital.findUnique({
        where: {
          userId: req.user.id,
        },
      });

      if (!hospital) {
        return res.status(404).json({
          error: 'Hospital profile not found',
        });
      }

      const bloodRequest = await prisma.bloodRequest.findFirst({
        where: {
          id: requestId,
          hospitalId: hospital.id,
        },
      });

      if (!bloodRequest) {
        return res.status(404).json({
          error: 'Blood request not found',
        });
      }

      const compatibleBloodGroups = {
        A_POS: ['A_POS', 'A_NEG', 'O_POS', 'O_NEG'],
        A_NEG: ['A_NEG', 'O_NEG'],
        B_POS: ['B_POS', 'B_NEG', 'O_POS', 'O_NEG'],
        B_NEG: ['B_NEG', 'O_NEG'],
        AB_POS: [
          'A_POS', 'A_NEG', 'B_POS', 'B_NEG',
          'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG',
        ],
        AB_NEG: ['A_NEG', 'B_NEG', 'AB_NEG', 'O_NEG'],
        O_POS: ['O_POS', 'O_NEG'],
        O_NEG: ['O_NEG'],
      };

      const donors = await prisma.donor.findMany({
        where: {
          bloodGroup: {
            in: compatibleBloodGroups[bloodRequest.bloodGroup],
          },
          available: true,
          verificationStatus: 'VERIFIED',
        },
        select: {
          id: true,
          name: true,
          bloodGroup: true,
          city: true,
          phone: true,
        },
      });

      // Rank donors from the request's city first
      donors.sort((a, b) => {
        const aMatch =
          a.city.trim().toLowerCase() ===
          bloodRequest.city.trim().toLowerCase();

        const bMatch =
          b.city.trim().toLowerCase() ===
          bloodRequest.city.trim().toLowerCase();

        return Number(bMatch) - Number(aMatch);
      });

      // Create a match record for each eligible donor
      const matches = await Promise.all(
        donors.map((donor) =>
          prisma.requestMatch.upsert({
            where: {
              requestId_donorId: {
                requestId: bloodRequest.id,
                donorId: donor.id,
              },
            },
            update: {},
            create: {
              requestId: bloodRequest.id,
              donorId: donor.id,
              status: 'NOTIFIED',
            },
          })
        )
      );

      return res.json({
        requestId: bloodRequest.id,
        bloodGroup: bloodRequest.bloodGroup,
        city: bloodRequest.city,
        totalMatches: donors.length,
        donors,
        matches,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        error: 'Server error',
      });
    }
  }
);
// Get blood requests created by the logged-in hospital
router.get(
  '/',
  requireAuth,
  requireRole('HOSPITAL'),
  async (req, res) => {
    try {
      const hospital = await prisma.hospital.findUnique({
        where: {
          userId: req.user.id,
        },
      });

      if (!hospital) {
        return res.status(404).json({
          error: 'Hospital profile not found',
        });
      }

      const requests = await prisma.bloodRequest.findMany({
        where: {
          hospitalId: hospital.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: {
              matches: true,
            },
          },
        },
      });

      return res.json({
        totalRequests: requests.length,
        requests,
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