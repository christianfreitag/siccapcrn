import {
  AirplaneInFlight,
  Bag,
  CalendarCheck,
  CheckCircle,
  CheckSquare,
  CircleDashed,
  Clock,
  ClockClockwise,
  ClockCounterClockwise,
  Coffee,
  FileSearch,
  FolderOpen,
  Smiley,
  SmileyBlank,
  SmileySad,
  SmileySticker,
  SmileyWink,
  Suitcase,
  Sun,
  Timer,
  Warning,
  WarningCircle,
  WarningOctagon,
} from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLinkClickHandler, useNavigate } from "react-router-dom";
import { DataCountContext } from "../../hooks/DataCountContext";

import { UserContext } from "../../hooks/UserContext";
import { LayoutContext } from "../Layout";

export function Dashboard() {
  const { logout } = useContext(UserContext);
  const { caseCount, reportCount, analystCount, requestCount, departureCount } = useContext(DataCountContext);
  const propsLayout = useContext(LayoutContext);
  const { isAuth } = useContext(UserContext);
  const [userName, setUserName] = useState(sessionStorage.getItem("usr_n") != null ? sessionStorage.getItem("usr_n") : "User");
  //Get all ifnormation to dashboard border-[1px] border-lightBlack-100
  useEffect(() => {}, [isAuth,userName]);

  return (
    <div className="flex-col  h-full w-full p-1 overflow-y-auto">
      <div className={`flex  w-full h-14 rounded-md justify-between p-1 items-center pr-4 pl-4`}>
        <span className="font-bold text-2xl  text-notify-500">
          <span className="font-normal text-2xl text-white">Bem vindo,</span> {sessionStorage.getItem("usr_n")?.split(" ")[0].charAt(0).toUpperCase()+""+sessionStorage.getItem("usr_n")?.split(" ")[0].slice(1)}
        </span>
      </div>
      <div className={`flex w-full  mt-2 h-[20vh] shadow-md rounded-md bg-zinc-800 #md:bg-red-100 md:min-h-[6rem] #lg:bg-blue-100 #xl:bg-green-100 `}>
        <div className="group cursor-pointer w-full flex-1 border-r-[1px] mt-8 mb-8  flex items-center justify-center">
          <Link
            to="casos?status=1"
            onClick={() => {
              propsLayout.setButtonSelected(1);
            }}
          >
            <div className={`flex w-fit h-fit items-center justify-center`}>
              <div className=" border-[1px] p-2 rounded-lg border-zinc-300">
                <FolderOpen className="group-hover:text-zinc-400 text-lightBlack-100" weight="light" size={"2.5vw"} />
              </div>
              <div className="flex-row ml-3">
                <div className="text-3xl font-bold text-lightBlack-100">{caseCount[0]}</div>
                <div className="text-lg font-light text-lightBlack-100">Em aberto</div>
              </div>
            </div>
          </Link>
        </div>

        <div className="group cursor-pointer w-full flex-1 border-r-[1px] mt-8 mb-8 flex items-center justify-center">
          <Link
            to="casos?status=3"
            onClick={() => {
              propsLayout.setButtonSelected(1);
            }}
          >
            <div className={`flex  w-fit h-fit items-center justify-center`}>
              <div className=" border-[1px] p-2 rounded-lg border-notify-500">
                <Warning className="group-hover:text-notify-500 text-lightBlack-100 " weight="light" size={"2.5vw"} />
              </div>
              <div className="flex-row ml-3">
                <div className="text-3xl font-bold text-lightBlack-100">{caseCount[2]}</div>
                <div className="text-lg font-light text-lightBlack-100">Expirados</div>
              </div>
            </div>
          </Link>
        </div>

        <div className="group cursor-pointer w-full flex-1 border-r-[1px] mt-8 mb-8 flex items-center justify-center">
          <Link
            to="casos?status=2"
            onClick={() => {
              propsLayout.setButtonSelected(1);
            }}
          >
            <div className={`flex  w-fit h-fit items-center justify-center`}>
              <div className=" border-[1px] p-2 rounded-lg border-brand-50">
                <Clock className="group-hover:text-brand-50 text-lightBlack-100" weight="light" size={"2.5vw"} />
              </div>
              <div className="flex-row ml-3">
                <div className="text-3xl font-bold text-lightBlack-100">{caseCount[1]}</div>
                <div className="text-lg font-light text-lightBlack-100">Em andamento</div>
              </div>
            </div>
          </Link>
        </div>

        <div className="group cursor-pointer w-full flex-1  mt-8 mb-8 flex items-center justify-center">
          <Link
            to="casos?status=4"
            onClick={() => {
              propsLayout.setButtonSelected(1);
            }}
          >
            <div className={`flex  w-fit h-fit items-center justify-center`}>
              <div className=" border-[1px] p-2 rounded-lg border-green-500 ">
                <CheckCircle className="group-hover:text-green-500 text-lightBlack-100" weight="light" size={"2.5vw"} />
              </div>
              <div className="flex-row ml-3">
                <div className="text-3xl font-bold text-lightBlack-100">{caseCount[3]}</div>
                <div className="text-lg font-light text-lightBlack-100">Finalizados</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className={` flex  h-[calc(100%-16rem-3.5rem-2rem)] mt-4 rounded-md`}>
        <div className={`bg-zinc-800 shadow-md w-1/2 h-full rounded-md  #sm:bg-zinc-800 #md:bg-red-100 md:min-h-[17rem] #lg:bg-blue-100 #xl:bg-green-100 mr-4`}>
          <div className=" w-full pt-2 pl-4 pb-2 bg-zinc-800 rounded-t-md font-medium text-2xl text-zinc-100 md:text-lg md:pb-1 md:pt-1">Relatórios</div>
          <div className="w-full h-full flex-row ">
            <div className="w-full h-[45%] flex ">
              <div className="group cursor-pointer w-1/2 flex items-center justify-center">
                <Link
                  to="relatorios?status=1"
                  className="h-[10vh] w-full border-r-[1px] flex justify-center "
                  onClick={() => {
                    propsLayout.setButtonSelected(2);
                  }}
                >
                  <div>
                    <div>
                      <div className="flex ">
                        <Timer className="group-hover:bg-yellow-500 group-hover:border-white group-hover:text-white text-lightBlack-100 border-[1px] border-yellow-500 p-1 rounded-md" weight="light" size={"2vw"} />
                        <div className="text-lg font-light text-lightBlack-100 ml-2">Em espera</div>
                      </div>
                      <div className="text-3xl font-semibold text-lightBlack-100 w-full flex justify-center">{reportCount[0]}</div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="group cursor-pointer w-1/2 flex items-center justify-center">
                <Link
                  to="relatorios?status=2"
                  className="h-[10vh] w-full  flex justify-center "
                  onClick={() => {
                    propsLayout.setButtonSelected(2);
                  }}
                >
                  <div>
                    <div>
                      <div className="flex">
                        <Coffee className="group-hover:bg-brand3-100 group-hover:border-white group-hover:text-white text-lightBlack-100 border-[1px] border-brand3-100 p-1 rounded-md" weight="light" size={"2vw"} />
                        <div className="text-lg font-light text-lightBlack-100 ml-2">Em analise</div>
                      </div>
                      <div className="text-3xl font-semibold text-lightBlack-100 w-full flex justify-center">{reportCount[1]}</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <hr />
            <div className=" w-full h-[45%] flex ">
              <div className="group cursor-pointer w-1/2 flex items-center justify-center">
                <Link
                  to="relatorios?status=3"
                  className="h-[10vh] w-full border-r-[1px] flex justify-center "
                  onClick={() => {
                    propsLayout.setButtonSelected(2);
                  }}
                >
                  <div>
                    <div>
                      <div className="flex ">
                        <FileSearch className=" group-hover:bg-brand4-100 group-hover:border-white group-hover:text-white text-lightBlack-100 border-[1px] border-brand4-100 p-1 rounded-md" weight="light" size={"2vw"} />
                        <div className="text-lg font-light text-lightBlack-100 ml-2">Em revisão</div>
                      </div>
                      <div className="text-3xl font-semibold text-lightBlack-100 w-full flex justify-center">{reportCount[2]}</div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="group cursor-pointer w-1/2 flex items-center justify-center">
                <Link to="relatorios?status=4" className="h-[10vh] w-full flex justify-center "onClick={()=>{propsLayout.setButtonSelected(2)}}>
                  <div>
                    <div>
                      <div className="flex ">
                        <CheckCircle className="group-hover:bg-green-500 group-hover:border-white group-hover:text-white text-lightBlack-100 border-[1px] border-green-500 p-1 rounded-md" weight="light" size={"2vw"} />
                        <div className="text-lg font-light text-lightBlack-100 ml-2">Revisados</div>
                      </div>
                      <div className="text-3xl font-semibold text-lightBlack-100 w-full flex justify-center">{reportCount[3]}</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className={`w-1/2 h-full rounded-md flex-col`}>
          <div className={`bg-zinc-800 shadow-md w-full h-[50%] rounded-md  #sm:bg-zinc-800 #md:bg-red-100 md:min-h-[8rem] #lg:bg-blue-100 #xl:bg-green-100 `}>
            <div className=" w-full pt-2 pl-4 pb-2 bg-zinc-800  rounded-t-md font-medium text-2xl text-zinc-100 md:text-lg md:pb-1 md:pt-1">Afastamentos</div>
            <div className="w-full h-[45%] flex items-center  mt-[3vh]">
              <div className="group cursor-pointer w-1/2 flex items-center justify-center">
                <Link to="calendario-afastamentos?status=1" className="h-[10vh] w-full flex justify-center "onClick={()=>{propsLayout.setButtonSelected(5)}}>
                  <div>
                    <div>
                      <div className="flex items-center">
                        <Warning className="group-hover:bg-notify-500 cursor-pointer group-hover:border-white group-hover:text-white border-[1px] p-1 rounded-md border-notify-500 " weight="light" size={"2.5vw"} />
                        <div className="text-lg font-light text-lightBlack-100 ml-2">Para validar</div>
                      </div>
                      <div className="text-3xl font-semibold text-lightBlack-100 w-full flex justify-center">{departureCount[0]}</div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="group cursor-pointer w-1/2 flex items-center justify-center">
                <Link to="calendario-afastamentos?status=2" className="h-[10vh] w-full  flex justify-center "onClick={()=>{propsLayout.setButtonSelected(5)}}>
                  {" "}
                  <div>
                    <div>
                      <div className="flex items-center">
                        <CalendarCheck className="group-hover:bg-brand3-100 cursor-pointer group-hover:border-white group-hover:text-white border-[1px] p-1 border-brand3-100  rounded-md" weight="light" size={"2.5vw"} />
                        <div className="text-lg font-light text-lightBlack-100 ml-2">Agendados</div>
                      </div>
                      <div className="text-3xl font-semibold text-lightBlack-100 w-full flex justify-center">{departureCount[1]}</div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className=" group w-1/2 flex items-center justify-center cursor-pointer ">
                <Link to="calendario-afastamentos?status=3" className="h-[10vh] w-full border-r-[1px] flex justify-center "onClick={()=>{propsLayout.setButtonSelected(5)}}>
                  <div>
                    <div>
                      <div className="flex items-center ">
                        <AirplaneInFlight className="  group-hover:bg-yellow-500 group-hover:border-white group-hover:text-white border-[1px] p-1 border-yellow-500  rounded-md" weight="light" size={"2.5vw"} />
                        <div className="text-lg font-light  text-lightBlack-100 ml-2">Andamento</div>
                      </div>
                      <div className="text-3xl font-semibold text-lightBlack-100  lack-100 w-full flex justify-center">{departureCount[2]}</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className={`bg-zinc-800 shadow-md w-full h-[47%] mt-4 rounded-md  #sm:bg-zinc-800 #md:bg-red-100 md:min-h-[8rem] #lg:bg-blue-100 #xl:bg-green-100 `}>
            <div className=" w-full pt-2 pl-4 pb-2 bg-zinc-800 rounded-t-md font-medium text-2xl text-zinc-100 md:text-lg md:pb-1 md:pt-1">Analistas</div>
            <div className="w-full h-[45%] flex items-center  mt-[3vh]">
              <div className="group cursor-pointer w-1/2 flex items-center justify-center">
                <Link to="analistas?status=0" className="h-[10vh] w-full flex justify-center "onClick={()=>{propsLayout.setButtonSelected(4)}}>
                  <div>
                    <div>
                      <div className="flex items-center">
                        <Smiley className=" group-hover:text-green-500 rounded-md text-lightBlack-100 " weight="light" size={"2.5vw"} />
                        <div className="text-lg font-light text-lightBlack-100 ml-2">Disponiveis</div>
                      </div>
                      <div className="text-3xl font-semibold text-lightBlack-100 w-full flex justify-center">{analystCount[0]}</div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className=" group cursor-pointer w-1/2 flex items-center justify-center">
                <Link to="analistas?status=2" className="h-[10vh] w-full  flex justify-center "onClick={()=>{propsLayout.setButtonSelected(4)}}>
                  <div>
                    <div>
                      <div className="flex items-center">
                        <Suitcase className="group-hover:text-yellow-500 text-lightBlack-100  rounded-md" weight="light" size={"2.5vw"} />
                        <div className="text-lg font-light text-lightBlack-100 ml-2">Em tarefa</div>
                      </div>
                      <div className="text-3xl font-semibold text-lightBlack-100 w-full flex justify-center">{analystCount[2]}</div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="group cursor-pointer  w-1/2 flex items-center justify-center">
                <Link to="analistas?status=1" className="h-[10vh] w-full border-r-[1px] flex justify-center "onClick={()=>{propsLayout.setButtonSelected(4)}}>
                  <div>
                    <div>
                      <div className="flex items-center ">
                        <CircleDashed className="group-hover:text-orange-500  text-lightBlack-100  rounded-md" weight="light" size={"2.5vw"} />
                        <div className="text-lg font-light text-lightBlack-100 ml-2">Afastados</div>
                      </div>
                      <div className="text-3xl font-semibold text-lightBlack-100 w-full flex justify-center">{analystCount[1]}</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
