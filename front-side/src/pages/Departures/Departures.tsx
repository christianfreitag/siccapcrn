import moment from "moment";
import { ArrowDown, ArrowFatDown, ArrowsDownUp, ArrowUp, CalendarBlank, CalendarCheck, CaretLeft, CaretRight, FolderNotchOpen, MagnifyingGlass, SmileyXEyes } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { InputText } from "../../components/InputText";

import { ListDataFooter } from "../../components/ListData/ListDataFooter";
import { ListTitles } from "../../components/ListData/ListTitles";
import { UserContext } from "../../hooks/UserContext";
import { api } from "../../services/api";
import { departureTypes } from "./Constants";

type departureType = {
  analyst: { id: string; name: string };
  created_by: string;
  date_end?: string;
  date_ini?: string;
  date_sche_end: string;
  date_sche_ini: string;
  id: string;
  type: number;
};
export function Departures() {
  const { logout } = useContext(UserContext);
  const { isAuth } = useContext(UserContext);
  const query = new URLSearchParams(location.search);
  const [departures, setDepartures] = useState([]);
  const [searchDepartures, setSearchDepartures] = useState("")
  const locationState = useLocation() as { state: { status: number } };
  const [page, setPage] = useState(1);
  const [totalDepartures, setTotalDepartures] = useState(0);
  const navigate = useNavigate()
  const nPerPage = 8;
  useEffect(() => {
    handleFindAllDeparturesData();
  }, [locationState, page]);

  async function handleFindAllDeparturesData() {
    await api
      .get("Departures", {
        withCredentials: true,
        params: {
          order: "asc",
          countOnly: false,
          searchData: searchDepartures,
          status: query.get('status') ? query.get('status') : 0,
          page: page,
        },
      })
      .then((res) => {
        setDepartures(res.data[1]);
        setTotalDepartures(res.data[0]);
        
      })
      .catch((e) => {
        /*HandleError*/
      });
  }

  return (
    <div className={`h-full w-full overflow-hidden  rounded-md p-6 bg-white`}>
      {/*HEADER FILTER */}
      <header className={`h-[5%] min-h-[3rem] w-full flex justify-between pl-2 pt-2 t`} onClick={() => { }}>
        <div className={`w-full font-semibold text-3xl text-lightBlack-100 flex `}>
          Afastamentos</div>

      </header>
      <div className={`h-[6%] min-h-[3rem] w-[80%] mt-5  rounded-md`} onClick={() => { }}>
        <InputText placeholder={"Pesquise aqui.."} iconInput={<MagnifyingGlass />} input={searchDepartures} setInput={setSearchDepartures} />
      </div>

      {/*LIST*/}

      {/*LIST*/}
      <ListTitles
        titleItens={[
          { title: "Analista", spacing: "" },
          { title: "Tipo", spacing: "" },
          { title: "Agendado para", spacing: "" },
          { title: "Iniciado em", spacing: "" },
          { title: "Finalizado em", spacing: "" },
        ]}
      />

      <div className={`h-auto overflow-y-scroll min-h-fit max-h-[60%] w-full p-1`}>
        {departures.length > 0 ? <div className="   rounded-md overflow-y-scroll h-fit max-h-[95%]">

          <div className={`overflow-y-scroll min-h-20  w-full `}>
            {departures.map((value: departureType, index) => {
              return (
                <div
                  key={index}
                  onClick={() => { navigate("/calendario-afastamentos=" + value.id) }}
                  className={` pl-2 w-full justify-start  cursor-pointer p-[1%] lg:text-[0.92rem]  md:text-sm ${index != departures.length - 1 ? 'border-b-[1px]' : ''}`}
                >
                  <div className={`flex justify-start ml-2`}>
                    <span className="flex-1 ">{value.analyst.name}</span>
                    <span className="flex-1">{departureTypes[value.type]}</span>

                    <span className="flex-1 flex items-center ml-4">
                      <div className="flex bg-gray-100 flex-wrap rounded-md p-1 items-center border-b-[2px] border-b-brand2-100  ">
                        <div className="ml-2  mr-1 flex items-center"><ArrowUp weight="bold" />{moment(value.date_sche_ini).format("DD/MM/YYYY")}</div>

                        <span className=" font-semibold ml-3 mr-3">até</span>

                        <div className="ml-1 flex items-center"><ArrowDown weight="bold" />{
                          moment(value.date_sche_end).format("DD/MM/YYYY")}</div>
                      </div>
                    </span>

                    <span className="flex-1 flex ml-2">{value.date_ini ?
                      <div className="bg-gray-200 p-1 rounded-md text-slate-800 flex items-center border-b-[2px] border-b-brand-100 pr-4 pl-2">
                        <CalendarCheck weight="bold" />
                        <span className="ml-2">{moment(value.date_ini).format("DD/MM/YYYY")}</span>
                      </div> : null}
                    </span>

                    <span className="flex-1 ">{value.date_end ?
                      <div className="bg-gray-200 p-1 rounded-md w-fit text-slate-800 flex items-center border-b-[2px] border-b-brand-100  pr-4 pl-2">
                        <ArrowDown weight="bold" />
                        <span className="ml-2">{moment(value.date_end).format("DD/MM/YYYY")}</span>
                      </div> : null}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div> : <div className="w-full h-20 flex items-center justify-center text-xl text-lightBlack-100"><FolderNotchOpen weight="thin" size={"80%"} className={"text-brand-100 w-fit"} /> <p className="p-5">Nenhum item encontrado.</p></div>}
      </div>

      <ListDataFooter
        page={page}
        nPerPage={nPerPage}
        totalData={totalDepartures}
        setPage={setPage}
      />

    </div>
  );
}
