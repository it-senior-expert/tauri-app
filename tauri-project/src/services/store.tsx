// src/utils/localStorageUtils.ts

export function saveToLocalStorage(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`Data saved to localStorage under the key: ${key}`);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  export function loadFromLocalStorage<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }
  