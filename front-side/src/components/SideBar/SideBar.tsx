import { Detective, List } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { SideBarMenu } from "./SubSideBar.constants";
import { SubSideBar } from "./SubSideBar";

import { DataCountContext } from "../../hooks/DataCountContext";
import { useNavigate, } from "react-router-dom";
import LogoImg from '../../assets/Images/logo_icon_white.png'
type sideBarProps = {
  isSubSideBarOpen: boolean
  setSubSideBarOpen: (v: boolean) => {}
  setButtonSelected:(v:number)=>{}
  buttonSelected:number
}

export function SideBar({setButtonSelected,buttonSelected, isSubSideBarOpen, setSubSideBarOpen }: sideBarProps) {

  
  const navigate = useNavigate();
  const { caseCount, departureCount } = useContext(DataCountContext);


  useEffect(() => {
    setButtonSelected(
      parseInt(
        //@ts-ignore
        sessionStorage.getItem("sidebarMenuOpenIndex") != null
          ? sessionStorage.getItem("sidebarMenuOpenIndex")
          : 0
      )
    )
   }, []);

  return (
    <div className="flex ">
      <div className="flex-col bg-black w-16 h-screen  m-0">
       <div className=" w-full h-[3rem] flex items-center justify-center">
       <img src={LogoImg} className={`h-8 w-8`}/>
       </div>

        <ul className="pt-10">
          {SideBarMenu.map((value, index) => {
            return (
              <li
                className={`flex group h-[12vh] items-center justify-center  cursor-pointer  border-l-2 border-transparent hover:border-white mb-[2vh]
                w-full transition-all duration-150`}
                key={index}
                onClick={(evt) => {
                  setButtonSelected(index);
                  sessionStorage.setItem("sidebarMenuOpenIndex",String(index))
                  /* sessionStorage.setItem(
                    "sidebarMenuOpenIndex",
                    index.toString()
                  ); */
                  /* sessionStorage.setItem(
                    "hasSubSideBar",
                    value.subSideBarMenu ? "true" : "false"
                  ); */
                  if (evt.ctrlKey) {
                    alert("Ctrl")
                  }
                  navigate(value.path, {
                    replace: true,
                    state: { status: value.props.status },
                  });
                  /* if (value.subSideBarMenu != null) {
                    setSubSideBarOpen(true);
                  } else {
                    setSubSideBarOpen(false);

                    navigate(value.path, {
                      replace: true,
                      state: { status: value.props.status },
                    });
                  } */
                }}
              >
                {
                  <div className="relative ">
                    {(caseCount[2] > 0 && index == 1) || (departureCount[0] > 0 && index == 5) ? 
                    <div className="absolute h-[0.80rem] w-[0.80rem] bg-notify-500 rounded-full top-2 -right-2 text-[0.6rem] flex items-center justify-center text-white">{
                      index == 1 ? (caseCount[2] < 10 ? caseCount[2] : null) :
                        index == 5 ? (departureCount[2] < 10 ? departureCount[0] : null) : null}</div> : null}
                    <value.icon
                      size={20}
                      weight={"regular"}
                      className={
                        `${buttonSelected != index
                          ? `text-smoke-500  transition-all duration-200`
                          : "transition-all duration-200 text-brand-100 mt-3 bg-smoke-500 bg- p-1.5 w-8 h-8 rounded-md "}`
                      }
                    /><span className="flex items-center justify-center transition-all duration-150 bg-brand-100 w-[0px] group-hover:p-2 group-hover:left-16 group-hover:h-8 group-hover:w-[8rem] h-0 p-0 overflow-hidden rounded-full  bottom-0  left-0 z-40 absolute text-sm font-medium text-white">{value.title}</span></div>

                }
              </li>
            );
          })}
        </ul>
      </div>

      {/* <SubSideBar
        sideBarIndex={buttonSelected}
        isSubSideBarOpen={isSubSideBarOpen}

      /> */}

    </div>
  );
}
