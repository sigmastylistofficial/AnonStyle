export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.includes('localhost:4000')) {
      return path.replace('http://localhost:4000', 'https://anonstyle-api.onrender.com');
  }
  if (path.startsWith('http')) return path;
  return `https://anonstyle-api.onrender.com${path}`;
};
