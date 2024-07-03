import config from "../config";

const checkAdmin = async (token: any): Promise<boolean> => {
  if (!token) {
    return false;
  } else {
    try {
      const response = await fetch(`${config.BACKEND_URL_SERVER}/user/auth/verifyAdmin`, {
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
      console.error(`checkAdmin() failed for error [URL: ${config.BACKEND_URL_SERVER}, TOKEN: ${token}]:\n` + error);
      return false;
    }
  }
};

export default checkAdmin;
