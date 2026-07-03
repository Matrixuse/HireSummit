import axios from 'axios'

const authClient = axios.create({
    baseURL: '/api/auth/',
    withCredentials: true
})

export async function register({ username, email, password }) {
    try {
        const response = await authClient.post('register', { username, email, password })
        return response.data
    } catch (_) {
        return null
    }
}

export async function login({ email, password }) {
    try {
        const response = await authClient.post('login', { email, password })
        return response.data
    } catch (_) {
        return null
    }
}

export async function logout() {
    try {
        const response = await authClient.get('logout')
        return response.data
    } catch (_) {
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