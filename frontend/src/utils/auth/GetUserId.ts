const getUserId = async (token: any): Promise<string> => {
    if (!token) {
      return "";
    } else {
      try {
        var tokenFormatted = token;
        if (typeof token !== 'string') {
          tokenFormatted = token.value;
        } 
        const response = await fetch('http://localhost:3000/userId', {
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
  