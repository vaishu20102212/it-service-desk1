import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://it-service-desk1-3.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})