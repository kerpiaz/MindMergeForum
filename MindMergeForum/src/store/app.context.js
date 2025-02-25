import { createContext } from "react";

/**
 * Application context for global state management
 * 
 * Provides authentication state and user data throughout the application
 * 
 * @type {React.Context}
 */
export const AppContext = createContext({
    user: null,
    userData: {
        firstName: '',
        lastName: '',
        role: '',
      },
    setAppState: ()=>{},
});