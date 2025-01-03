// 'use client';
// import React, { createContext, useState, useEffect, ReactNode } from 'react';

// interface AppContextType {
//     storedValue: any | null;
//     setStoredValue: React.Dispatch<React.SetStateAction<string | null>>;
// }

// const AppContext = createContext<AppContextType | undefined>(undefined);

// interface AppProviderProps {
//     children: ReactNode;
// }

// const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
//     const [storedValue, setStoredValue] = useState<any | null>(() => {
//         try {
//             const storedData = localStorage.getItem('AdminloginData');
//             if (storedData) {
//                 const parsedData = JSON.parse(storedData);


//                 const expirationTime = parsedData?.expirationTime;
//                 if (expirationTime && Date.now() > expirationTime) {
//                     localStorage.removeItem('AdminloginData');
//                     return null;
//                 }

//                 return parsedData;
//             }
//             return null;
//         } catch (error) {
//             console.log('Failed to parse localStorage data:', error);
//             return null;
//         }
//     });

//     useEffect(() => {
//         if (storedValue !== null) {
//             // const expirationTime = Date.now() + 86400000; 
//             // const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
//             const expirationTime = new Date().getTime() + 2 * 60 * 1000;

//             const dataWithExpiration = { ...storedValue, expirationTime };

//             localStorage.setItem('AdminloginData', JSON.stringify(dataWithExpiration));
//         }
//     }, [storedValue]);

//     return (
//         <AppContext.Provider value={{ storedValue, setStoredValue }}>
//             {children}
//         </AppContext.Provider>
//     );
// };

// export { AppContext, AppProvider };



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
    const [storedValue, setStoredValue] = useState<any | null>(() => {
        try {
            const storedData = localStorage.getItem('AdminloginData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                const expirationTime = parsedData?.expirationTime;

                if (expirationTime && Date.now() > expirationTime) {
                    localStorage.removeItem('AdminloginData');
                    return null;
                }

                return parsedData;  
            }
            return null; 
        } catch (error) {
            console.log('Failed to parse localStorage data:', error);
            return null;
        }
    });

    useEffect(() => {
        if (storedValue && !storedValue.expirationTime) {
            const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 2 minutes for demo
            const dataWithExpiration = { ...storedValue, expirationTime };

            localStorage.setItem('AdminloginData', JSON.stringify(dataWithExpiration));
        }
    }, [storedValue]);

    return (
        <AppContext.Provider value={{ storedValue, setStoredValue }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
