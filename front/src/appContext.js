import { createContext } from 'react';

export const defaultGlobalState = {
    ui: {
        loading: false,
        loaded: false,
        status: '',
        message: '',
    },
    login: false,
}

const AppContext = createContext(defaultGlobalState);

export default AppContext;

