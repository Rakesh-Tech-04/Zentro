import axios from 'axios'
// import { useUser } from './UserContext'

export const api = axios.create({
    baseURL: 'http://localhost:5555/api/',
    withCredentials: true
})

api.interceptors.request.use((config) => {
    let accesstoken = localStorage.getItem('accesstoken')
    if (accesstoken) {
        config.headers.Authorization = `Bearer ${accesstoken}`
    }
    return config
})

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 &&
        !originalRequest._retry && originalRequest.url !== 'auth/refreshtoken') {
        originalRequest._retry = true
        try {
            let res = await axios.get('http://localhost:5555/api/auth/refreshtoken', { withCredentials: true });

            const newAccesstoken = res.data.accesstoken

            localStorage.setItem('accesstoken', newAccesstoken)

            originalRequest.headers.Authorization = `Bearer ${newAccesstoken}`
            return api(originalRequest)

        } catch (err) {
            // console.log('refresh error')
            localStorage.removeItem('accesstoken')
            window.location.href = '/auth'
            return Promise.reject(err)
        }
    }
    return Promise.reject(error)
})
