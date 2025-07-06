import { vadooAPI } from '../../lib/vadoo';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const credits = await vadooAPI.getUserCredits();
    res.status(200).json(credits);
  } catch (error) {
    console.error('Error fetching user credits:', error);
    res.status(500).json({ error: 'Failed to fetch user credits' });
  }
}
