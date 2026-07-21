import axios from 'axios'
import { getAccesstoken, setAccesstoken } from './UserContext'
// import { useUser } from './UserContext'

export const api = axios.create({
    baseURL: 'http://localhost:5555/api/',
    withCredentials: true
})

api.interceptors.request.use((config) => {
    if (config.url !== 'refreshToken') {
        let token = getAccesstoken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 403 &&
        !originalRequest._retry) {
        originalRequest._retry = true
        try {
            let res = await axios.get('http://localhost:5555/api/auth/refreshtoken', { withCredentials: true });

            const newAccesstoken = res.data.accesstoken
            setAccesstoken(newAccesstoken)
            originalRequest.headers.Authorization = `Bearer ${newAccesstoken}`
            return api(originalRequest)

        } catch (err) {
            // console.log('refresh error')
            setAccesstoken(null)
            window.location.href = '/auth'
            return Promise.reject(err)
        }
    }
    return Promise.reject(error)
})
