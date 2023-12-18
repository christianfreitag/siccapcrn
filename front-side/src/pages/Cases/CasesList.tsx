import { ArrowClockwise, CaretLeft, CaretRight, Eye, FolderNotchOpen, Funnel, MagnifyingGlass, SmileyXEyes } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { ListTitles } from "../../components/ListData/ListTitles";
import { UserContext } from "../../hooks/UserContext";
import { api } from "../../services/api";
import { Link, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ListDataFooter } from "../../components/ListData/ListDataFooter";
import moment from "moment";
import { InputText } from "../../components/InputText";
import { caseType } from "../../components/Type/DataType";
import Select from "react-select";
import { Button } from "../../components/Button";
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";


export function Cases() {
  const locationState = useLocation();
  const query = new URLSearchParams(location.search);


  const [cases, setCases] = useState([]);
  const [searchCase, setSearchCase] = useState("");
  const [page, setPage] = useState(1);
  const [totalCases, setTotalCase] = useState(0);
  const navigate = useNavigate();

  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  var nPerPage = 8;
  useEffect(() => {
    handleFindAllCaseData();
  }, [page, locationState,dateFromFilter,dateToFilter]);

  async function handleFindAllCaseData() {
    await api
      .get("cases", {
        withCredentials: true,
        params: {
          order: "asc",
          searchBy: "all",
          countOnly: false,
          searchData: searchCase,
          status: query.get("status") ? query.get("status") : 0,
          page: page,
          dateFrom:dateFromFilter!=""?moment(dateFromFilter).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ"):undefined,
          dateTo:dateToFilter!=""?moment(dateToFilter).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ"):undefined
        },
      })
      .then((res) => {
        setCases(res.data[0]);
        setTotalCase(res.data[1]);
        
      })
      .catch((e) => {
        /*HandleError*/
      });
  }
  
  const FiltersCase = () => {
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
    <div className={`h-full w-full overflow-hidden  rounded-md pt-6 bg-white`}>
      {/*HEADER FILTER */}
      <header className={`h-[5%] min-h-[3rem] w-full flex justify-between pl-8 pr-2 pt-2 `} onClick={() => {}}>
        <div className={`w-full font-semibold text-3xl text-lightBlack-100 flex `}>Casos</div>
        <Button
          text="Novo"
          className={`rounded-md w-[10rem] ml-4 `}
          onClick={() => {
            navigate("/casos=novo");
          }}
        />
      </header>
      <div className={`h-[6%] min-h-[3rem] w-full mt-5  rounded-md flex bg-gray-50 p-1`} onClick={() => {}}>
        <InputText className="mr-4 min-w-[18rem]  flex-1" placeholder={"Pesquise aqui.."} onEnter={handleFindAllCaseData} input={searchCase} setInput={setSearchCase} iconInput={<MagnifyingGlass />} />
        <Select
          placeholder="Status"
          className="z-40 min-w-[10rem] mr-4 flex-1"
          maxMenuHeight={200}
          isClearable={true}
          onChange={(e) => {
            query.set("status", String(e?.value));
            navigate("/casos?" + query, { replace: true });
            setPage(1);
          }}
          value={
            query.get("status") != (null && undefined)
              ? [
                  { value: 0, label: "Todos" },
                  { value: 1, label: "Abertos" },
                  { value: 2, label: "Aguardando" },
                  { value: 3, label: "Expirados" },
                  { value: 4, label: "Finalizados" },
                ].filter((e) => String(e.value) == query.get("status"))
              : undefined
          }
          options={[
            { value: 0, label: "Todos" },
            { value: 1, label: "Abertos" },
            { value: 2, label: "Aguardando" },
            { value: 3, label: "Expirados" },
            { value: 4, label: "Finalizados" },
          ]}
        />
        <Popover
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
          dismiss={{ ancestorScroll: true }}
          placement="bottom-end"
        >
          <PopoverHandler>
            <div className={`cursor-pointer h-10 w-10 mr-4 ${dateFromFilter || dateToFilter ? "bg-brand-100 text-white" : "bg-gray-100"} rounded-md flex items-center justify-center`}>
              <Funnel />
            </div>
          </PopoverHandler>
          <PopoverContent className={`rounded-md h-[7rem] pb-2 pt-4  w-[30rem] shadow-md p-0 duration-75 ml-2 border-[1px] } `}>
            <FiltersCase />
          </PopoverContent>
        </Popover>
        <div className="rounded-md  min-w-[10rem]  h-10  flex mb-2 ">
          <div
            className="bg-gray-100  h-10 w-10  rounded-l-md flex items-center justify-center cursor-pointer hover:bg-opacity-50"
            onClick={() => {
              page > 1 ? setPage(page - 1) : null;
            }}
          >
            <CaretLeft className={`${Math.ceil(totalCases / 8) > 0 && page > 1 ? "text-brand-100" : "text-gray-300 "}`} />
          </div>
          <div className="bg-white w-[3rem] h-10 ml-2  flex items-center justify-center">
            {page}/{totalCases / 8 > 0 ? Math.ceil(totalCases / 8) : 1}
          </div>
          <div
            className="bg-gray-100 h-10 w-10 ml-2 rounded-r-md flex items-center justify-center hover:bg-opacity-50 cursor-pointer"
            onClick={() => {
              page < Math.ceil(totalCases / 8) ? setPage(page + 1) : null;
            }}
          >
            <CaretRight className={`${Math.ceil(totalCases / 8) > 0 && page < Math.ceil(totalCases / 8) ? "text-brand-100" : "text-gray-300 "}`} />
          </div>
        </div>
      </div>

      {/*LIST*/}
      <ListTitles
        titleItens={[
          { title: "Nº SEI", spacing: "" },
          { title: "Nº caso LAB", spacing: "" },
          { title: "Operação", spacing: "" },
          { title: "Abertura", spacing: "" },
          { title: "Ultima atualização", spacing: "" },
        ]}
      />
      <div className={`h-auto overflow-y-scroll min-h-fit max-h-[60%] w-full p-1`}>
        {cases.length > 0 ? (
          <div className="   rounded-md overflow-y-scroll h-fit max-h-[95%]">
            <div className={`overflow-y-scroll min-h-20  w-full `}>
              {cases.map((value: caseType, index) => {
                return (
                  <div key={index} className={` pl-2 w-full justify-start ${index != cases.length - 1 ? "border-b-[1px]" : ""}  p-[1%] lg:text-[0.92rem]  md:text-sm`}>
                    <Link to={"../casos="+value.id}><div
                      className={`flex justify-start cursor-pointer`}
                    >
                      <span className="flex-1  ">{value.num_sei}</span>
                      <span className="flex-1 ">{value.num_caso_lab}</span>
                      <span className="flex-1 ">{value.operation_name}</span>
                      <span className="flex-1 ">{<div className="bg-gray-200 p-1 rounded-md text-slate-800 flex items-center border-b-[2px] w-fit border-b-brand-100 pr-4 pl-2">{moment(value.create_at).format("DD/MM/YYYY")}</div>}</span>
                      <span className="flex-1 ">{value.CaseMovement.length > 0 ? value.CaseMovement[value.CaseMovement.length - 1].label : "Nenhuma"}</span>
                    </div></Link>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="w-full h-20 flex items-center justify-center text-xl text-lightBlack-100">
            <FolderNotchOpen weight="thin" size={"80%"} className={"text-brand-100 w-fit"} /> <p className="p-5">Nenhum caso encontrado.</p>
          </div>
        )}
      </div>
      <div className="bg-gray-100 w-full  flex items-center justify-center cursor-pointer hover:bg-opacity-50">Total: {totalCases}</div>
      {/*FOOTER WITH PAGE CONTR. */}
      
  </div>
  );
}
