import react, { createContext } from "react";

const AuthContext = createContext({ isAuth: false, login: () => {} });

export default AuthContext;
