import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_URL = 'http://backend:5005';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { term } = req.query;

  if (!term || typeof term !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid search term' });
  }

  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { term },
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(500).json({
      error: error.response?.data?.message || error.message || 'Internal server error',
    });
  }
}
