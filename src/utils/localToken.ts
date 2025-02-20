const LOCAL_STORAGE_TOKEN_KEY = "token";
const LOCAL_STORAGE_REFRESH_TOKEN_KEY = "refresh_token";

export function hasLocalToken(): boolean {
  return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) !== null;
}

export function getLocalToken(): string {
  try {
    const localStorageToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (localStorageToken === null) {
      throw new Error(`The token is not found`);
    }
    const parsedToken = JSON.parse(localStorageToken) as string;

    return parsedToken;
  } catch (err) {
    throw err;
  }
}

export function setLocalToken(jwtToken: string) {
  console.debug(`localToken: set:: ${jwtToken}`);
  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, JSON.stringify(jwtToken));
}

export function clearLocalToken() {
  console.debug(`localToken: empty`);
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
}

export function setRefreshToken(jwtRefreshToken: string) {
  console.debug(`refreshToken: ${jwtRefreshToken}`);
  localStorage.setItem(
    LOCAL_STORAGE_REFRESH_TOKEN_KEY,
    JSON.stringify(jwtRefreshToken)
  );
}

export function getRefreshToken() {
  const storedRefreshToken = localStorage.getItem(
    LOCAL_STORAGE_REFRESH_TOKEN_KEY
  );
  if (storedRefreshToken === null) {
    throw new Error(`The refresh token is not found.`);
  }
  const parsedToken = JSON.parse(storedRefreshToken) as string;
  return parsedToken;
}

export function hasRefreshToken() {
  return localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY) !== null;
}

export function clearRefreshToken() {
  return localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
}
