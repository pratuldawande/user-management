/**
 * Basic rule set used by the AddUserScreen.
 * each function returns an error message when the value is invalid,
 * otherwise it returns null.
 */

const nameRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }
  if (!nameRegex.test(name)) {
    return 'Name can only contain letters and spaces.';
  }
  if (name.length > 50) {
    return 'Name must not exceed 50 characters.';
  }
  return null;
}

export const validateEmail = (email: string): string | null => {
   if (!email.trim()) {
    return null;
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }
  return null;
}
