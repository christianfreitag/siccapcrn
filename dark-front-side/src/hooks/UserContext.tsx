/* eslint-disable */
import { User } from "phosphor-react";
import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";
interface userAuthProps {
  children: ReactNode;
}

const initialStateAuth = {
  isAuth: 0, //initial state / 200 - Authenticated / 401- not Authenticated
  setAuth: () => { },
  checkUserAuth: () => { },
  logout: () => { },
};

type userAuthType = {
  isAuth: number;
  setAuth: (newStateAuth: number) => void;
  checkUserAuth: () => void;
  logout: () => void;
};

export const UserContext = createContext<userAuthType>(initialStateAuth);

export const UserContextProvider = ({ children }: userAuthProps) => {
  const [isAuth, setAuth] = useState(initialStateAuth.isAuth);
  const checkUserAuth = async () => {

    try {
      await api
        .get("auth", { withCredentials: true })
        .then((res) => {
          setAuth(res.data.status);
          console.log(res.data)
          sessionStorage.setItem("usr_n", res.data.data.name)
          //sessionStorage.setItem('usr_n', res.data.user.name)
        })
        .catch((e) => {


          setAuth(500);


        });

    } catch (e) {

      setAuth(500)
    }
  };

  const logout = () => {
    api
      .get("auth/logout", { withCredentials: true })
      .then((res) => {
        setAuth(401);
      })
      .catch((e) => {
        setAuth(401);
      });
  };
  return (
    <UserContext.Provider value={{ isAuth, setAuth, checkUserAuth, logout }}>
      {children}
    </UserContext.Provider>
  );
};
