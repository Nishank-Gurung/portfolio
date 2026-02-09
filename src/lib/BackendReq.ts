
import axios from 'axios'


const APIRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
})

// Handle response
APIRequest.interceptors.response.use(
  (response) => {
    const {success} = response.data

    // If the response format is successful but success is false
    if (success === false) {
      return Promise.reject(response.data)
    }

    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default APIRequest
