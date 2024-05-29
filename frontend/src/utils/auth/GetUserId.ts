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
        const response = await fetch(`http://${import.meta.env.BACKEND_URL}/verifyAdmin`, {
          headers: {
            'Authorization': `Bearer ${tokenFormatted}`
          }
        });
        if (!response.ok) {
          console.error('Authentication failed:', response.statusText);
            return "";
        } else {
            // get userId from response
            const res = await response.json();
            return res.userId;
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        return "";
      }
    }
  };
  
  export default getUserId;
  