import { vadooAPI } from '../../lib/vadoo';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  try {
    const status = await vadooAPI.getGenerationStatus(id);
    res.status(200).json(status);
  } catch (error) {
    console.error('Error fetching video status:', error);
    res.status(500).json({ error: 'Failed to fetch video status' });
  }
}
