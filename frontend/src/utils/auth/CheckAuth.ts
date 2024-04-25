const checkAuth = async (token: any): Promise<boolean> => {
  if (!token) {
    return false;
  } else {
    try {
      const response = await fetch('http://localhost:3000/verifyAuth', {
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
