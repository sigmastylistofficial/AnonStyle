export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://anonstyle-api.onrender.com${path}`;
};
