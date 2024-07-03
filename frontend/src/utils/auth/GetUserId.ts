import config from "../config";

const getUserId = async (token: any): Promise<string> => {
    if (!token) {
      return "";
    } else {
      try {
        var tokenFormatted = token;
        if (typeof token !== 'string') {
          tokenFormatted = token.value;
        } 
        const response = await fetch(`${config.BACKEND_URL_SERVER}/user/auth/userId`, {
          headers: {
            'Authorization': `Bearer ${tokenFormatted}`
          }
        });
        if (!response.ok) {
          console.error(`getUserId() failed for ${response.status}, ${response.statusText}`);
            return "";
        } else {
            // get userId from response
            const res = await response.json();
            return res.userId;
        }
      } catch (error) {
        console.error(`getUserId() failed for error [URL: ${config.BACKEND_URL_SERVER}, TOKEN: ${token}]:\n` + error);
        return "";
      }
    }
  };
  
  export default getUserId;
  