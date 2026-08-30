const TOKEN_KEY = "kellos_admin_token";
const API_KEY = "kellos_admin_api";

export const DEFAULT_API_URL = "http://127.0.0.1:8787";

export function loadToken(): string {
  return sessionStorage.getItem(TOKEN_KEY) ?? "";
}

export function saveToken(token: string): void {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

export function loadApiUrl(): string {
  return sessionStorage.getItem(API_KEY) || DEFAULT_API_URL;
}

export function saveApiUrl(url: string): void {
  sessionStorage.setItem(API_KEY, url.replace(/\/$/, ""));
}
