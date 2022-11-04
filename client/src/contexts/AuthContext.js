import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ defaultValue = false, children }) {
  const [Auth, setAuth] = useState(defaultValue);

  return (
    <AuthContext.Provider value={{ Auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("반드시 AuthProvider 안에서 사용해야 합니다");

  const { Auth } = context;
  return Auth;
}

export function useSetAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("반드시 AuthProvider 안에서 사용해야 합니다");

  const { setAuth } = context;
  return setAuth;
}
