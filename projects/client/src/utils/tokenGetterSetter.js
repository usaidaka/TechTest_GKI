export function setLocalStorage(access_token) {
  return localStorage.setItem("access_token", access_token);
}

export function getLocalStorage(name) {
  return localStorage.getItem(name);
}

export function removeLocalStorage(name) {
  return localStorage.removeItem(name);
}

export function logout() {
  return localStorage.removeItem("access_token");
}
