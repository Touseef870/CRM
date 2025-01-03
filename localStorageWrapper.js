const isBrowser = () => typeof window !== "undefined";

export const localStorageWrapper = {
  getItem: (key) => {
    if (!isBrowser()) return null; // Ensure it's running in the browser
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  },
  setItem: (key, value) => {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting localStorage item:", error);
    }
  },
  removeItem: (key) => {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing localStorage item:", error);
    }
  },
};
