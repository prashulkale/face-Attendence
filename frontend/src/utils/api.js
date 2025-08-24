import axios from 'axios';

// Set base URL
const api = axios.create({
  baseURL:  process.env.BACKEND_URL || 'https://demoatt.vercel.app' // Replace with your actual base URL
});  


export default api