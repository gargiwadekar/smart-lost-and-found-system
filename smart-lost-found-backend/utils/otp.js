const otpStore = new Map();

export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const saveOtp = (email, otp) => {
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
};

export const verifyStoredOtp = (email, otp) => {
  const key = email.toLowerCase();
  const record = otpStore.get(key);

  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return false;
  }

  const isValid = record.otp === otp;

  if (isValid) {
    otpStore.delete(key);
  }

  return isValid;
};
