export function isvalidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function isValidPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)[\w!@#$%^&*()-_=+]{8,}$/.test(password);
}
