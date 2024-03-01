import crypto from "crypto";

export const generateUniqueCode = (inputString: string) => {
  // Create a hash of the input string using SHA-256
  const hash = crypto.createHash("sha256").update(inputString).digest("hex");

  // Truncate the hash to 8 characters
  const uniqueCode = hash.substring(0, 8);

  return uniqueCode;
};
