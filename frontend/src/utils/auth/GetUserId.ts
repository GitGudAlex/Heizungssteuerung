const getUserId = async (token: any): Promise<string> => {
    if (!token) {
      return "";
    } else {
      try {
        var tokenFormatted = token;
        if (typeof token !== 'string') {
          tokenFormatted = token.value;
        } 
        if (import.meta.env.BACKEND_URL === undefined) {
          console.error('BACKEND_URL is not set');
          return "";
        }
        const response = await fetch(`http://${import.meta.env.BACKEND_URL}/user/auth/userId`, {
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
        console.error('getUserId() failed for error');
        console.error(error);
        return "";
      }
    }
  };
  
  export default getUserId;
  