export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export const getImageUrl = (url) => (url[0] === '/' ? `${API_URL}${url}` : url);
