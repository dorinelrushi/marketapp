"use client";

export const AUTH_EVENT_NAME = "booknest_auth_change";

export function getAuthToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("booknest_token");
}

export function setAuthToken(token: string, user: unknown) {
    if (typeof window === "undefined") return;
    localStorage.setItem("booknest_token", token);
    localStorage.setItem("booknest_user", JSON.stringify(user));
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
}

export function clearAuthToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("booknest_token");
    localStorage.removeItem("booknest_user");
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
}
