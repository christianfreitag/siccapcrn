import { ArrowClockwise, CaretLeft, CaretRight, FolderNotchOpen, Funnel, Ghost, MagnifyingGlass, SmileyXEyes } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "../../components/InputText";
import { ListDataFooter } from "../../components/ListData/ListDataFooter";
import { ListTitles } from "../../components/ListData/ListTitles";
import { UserContext } from "../../hooks/UserContext";
import { api } from "../../services/api";
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";
import { Button } from "../../components/Button";
import moment from "moment";

type requestType = {
  Investigated_requests: { investigated: { name: string } }[];
  _count: { Investigated_requests: number };
  caso: { num_caso_lab: string; num_sei: string; id: string };
  create_at: string;
  created_by: string;
  history: string;
  id: string;
  id_case: string;
  num_request: string;
};

export function Requests() {
  const { logout } = useContext(UserContext);

  const { isAuth } = useContext(UserContext);

  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  const [loadPage, setLoadPage] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [searchRequest, setSearchRequest] = useState("");
  const [totalRequest, setTotalRequest] = useState(0);
  const navigate = useNavigate();
  const nPerPage = 8;
  useEffect(() => {
    handleFindAllRequestData();
  }, [dateToFilter, dateFromFilter, page]);

  async function handleFindAllRequestData() {
    try {
      await api
        .get("requests", {
          withCredentials: true,
          params: {
            order: "asc",
            searchByNum: true,
            searchByInvestigated: true,
            searchData: searchRequest,
            page: page,
            dateFrom: dateFromFilter != "" ? moment(dateFromFilter).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ") : undefined,
            dateTo: dateToFilter != "" ? moment(dateToFilter).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ") : undefined,
          },
        })
        .then((res) => {
          
          setRequests(res.data[0]);
          setTotalRequest(res.data[1]);
        });
    } catch (e) {
      navigate(-1);
    }
  }

  const FiltersRequest = () => {
    return (
      <div>
        <div className="w-full flex h-12 pl-2 pr-4 border-b-[1px] pb-2">
          <div className="h-10 w-[50%] rounded-sm flex items-center">
            De
            <input
              type={"date"}
              className="h-10 w-full p-1 border-[1px] border-gray-300 rounded-md ml-2"
              value={dateFromFilter}
              onChange={(e) => {
                setDateFromFilter(e.target.value);
              }}
            ></input>
          </div>

          <div className="h-10 w-[50%]  rounded-sm flex items-center ml-2  mr-2">
            Até
            <input
              type={"date"}
              className="h-full w-full p-1 border-[1px] border-gray-300 rounded-md ml-2 "
              value={dateToFilter}
              onChange={(e) => {
                setDateToFilter(e.target.value);
              }}
            ></input>
          </div>
        </div>

        <div className="w-full flex h-8 pl-2 pr-4 pb-2 mt-2 justify-center items-center">
          <span
            onClick={() => {
              setDateFromFilter("");
              setDateToFilter("");
            }}
            className="group font-semibold hover:text-notify-500 flex items-center cursor-pointer"
          >
            Resetar filtros <ArrowClockwise size={"15px"} className="ml-2 group-hover:text-notify-500" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full w-full overflow-hidden  rounded-md pt-6 bg-zinc-800`}>
      {/*HEADER FILTER */}
      <header className={`h-[5%] mb-5 min-h-[3rem] w-full flex justify-between pl-8 pr-2 pt-2 `} onClick={() => {}}>
        <div className={`w-full font-semibold text-3xl text-lightBlack-100 flex `}>Solicitações</div>
        <Button
          text="Novo"
          className={`rounded-md w-[10rem] ml-4 `}
          onClick={() => {
            navigate("/solicitacoes=novo");
          }}
        />
      </header>
      <div className={`h-[6%] min-h-[3rem] w-full flex bg-black p-1`} onClick={() => {}}>
        <InputText className="flex-1 min-w-[18rem] mr-4" placeholder={"Pesquise aqui.."} iconInput={<MagnifyingGlass />} input={searchRequest} setInput={setSearchRequest} onEnter={handleFindAllRequestData} />
        <Popover
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
          dismiss={{ ancestorScroll: true }}
          placement="bottom-end"
        >
          <PopoverHandler>
            <div className={`cursor-pointer h-10 w-10 mr-4 ${dateFromFilter || dateToFilter ? "bg-brand-100 text-white" : "bg-neutral-900"} rounded-md flex items-center justify-center`}>
              <Funnel />
            </div>
          </PopoverHandler>
          <PopoverContent className={`rounded-md h-[7rem] pb-2 pt-4  w-[30rem] shadow-md p-0 duration-75 ml-2 bg-zinc-600 border-0 `}>
            <FiltersRequest />
          </PopoverContent>
        </Popover>
        <div className=" flex">
          <div
            className="noselect bg-neutral-900  h-10 w-10  rounded-l-md flex items-center justify-center cursor-pointer hover:bg-opacity-50"
            onClick={() => {
              page > 1 ? setPage(page - 1) : null;
            }}
          >
            <CaretLeft className={`${Math.ceil(totalRequest / 8) > 0 && page > 1 ? "text-zinc-400" : "text-gray-300 "}`} />
          </div>
          <div className="noselect bg-zinc-800 w-10 h-10 ml-2  flex items-center justify-center">
            {page}/{totalRequest / 8 > 0 ? Math.ceil(totalRequest / 8) : 1}
          </div>
          <div
            className="noselect bg-neutral-900 h-10 w-10 ml-2 rounded-r-md flex items-center justify-center hover:bg-opacity-50 cursor-pointer"
            onClick={() => {
              page < Math.ceil(totalRequest / 8) ? setPage(page + 1) : null;
            }}
          >
            <CaretRight className={`${Math.ceil(totalRequest / 8) > 0 && page < Math.ceil(totalRequest / 8) ? "text-zinc-400" : "text-gray-300 "}`} />
          </div>
        </div>
      </div>

      <ListTitles
        titleItens={[
          { title: "Nº da solicitação", spacing: "" },
          { title: "Nº caso LAB", spacing: "" },
          { title: "Nº investigados", spacing: "" },
        ]}
      />
      <div className={`h-auto overflow-y-scroll min-h-fit max-h-[60%] w-full p-1`}>
        {requests.length > 0 ? (
          <div className="   rounded-md overflow-y-scroll h-fit max-h-[95%]">
            <div className={`overflow-y-scroll min-h-20  w-full `}>
              {requests.map((value: requestType, index) => {
                return (
                  <div key={index} className={` pl-2 w-full justify-start  p-[1%] lg:text-[0.92rem]  md:text-sm ${index != requests.length - 1 ? "border-b-[1px]" : ""}`}>
                    <div className={`flex justify-start  `}>
                      <span
                        onClick={() => {
                          navigate("/solicitacoes=" + value.id);
                        }}
                        className="flex-1 cursor-pointer font-semibold"
                      >
                        {value.num_request}
                      </span>
                      <span className="flex-1 ">{value.caso.num_caso_lab}</span>
                      <span className="flex-1 ">
                        {value._count.Investigated_requests > 0 ? value.Investigated_requests[0].investigated.name.split(" ").map((v,index)=>(index<=1?index>0?" "+v:v:"")) : "-"}
                        {value._count.Investigated_requests > 1 ? 
                        <span className="text-white text-sm ml-2 underline"> mais {value._count.Investigated_requests - 1}</span> : null}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="w-full h-20 flex items-center justify-center text-xl text-lightBlack-100">
            <FolderNotchOpen weight="thin" size={"80%"} className={"text-zinc-400 w-fit"} /> <p className="p-5">Nenhum item encontrado.</p>
          </div>
        )}
      </div>

      <div className="bg-neutral-900 w-full  flex items-center justify-center cursor-pointer hover:bg-opacity-50">Total: {totalRequest}</div>
    </div>
  );
}
