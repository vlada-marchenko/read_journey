import { http } from "./http";

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthResponse = {
    email: string;
    name: string;
    token: string;
    refreshToken: string;
}

export type User = {
    _id: string;
    name: string;
    email: string;
    token: string;
    refreshToken: string;
}

export type RefreshResponse = {
    token: string;
    refreshToken: string;
}

const ENDPOINTS = {
    register: "/users/signup",
    login: "/users/signin",
    logout: "/users/signout",
    refresh: "/users/current/refresh",
    current: "/users/current"
}

export async function registerUser(payload: RegisterData) {
    const { data } = await http.post<AuthResponse>(ENDPOINTS.register, payload);
    return data
}

export async function loginUser(payload: LoginData) {
    const { data } = await http.post<AuthResponse>(ENDPOINTS.login, payload);
    return data
}

export async function logoutUser() {
    await http.post(ENDPOINTS.logout)
}

export async function getCurrentUser() {
    const { data } = await http.get<User>(ENDPOINTS.current);
    return data
}

export async function refreshToken() {
    const { data } = await http.get<RefreshResponse>(ENDPOINTS.refresh);
    return data
}