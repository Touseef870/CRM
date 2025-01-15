


'use client';
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AppContextType {
    storedValue: any | null;
    setStoredValue: React.Dispatch<React.SetStateAction<any | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [storedValue, setStoredValue] = useState<any | null>(null); 

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const storedData = localStorage.getItem('AdminloginData');
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    const expirationTime = parsedData?.expirationTime;

                    if (expirationTime && Date.now() > expirationTime) {
                        localStorage.removeItem('AdminloginData');
                        setStoredValue(null);
                    } else {
                        setStoredValue(parsedData);
                    }
                }
            } catch (error) {
                console.log('Failed to parse localStorage data:', error);
            }
        }
    }, []); 

    useEffect(() => {
        if (storedValue && !storedValue.expirationTime) {
            const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; 
            const dataWithExpiration = { ...storedValue, expirationTime };

            if (typeof window !== 'undefined') {
                localStorage.setItem('AdminloginData', JSON.stringify(dataWithExpiration));
            }
        }
    }, [storedValue]);

    return (
        <AppContext.Provider value={{ storedValue, setStoredValue }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
