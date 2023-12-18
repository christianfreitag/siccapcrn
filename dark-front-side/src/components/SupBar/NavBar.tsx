import { Bell, CaretLeft, CaretRight, List, SignOut, X } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataCountContext } from "../../hooks/DataCountContext";
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";
import { UserContext } from "../../hooks/UserContext";
import Logopcrn from '../../assets/Images/pcrn.logo.png'
type sideBarProps = {
  isSubSideBarOpen: boolean;
  setSubSideBarOpen: (v: boolean) => {};
};

export function NavBar({ isSubSideBarOpen, setSubSideBarOpen }: sideBarProps) {
  const location = useLocation();
  const { logout } = useContext(UserContext);
  const { isAuth } = useContext(UserContext);
  const routesWithoutSubSideBar = ["/", "/calendario"];
  const { caseCount, reportCount, departureCount } = useContext(DataCountContext);
  
  const [userName, setUserName] = useState(sessionStorage.getItem("usr_n") != null ? sessionStorage.getItem("usr_n") : "User");
  useEffect(() => {setUserName(userName)}, [caseCount]);

  return (
    <div
      className=" bg-neutral-800
   w-full h-12 flex items-center"
    > 
      <img className="h-10 w-8 ml-2 text-zinc-300 " src={Logopcrn}/>
      <div className={`noselect w-full  flex items-center
           text-zinc-300  pl-4 `}>
      <div
        className={`noselect  font-raleway text-2xl 
        text-zinc-300  pl-4 `}
      >
        SICCA
      </div> {window.innerWidth>=800?<span className="ml-2">- Controle de Casos e Analistas da Policia Civil</span>:null}
      </div>
      <div className={`flex h-full`}>
        <div className="h-full w-full p-3  flex flex-row  justify-end items-center">
          <div>
            <div className="cursor-pointer mr-5">
              {caseCount[2] > 0 ? <div className="h-2 w-2 rounded-full bg-pink-600 absolute "></div> : null}
              <Bell size={"1.3rem"} weight={"light"} />
            </div>
          </div>
          {/*<div className=" h-8 w-8 rounded-full mr-10 bg-neutral-900 cursor-pointer"></div>*/}

          <Popover
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 },
            }}
            dismiss={{ ancestorScroll: true }}
            placement="bottom-end"
          >
            <PopoverHandler>
              <span className=" mr-10 cursor-pointer font-medium">{sessionStorage.getItem("usr_n")?.split(" ")[0]}</span>
            </PopoverHandler>
            <PopoverContent className={`rounded-md h-[3rem] pb-2  w-[8rem] shadow-md p-0 duration-75 ml-2   bg-zinc-600 border-0 `}>
              <div>
                <div 
                onClick={()=>{logout(),sessionStorage.clear()}}
                className="w-full flex h-5 pl-2 pr-4 border-b-[1px] pb-4 pt-4 rounded-t-md items-center hover:bg-neutral-900 cursor-pointer">
                  <span className="flex  items-center justify-center w-full "><SignOut className="mr-2"/> Sair</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
