import axios from 'axios'

const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '')
const AUTH_BASE_URL = API_URL ? `${API_URL}/api/auth` : '/api/auth'

const authClient = axios.create({
    baseURL: AUTH_BASE_URL,
    withCredentials: true
})

authClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken')
    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

function storeAuthToken(token) {
    if (token) {
        localStorage.setItem('authToken', token)
    }
}

function clearAuthToken() {
    localStorage.removeItem('authToken')
}

export async function register({ username, email, password }) {
    try {
        const response = await authClient.post('register', { username, email, password })
        storeAuthToken(response.data?.token)
        return response.data
    } catch (_) {
        return null
    }
}

export async function login({ email, password }) {
    try {
        const response = await authClient.post('login', { email, password })
        storeAuthToken(response.data?.token)
        return response.data
    } catch (_) {
        return null
    }
}

export async function logout() {
    try {
        const response = await authClient.get('logout')
        clearAuthToken()
        return response.data
    } catch (_) {
        clearAuthToken()
    }
}

export async function getMe() {
    try {
        const response = await authClient.get('getMe')
        return response.data
    } catch (_) {
        return null
    }
}
