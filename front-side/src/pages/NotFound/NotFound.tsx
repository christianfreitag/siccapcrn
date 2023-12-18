import { Ghost } from "phosphor-react";
import { useContext, useEffect, useState } from "react";

import { UserContext } from "../../hooks/UserContext";


export function NotFound() {
  const { logout } = useContext(UserContext);
  const { isAuth } = useContext(UserContext);

  useEffect(() => {}, [isAuth]);

  return <div className="w-full h-[100vh] flex items-center bg-brand-100 justify-center text-white font-bold text-5xl">
    <Ghost size={"10rem"} weight="fill" color={"white"}/> Pagina não foi encontrada.</div>;
}
