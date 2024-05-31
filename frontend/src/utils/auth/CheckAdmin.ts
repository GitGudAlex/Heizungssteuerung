const checkAdmin = async (token: any): Promise<boolean> => {
  if (!token) {
    return false;
  } else {
    try {
      if (import.meta.env.BACKEND_URL === undefined) {
        console.error('BACKEND_URL is not set');
        return false;
      }
      const response = await fetch(`http://${import.meta.env.BACKEND_URL}/user/auth/verifyAdmin`, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      });
      if (!response.ok) {
        console.error(`checkAdmin() failed for ${response.status}, ${response.statusText}`);
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('checkAdmin() failed for error');
      console.error(error);
      return false;
    }
  }
};

export default checkAdmin;
