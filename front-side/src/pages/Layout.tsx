import { ReactNode, useContext, useEffect, useState, createContext } from "react";
import { Navigate, Outlet, Route, useNavigate } from "react-router-dom";
import { NavBar } from "../components/SupBar/NavBar";
import { SideBar } from "../components/SideBar/SideBar";



import { DataCountContext } from "../hooks/DataCountContext";
import { UserContext } from "../hooks/UserContext";
export const LayoutContext = createContext({ setButtonSelected:(v:number)=>{} });
export function Layout() {
  const { resetCaseCount, resetReportCount, resetAnalystCount, resetRequestCount, resetDepartureCount } = useContext(DataCountContext);
  const { isAuth } = useContext(UserContext);
  const [isSubSideBarOpen, setSubSideBarOpen] = useState(sessionStorage.getItem("hasSubSideBar") != null ? (sessionStorage.getItem("hasSubSideBar") == "false" ? false : true) : false);
  const navigate = useNavigate()
  const [buttonSelected, setButtonSelected] = useState(
    parseInt(
      //@ts-ignore
      sessionStorage.getItem("sidebarMenuOpenIndex") != null ? sessionStorage.getItem("sidebarMenuOpenIndex") : 0
    )
  );

  useEffect(() => {
    function checkUserData() {
      const item = sessionStorage.getItem("sidebarMenuOpenIndex");
      if (item) {
        setButtonSelected(parseInt(item));
      }
    }

    window.addEventListener("storage", checkUserData);

    return () => {
      window.removeEventListener("storage", checkUserData);
    };
  }, [sessionStorage, buttonSelected]);

  useEffect(() => {
    resetCaseCount(), resetReportCount(), resetAnalystCount(), resetRequestCount(), resetDepartureCount();
    
  }, [isAuth]);
  
  return isAuth?(
<div className="">
    <div className="flex overflow-hidden">
      {/*@ts-ignore */}
      <SideBar isSubSideBarOpen={isSubSideBarOpen} setSubSideBarOpen={setSubSideBarOpen} setButtonSelected={setButtonSelected} buttonSelected={buttonSelected} />
      <div className="flex-row w-screen h-screen  overflow-hidden">
        {/*@ts-ignore */}
        <NavBar isSubSideBarOpen={isSubSideBarOpen} setSubSideBarOpen={setSubSideBarOpen} />
        <div className="bg-zinc-900 h-[calc(100vh-3rem)] w-full p-6 overflow-hidden dark">
          <LayoutContext.Provider  value={{ setButtonSelected:setButtonSelected }}>
            <Outlet />
          </LayoutContext.Provider>
        </div>
      </div>
    </div>
  </div>
  ):null
}
