import config from "../config";

const checkAuth = async (token: any): Promise<boolean> => {
  if (!token) {
    return false;
  } else {
    try {
      const response = await fetch(`${config.BACKEND_URL_SERVER}/user/auth/verifyAuth`, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      });
      if (!response.ok) {
        console.error(`checkAuth() failed for ${response.status}, ${response.statusText}`);
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(`checkAuth() failed for error [URL: ${config.BACKEND_URL_SERVER}, TOKEN: ${token}]:\n` + error);
      return false;
    }
  }
};

export default checkAuth;
