import { Plus, } from "phosphor-react";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SideBarMenu } from "./SubSideBar.constants";
import { CaretRight } from "phosphor-react";
import { DataCountContext } from "../../hooks/DataCountContext";



import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";
import { Button } from "../Button";


//INTERFACE TO RECEIVE PROPS
interface SubSideBarProps {
  isSubSideBarOpen: boolean;
  sideBarIndex: number;
}
//SUBSIDEBAR FUNCTION
export function SubSideBar({
  isSubSideBarOpen,
  sideBarIndex,
}: SubSideBarProps) {
  //SETUP VARIABLES
  const [isCaseItensOpen, setCaseItensOpen] = useState(1);
  const [isReportItensOpen, setReportItensOpen] = useState(1);
  const [isRequestItensOpen, setRequestItensOpen] = useState(1);
  const [isAnalystItensOpen, setAnalystItensOpen] = useState(1);
  const [isDepartureItensOpen, setDepartureItensOpen] = useState(1);

  const [itemListOpen, setItemListOpen] = useState(0)

  const [subSideBarMenuSelected, setsubSideBarMenuSelected] = useState([0, 0]);
  const navigate = useNavigate();
  const { caseCount, reportCount, analystCount, requestCount, departureCount } =
    useContext(DataCountContext);

  const caseCounting = [caseCount, reportCount, [requestCount]];
  const analystCounting = [analystCount, departureCount];
  const counting = [caseCounting, analystCounting];

  useEffect(() => {
    setsubSideBarMenuSelected([0, sideBarIndex == 1 ? 4 : 3]);
  }, [isSubSideBarOpen, sideBarIndex]);


  //APAGAR DEPOIS
  function handleSubMenuState(
    parentIndex: number,
    index: number,
    op: number
  ): number {
    if (parentIndex == 0) {
      switch (index) {
        case 0:
          if (op == 1) {
            sessionStorage.setItem("$00MS00op", "" + isCaseItensOpen + "");
            setCaseItensOpen(isCaseItensOpen > 0 ? 0 : 1);
          }
          return isCaseItensOpen;
        case 1:
          if (op == 1) {
            sessionStorage.setItem("$00MS01op", "" + isReportItensOpen + "");
            setReportItensOpen(isReportItensOpen > 0 ? 0 : 1);
          }
          return isReportItensOpen;
        case 2:
          if (op == 1) {
            sessionStorage.setItem("$00MS02op", "" + isRequestItensOpen + "");
            setRequestItensOpen(isRequestItensOpen > 0 ? 0 : 1);
          }
          return isRequestItensOpen;
      }
    } else if (parentIndex == 1) {
      switch (index) {
        case 0:
          if (op == 1) {
            sessionStorage.setItem("$01MS00op", "" + isAnalystItensOpen + "");
            setAnalystItensOpen(isAnalystItensOpen > 0 ? 0 : 1);
          }
          return isAnalystItensOpen;
        case 1:
          if (op == 1) {
            sessionStorage.setItem("$01MS01op", "" + isDepartureItensOpen + "");
            setDepartureItensOpen(isDepartureItensOpen > 0 ? 0 : 1);
          }
          return isDepartureItensOpen;
      }
    }
    return 0;
  }

  return (
    <div
      className={`flex-row bg-zinc-800 overflow-hidden ${isSubSideBarOpen ? "w-60" : "w-0 p-0"
        } h-screen transition-all duration-300 shadow-md z-10`}
    >
      <div className="flex-row  w-full h-[90vh]">
        <div className={`flex items-center  pr-2`}><div
          className={`noselect w-full  font-bubblebody text-4xl p-4
           text-zinc-400 font-extrabold transition-all duration-500 ${isSubSideBarOpen ? "pl-10" : "pl-4"}`}>delac</div>

        </div>

        {<div className={`flex  h-[12%] w-[100%] items-end`}>
          <Popover placement="left-start" >
            <PopoverHandler>
              <div className={`flex items-center hover:bg-brand2-100 w-full cursor-pointer p-2 text-zinc-400`}><div className={`rounded-full h-6 w-6 bg-brand-100 ml-3 flex items-center justify-center mr-2 `}><Plus color={"white"} /></div> Novo</div>
            </PopoverHandler>
            <PopoverContent className={`rounded-md h-fit z-50  w-[10rem] shadow-md pt-2 duration-[0] ml-2  pl-2 pr-2  bg-zinc-600 border-0`}>
              <div className=" h-3 w-3 rotate-45 translate-x-[-120%] translate-y-[50%] bg-zinc-800 top-2 border-l-[1px] border-b-[1px] absolute z-auto "></div>

              {//@ts-ignore
                SideBarMenu[sideBarIndex].subSideBarMenu != null ? SideBarMenu[sideBarIndex].subSideBarMenu.map((value, index) => {
                  return < div key={index} className={`h-10 w-full  flex items-center cursor-pointer pl-6 rounded-sm hover:bg-brand2-100`} onClick={() => {
                    navigate(value.path + "=novo");
                  }}>{value.title}</div>
                }) : null}

            </PopoverContent>
          </Popover>

        </div>}

        {/* SUBMENU LIST ITENS */}
        <div className="flex-row  w-full h-[100%] mt-10 ">
          {/*LISTING ITENS AND SUBITENS FROM MENU*/}
          <ul>{SideBarMenu[sideBarIndex].subSideBarMenu != null ? /*@ts-ignore*/
            SideBarMenu[sideBarIndex].subSideBarMenu.map((value, index) => {
              return (
                <li key={index} className={`pt-[3%] `}>
                  <div onClick={() => { setItemListOpen(index != itemListOpen ? index : -1) }}
                    className={`noselect font-medium text-base pl-5 cursor-pointer flex justify-between pr-5 text-zinc-400`}>
                    {value.title}
                    <CaretRight className={`transition-all duration-200 ${itemListOpen != index ? "" : "rotate-90"}`} />
                  </div>
                  {/*CHECKING IF ITS OPEN */}


                  <ul className={`${itemListOpen == index ? "md:h-[10.5rem] lg:h-[12rem]" : "h-0"} overflow-hidden transition-all duration-300 text-lightBlack-100`}>
                    {/*@ts-ignore*/
                      value.subItens.map((sValues, subIndex) => {
                        return <li key={subIndex} onClick={() => {
                          setsubSideBarMenuSelected([index, subIndex,]);
                          navigate(sValues.path+"?status="+(sValues.props
                          ? sValues.props.status
                          : 0), {
                            replace: true,
                            
                          });
                        }}
                          className={`noselect items-baseline flex justify-between  text-base pl-10 cursor-pointer transition-all md:pt-[2%] lg:pb-[2%] lg:pt-[3%] w-full hover:bg-brand2-100 ${subSideBarMenuSelected[0] == index &&
                            subSideBarMenuSelected[1] == subIndex
                            ? "font-semibold duration-75 text-zinc-400 bg-slate-100"
                            : "font-normal duration-150"

                            } pl-[1.5rem] 
                                  `}
                        >
                          <div className="flex">
                            {sValues.icon != null ? (
                              <sValues.icon
                                weight="thin"
                                className="mr-2 "
                              />
                            ) : null}
                            {sValues.title}
                          </div>
                          {sideBarIndex > 0 &&
                            sideBarIndex < 3 &&
                            counting[sideBarIndex - 1][index][
                            subIndex
                            ] ? (
                            <span
                              className={` ml-2 font-normal  mr-10 text-sm ${sValues.title == "Expirados" ||
                                sValues.title == "Sem validação"
                                ? "bg-gradient-to-tr from-red-300 to-pink-300  text-smoke-500"
                                : ""
                                }  rounded-lg w-fit h-fit pl-2 pr-2 bg-slate-50 `}
                            >
                              {
                                counting[sideBarIndex - 1][index][subIndex] > 1000 ?
                                  counting[sideBarIndex - 1][index][subIndex] > 1000000000 ?
                                    Math.floor(counting[sideBarIndex - 1][index][subIndex] / 1000000000) + "M" :
                                    Math.floor(counting[sideBarIndex - 1][index][subIndex] / 1000) + "k" :
                                  counting[sideBarIndex - 1][index][subIndex]
                              }
                            </span>
                          ) : null}
                        </li>
                          ;
                      })
                    }
                  </ul>

                </li>
              );
            })
            : null}
          </ul>
        </div>
      </div>
    </div >
  );
}
