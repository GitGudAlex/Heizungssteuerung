import { writable } from 'svelte/store'

export const addFontSize = writable(0);
  /**
   * 
   * @param userId Current User
   * @returns font size as pixel value
   */
  export async function getFontSize(userId: string, backendUrl: string): Promise<number> {
    const response = await fetch(`${backendUrl}/user/${userId}`, {
      method: 'GET',
    })
    let userTextSetting; 
    if (!response.ok) {
      throw new Error('Failed to load settings')
    } else {
      const settings = await response.json()
      userTextSetting = convertSizeToNumber(settings.fontSize)
      console.log('User font size setting from db:', userTextSetting)
    }
    return userTextSetting
  }

  /**
   * 
   * @param size font size as text e.g. 'small'
   * @returns mapped value of size
   */
  function convertSizeToNumber(size: string): number  {
    const sizeMap: { [key: string]: number } = {
      small: -3,
      medium: 0,
      large: 3,
      xlarge: 6
    };
    return sizeMap[size.toLowerCase()];
  }