import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://it-service-desk1-2.onrender.com'
})