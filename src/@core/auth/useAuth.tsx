import { useContext } from 'react';
import { AuthContext, AuthContextValue } from './Auth';

export default function useAuth() {
    return useContext(AuthContext) as AuthContextValue;
}
