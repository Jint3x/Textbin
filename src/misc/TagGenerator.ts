export default function generateID(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789";
  const code = [];

  for (let i = 0; i < 8; i++) {
    code.push(chars[Math.floor(Math.random() * chars.length)]);
  }

  return code.join("");
}
