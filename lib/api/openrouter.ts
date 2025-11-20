import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

export const openRouterClient = axios.create({
  baseURL: OPENROUTER_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
});
