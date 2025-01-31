import express, { Request, Response } from 'express';
import Ville from'../models/Ville'
import Evenement from '../models/Evenement';


const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const nouvelEvenement = req.body;
    const ville = await Ville.findByPk(nouvelEvenement.villeId);

    if (!ville) {
      res.status(404).json({ message: 'Ville not found' });
      return;
    }

    const createdEvenement = await Evenement.create(nouvelEvenement);
    res.status(201).json(createdEvenement);
  } catch (error) {
    console.error('Failed to create an event:', error);
    res.status(500).json({ message: 'Failed to create an event' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const evenements = await Evenement.findAll();
    res.json(evenements);
  } catch (error) {
    console.error('Failed to retrieve events:', error);
    res.status(500).json({ message: 'Failed to retrieve events' });
  }
});

router.get('/:eventId', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId;
    const evenement = await Evenement.findByPk(eventId);

    if (!evenement) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.json(evenement);
  } catch (error) {
    console.error('Failed to retrieve the event:', error);
    res.status(500).json({ message: 'Failed to retrieve the event' });
  }
});

// Update an event
router.put('/:eventId', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId;
    const updatedEvent = req.body;
    const [rowsAffected] = await Evenement.update(updatedEvent, {
      where: { id: eventId },
    });

    if (rowsAffected === 0) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Failed to update the event:', error);
    res.status(500).json({ message: 'Failed to update the event' });
  }
});

router.delete('/:eventId', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId;
    const rowsAffected = await Evenement.destroy({ where: { id: eventId } });

    if (rowsAffected === 0) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Failed to delete the event:', error);
    res.status(500).json({ message: 'Failed to delete the event' });
  }
});

export default router;
