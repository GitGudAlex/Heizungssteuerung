const checkAuth = async (token: any): Promise<boolean> => {
  if (!token) {
    return false;
  } else {
    try {
      if (import.meta.env.BACKEND_URL === undefined) {
        console.error('BACKEND_URL is not set');
        return false;
      }
      const response = await fetch(`http://${import.meta.env.BACKEND_URL}/verifyAuth`, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      });
      if (!response.ok) {
        console.error('Authentication failed:', response.statusText);
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }
};

export default checkAuth;
