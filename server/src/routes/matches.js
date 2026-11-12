import express from 'express';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Submit donor eligibility checklist and record the decision
router.post('/:id/checklist', requireAuth, requireRole('DONOR'), async (req, res) => {
  const matchId = Number(req.params.id);
  const {
    alcoholLast24Hours,
    recentIllness,
    recentTattooOrPiercing,
    donatedRecently,
  } = req.body;

  if (!Number.isInteger(matchId) || matchId <= 0) {
    return res.status(400).json({ error: 'Invalid match ID' });
  }

  const answers = [
    alcoholLast24Hours,
    recentIllness,
    recentTattooOrPiercing,
    donatedRecently,
  ];

  if (answers.some(answer => typeof answer !== 'boolean')) {
    return res.status(400).json({
      error: 'Answer every checklist question with true or false',
    });
  }

  try {
    const donor = await prisma.donor.findUnique({
      where: { userId: req.user.id },
    });

    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

    const match = await prisma.requestMatch.findFirst({
      where: {
        id: matchId,
        donorId: donor.id,
      },
    });

    if (!match) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (match.status !== 'NOTIFIED') {
      return res.status(409).json({
        error: 'This notification has already been processed',
      });
    }

    const hasRiskFlag = answers.some(answer => answer === true);
    const status = hasRiskFlag ? 'INELIGIBLE' : 'ACCEPTED';

    await prisma.requestMatch.update({
      where: { id: match.id },
      data: { status },
    });

    if (hasRiskFlag) {
      return res.json({
        status,
        message: 'Your responses indicate that you should not proceed with this request. Please consult an authorized blood bank or healthcare professional.',
      });
    }

    res.json({
      status,
      message: 'Your response has been recorded. The hospital can now view your contact details.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
