export const getImageUrl = (path) => {
  if (!path) return '';
  
  // Fix legacy localhost URLs (any port, http/https)
  if (path.includes('localhost') || path.includes('127.0.0.1')) {
      // Extract the path part after /uploads/
      const parts = path.split('/uploads/');
      if (parts.length > 1) {
          return `https://anonstyle-api.onrender.com/uploads/${parts[1]}`;
      }
  }

  if (path.startsWith('http')) return path;
  
  // Ensure path starts with / if it doesn't
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `https://anonstyle-api.onrender.com${cleanPath}`;
};
