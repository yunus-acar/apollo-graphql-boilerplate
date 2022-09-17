export const createRandomChar = () => {
  const chars = "ABCDEFGHJKLMNPRSTVYZ";
  return chars[Math.floor(Math.random() * chars.length)];
};
