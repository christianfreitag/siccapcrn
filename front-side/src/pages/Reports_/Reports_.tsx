import { ArrowArcLeft, ArrowClockwise, ArrowRight, CaretLeft, CaretRight, Download, FolderNotchOpen, Funnel, MagnifyingGlass, Plus, SmileyXEyes, TrashSimple } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorCard } from "../../components/ErrorCard";
import { InputText } from "../../components/InputText";
import { ListDataFooter } from "../../components/ListData/ListDataFooter";
import { ListTitles } from "../../components/ListData/ListTitles";
import { analystType, reportType } from "../../components/Type/DataType";
import { UserContext } from "../../hooks/UserContext";
import { api } from "../../services/api";
import { report_status, report_types, timeLineReportBase } from "./Constants";
import Select from "react-select";
import moment from "moment";
import { Button } from "../../components/Button";
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";
import Popup from "reactjs-popup";

export function Reports_() {
  const { logout } = useContext(UserContext);
  const { isAuth } = useContext(UserContext);
  const query = new URLSearchParams(location.search);
  const [reports, setReports] = useState([]);
  const locationState = useLocation() as { state: { status: number } };
  const [page, setPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const navigate = useNavigate();

  const [analysts,setAnalysts]  = useState<{label:string,value:number,id:string}[]>([])
  const [filterAnalyst,setFilterAnalyst] = useState<string|undefined>("")

  const [statusFilterReport, setStatusFilterReport] = useState(0);
  const [filterTypeReport, setFilterTypeReport] = useState<number | undefined>(undefined);
  const [dateFilterFromReport, setDateFilterFromReport] = useState("");
  const [dateFilterToReport, setDateFilterToReport] = useState("");
  const [searchReport, setSearchReport] = useState("");

  const [useFilters, setUseFilters] = useState(true);

  var nPerPage = 8;
  const [warning, setWarning] = useState<{ errors: string[]; status: "ok" | "info" | "error"; timer: boolean }>({ errors: [], status: "error", timer: false });

  async function getAnalysts() {
    await api.get("analysts", {
        withCredentials: true, params: {
            searchData: "",
            status: 9,
            countOnly: false,
            page: 1,
        }
    }).then((res: { data: [analystType[], number] }) => {
        let auxAnalyst = res.data[0].map((a, index) => ({ label: a.name, value: index, id: a.id }))
        setAnalysts(auxAnalyst)
    })
}

  async function downloadReport(fileName: string, num_report: string, type: number) {
    await api
      .get("reports/download/" + fileName, { withCredentials: true, responseType: "blob" })
      .then(async (res) => {
        var blob = new Blob([res.data], { type: "application/pdf" });

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        //@ts-ignore
        link.download = num_report + "_" + report_types[type];
        document.body.appendChild(link);
        link.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        document.body.removeChild(link);
      })
      .catch((e) => {
        setWarning({ errors: ["Ocorreu um problema no download do arquivo de relatório."], status: "error", timer: false });
      });
  }
  useEffect(()=>{
    getAnalysts()
  },[])
  useEffect(() => {
    handleFindAllReportData();
  }, [locationState, page, dateFilterFromReport, dateFilterToReport, filterTypeReport,filterAnalyst]);

  async function handleFindAllReportData() {
    try {
      await api
        .get("reports", {
          withCredentials: true,
          params: {
            order: "asc",
            status: query.get("status") ? query.get("status") : 0,
            page: page,
            searchData: searchReport,
            dateFrom: dateFilterFromReport != "" ? moment(dateFilterFromReport).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ") : undefined,
            dateTo: dateFilterToReport != "" ? moment(dateFilterToReport).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ") : undefined,
            typeFilter: filterTypeReport,
            analystFilter:filterAnalyst!=""?filterAnalyst:undefined
          },
        })
        .then((res) => {
          setReports(res.data[0]);
          setTotalReports(res.data[1]);
          
        });
    } catch (e: any) {
      setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
    }
  }

  const FiltersReport = () => {
    return (
      <div>
        
        <div className="w-full flex h-12 pl-2 pr-4 border-b-[1px] pb-2">
          <div className="h-10 w-[50%] rounded-sm flex items-center">
            De
            <input
              type={"date"}
              className="h-10 w-full p-1 border-[1px] border-gray-300 rounded-md ml-2"
              value={dateFilterFromReport}
              onChange={(e) => {
                setDateFilterFromReport(e.target.value);
              }}
            ></input>
          </div>

          <div className="h-10 w-[50%]  rounded-sm flex items-center ml-2  mr-2">
            Até
            <input
              type={"date"}
              className="h-full w-full p-1 border-[1px] border-gray-300 rounded-md ml-2 "
              value={dateFilterToReport}
              onChange={(e) => {
                setDateFilterToReport(e.target.value);
              }}
            ></input>
          </div>
          <div className="h-10 w-12 bg-gray-100 flex items-center justify-center rounded-md hover:bg-gray-200 cursor-pointer"
          onClick={()=>{
            setDateFilterFromReport(""),
            setDateFilterToReport("")
          }}
          ><TrashSimple/></div>
        </div>
        <div className="w-full flex h-12 pl-2 pr-4 border-b-[1px] pb-2 mt-2">
          
          <Select
          className="w-full  z-50"
          placeholder="Tipo de relatório"
          isClearable={true}
          value={filterTypeReport?{label:report_types[filterTypeReport],value:filterTypeReport}:undefined}
          onChange={(e)=>{
            setFilterTypeReport(e?.value)
          }}
            options={report_types.map((v,index)=>({value:index,label:v}))}
          />
        </div>
        <div className="w-full flex h-12 pl-2 pr-4 border-b-[1px] pb-2 mt-2">
          
          <Select
          className="w-full z-40"
          placeholder="Analista"
          value={analysts.filter(a=>a.id==filterAnalyst)}
          isClearable={true}
          onChange={(e)=>{
            setFilterAnalyst(e?.id)
          }}
            options={analysts}
          />
        </div>
        <div className="w-full flex h-8 pl-2 pr-4 pb-2 mt-2 justify-center items-center">
          
          <span 
          onClick={()=>{
            setDateFilterFromReport("")
            setDateFilterToReport("")
            setFilterAnalyst("")
            setFilterTypeReport(undefined)
          }}
          className="group font-semibold hover:text-notify-500 flex items-center cursor-pointer">Resetar filtros <ArrowClockwise size={"15px"} className="ml-2 group-hover:text-notify-500"/></span>
        </div>
        
      </div>
    );
  };

  return (
    <div className={`h-full w-full overflow-hidden  rounded-md pt-6 bg-white`}>
      {/*@ts-ignore */}
      {warning.errors ? warning.errors.length >= 1 ? <ErrorCard errors={warning?.errors} setErrors={setWarning} status={warning?.status} timer={warning.timer ? 1500 : 0} /> : null : null}
      <header className={`h-[5%] mb-5 min-h-[3rem] w-full flex justify-between pl-8 pr-2 pt-2 `} onClick={() => {}}>
        <div className={`w-full font-semibold text-3xl text-lightBlack-100 flex `}>Relatórios</div>
        <Button
          text="Novo"
          className={`rounded-md w-[10rem] ml-4 `}
          onClick={() => {
            navigate("/relatorios=novo");
          }}
        />
      </header>

      <div className={`h-[6%] min-h-[3rem] w-full flex bg-gray-50 p-1`} onClick={() => {}}>
        <InputText input={searchReport} setInput={setSearchReport} onEnter={handleFindAllReportData} className="flex-1 min-w-[18rem] mr-4" placeholder={"Pesquise aqui.."} iconInput={<MagnifyingGlass />} />
        <Select
          placeholder="Status"
          className="z-40  mr-4  min-w-[8rem] flex-1"
          maxMenuHeight={200}
          onChange={(e) => {
            query.set("status", String(e?.value));
            navigate("/relatorios?" + query, { replace: true });
            setPage(1);
          }}
          value={[
            { value: 0, label: "Todos" },
            { value: 1, label: "Em espera" },
            { value: 2, label: "Em analise" },
            { value: 3, label: "Em revisão" },
            { value: 4, label: "Revisado" },
          ].filter((el) => String(el.value) == query.get("status"))}
          options={[
            { value: 0, label: "Todos" },
            { value: 1, label: "Em espera" },
            { value: 2, label: "Em analise" },
            { value: 3, label: "Em revisão" },
            { value: 4, label: "Revisado" },
          ].sort()}
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
            <div
              className={`cursor-pointer h-10 w-10 mr-4 ${(filterAnalyst||filterTypeReport||dateFilterFromReport||dateFilterToReport) ? "bg-brand-100 text-white" : "bg-gray-100"} rounded-md flex items-center justify-center`}
              onClick={() => {
                
                setUseFilters(!useFilters);
              }}
            >
              <Funnel />
            </div>
          </PopoverHandler>
          <PopoverContent className={`rounded-md h-[14rem] pb-2 pt-4  w-[30rem] shadow-md p-0 duration-75 ml-2 border-[1px] } `}>
            <FiltersReport />
          </PopoverContent>
        </Popover>
        <div className=" flex">
          <div
            className="noselect bg-gray-100  h-10 w-10  rounded-l-md flex items-center justify-center cursor-pointer hover:bg-opacity-50"
            onClick={() => {
              page > 1 ? setPage(page - 1) : null;
            }}
          >
            <CaretLeft className={`${Math.ceil(totalReports / 8) > 0 && page > 1 ? "text-brand-100" : "text-gray-300 "}`} />
          </div>
          <div className="noselect bg-white w-10 h-10 ml-2  flex items-center justify-center">
            {page}/{totalReports / 8 > 0 ? Math.ceil(totalReports / 8) : 1}
          </div>
          <div
            className="noselect bg-gray-100 h-10 w-10 ml-2 rounded-r-md flex items-center justify-center hover:bg-opacity-50 cursor-pointer"
            onClick={() => {
              page < Math.ceil(totalReports / 8) ? setPage(page + 1) : null;
            }}
          >
            <CaretRight className={`${Math.ceil(totalReports / 8) > 0 && page < Math.ceil(totalReports / 8) ? "text-brand-100" : "text-gray-300 "}`} />
          </div>
        </div>
      </div>

      <ListTitles
        titleItens={[
          { title: "Nº do Relatório", spacing: "" },
          { title: "Tipo", spacing: "" },
          { title: "Analista", spacing: "" },
          { title: "Status", spacing: "" },
          { title: "Arquivo", spacing: "" },
        ]}
      />
      <div className={`h-auto overflow-y-scroll min-h-fit max-h-[60%] w-full p-1`}>
        {reports.length > 0 ? (
          <div className="   rounded-md overflow-y-scroll h-fit max-h-[95%]">
            <div className={`overflow-y-scroll min-h-20  w-full `}>
              {reports.map((value: reportType, index) => {
                return (
                  <div key={index} className={` pl-2 w-full justify-start  p-[1%] lg:text-[0.92rem]  md:text-sm ${index != reports.length - 1 ? "border-b-[1px]" : ""}`}>
                    <div className={`flex justify-start`}>
                      <span
                        onClick={() => {
                          navigate("/relatorios=" + value.id);
                        }}
                        className="flex-1 cursor-pointer font-semibold"
                      >
                        {value.num_report}
                      </span>
                      <span className="flex-1">{report_types[value.type]}</span>
                      <span className="flex-1 ">{value.analyst ? value.analyst.name : "-"}</span>
                      <span className="flex-1">{report_status[value.status]}</span>
                      <span
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          value.file? downloadReport(value.file, value.num_report, value.type):null
                        }}
                      >
                        <Download size={"20px"} className={`${value.file ? "text-brand-100" : "text-gray-200"}`} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="w-full h-20 flex items-center justify-center text-xl text-lightBlack-100">
            <FolderNotchOpen weight="thin" size={"80%"} className={"text-brand-100 w-fit"} /> <p className="p-5">Nenhum item encontrado.</p>
          </div>
        )}
      </div>

      <div className="bg-gray-100 w-full  flex items-center justify-center cursor-pointer hover:bg-opacity-50">Total: {totalReports}</div>
    </div>
  );
}
