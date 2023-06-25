import { useContext } from 'react';
import { AuthContext, AuthContextValue } from './AuthContext';

export default function useAuth() {
    return useContext(AuthContext) as AuthContextValue;
}
