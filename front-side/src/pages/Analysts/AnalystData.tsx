import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";
import moment from "moment";
import { ArrowArcLeft, ArrowClockwise, ArrowRight, CaretLeft, CaretRight, DotsThreeVertical, Download, Ghost, PencilSimple, Plus, TrashSimple } from "phosphor-react";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import Select from "react-select";

import { ErrorCard } from "../../components/ErrorCard";
import { analystType, departureType, reportType } from "../../components/Type/DataType";
import { DataCountContext } from "../../hooks/DataCountContext";
import { api } from "../../services/api";
import { DateFilters, departureTypes } from "../Departures/Constants";
import { InputText } from "../../components/InputText";
import { report_status, report_types } from "../Reports_/Constants";
import { Button } from "../../components/Button";
import { analystStatus } from "./Constants";

export function AnalystData() {
  const [warning, setWarning] = useState<{ errors: string[]; status: "ok" | "info" | "error"; timer: boolean }>({ errors: [], status: "error", timer: false });
  const { id } = useParams();
  const navigate = useNavigate();
  const { resetAnalystCount } = useContext(DataCountContext);

  const [analyst, setAnalyst] = useState<analystType>();

  const [name, setName] = useState("");
  const [cpf, setCPF] = useState("");
  const [email, setEmail] = useState("");
  const [pendingDays, setPendingDays] = useState("0");
  const [whatsapp, setWhatsapp] = useState("");

  const [isDetailOpen, setDetailOpen] = useState(false);
  const [reports, setReports] = useState<reportType[]>();
  const [departures, setDepartures] = useState<departureType[]>();
  const [pageDepartures, setPageDepartures] = useState(1);
  const [pageReports, setPageReports] = useState(1);
  const [totalDeparturesCount, setTotalDepartureCount] = useState(0);
  const [totalReportsCount, setTotalReportsCount] = useState(0);

  const [isOnEditMode, setOnEditMode] = useState(false);

  const [dateOptionFilter, setDateOptionFilter] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState(9);
  const [dateFilterFrom, setDateFilterFrom] = useState("");
  const [dateFilterTo, setDateFilterTo] = useState("");
  const [filterTypeDeparture, setTypeDepartureFilter] = useState<number | undefined>(undefined);

  const [statusFilterReport, setStatusFilterReport] = useState<undefined|number>(0);
  const [filterTypeReport, setFilterTypeReport] = useState<number | undefined>(undefined);
  const [dateFilterFromReport, setDateFilterFromReport] = useState("");
  const [dateFilterToRepoort, setDateFilterToReport] = useState("");

  const [onSubmit, setSubmited] = useState(false);  

  const [loadPage, setLoadPage] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  async function handleCreate() {
    if (name && cpf && pendingDays) {
      await api
        .post(
          "analysts",
          {
            name: name,
            cpf: cpf,
            email: email ? email : null,
            whatsapp: whatsapp ? whatsapp : null,
            pending_vacation_days: parseInt(pendingDays),
          },
          { withCredentials: true }
        )
        .then((res: { data: analystType }) => {
          resetAnalystCount();
          setWarning({ errors: ["Salvo com sucesso!"], status: "ok", timer: true });
          navigate("../analistas=" + res.data.id, { replace: true });
          setOnEditMode(false);
        })
        .catch((e) => {
          setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
        });
    } else {
      setWarning({ errors: ["Existem campos obrigatórios que não foram preenchidos."], status: "error", timer: false });
    }
  }
  async function handleGetAnalyst() {
    await api
      .get("analysts/" + id, { withCredentials: true })
      .then((res: { data: analystType }) => {
        setAnalyst(res.data);
        fetchToVariables();
        setIsLoadingPage(false);
        setLoadPage(true);
      })
      .catch((e) => {
        setIsLoadingPage(false);
        setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
      });
  }
  async function handlePatch() {
    setSubmited(true);
    if (name != analyst?.name || cpf != analyst?.cpf || email != analyst?.email || parseInt(pendingDays) != analyst.pending_vacation_days || whatsapp != analyst.whatsapp) {
      if (name && cpf && pendingDays) {
        var data = {
          name: name,
          cpf: cpf,
          email: email ? email : null,
          whatsapp: whatsapp ? whatsapp : null,
          pending_vacation_days: parseInt(pendingDays),
        };
        await api
          .patch("analysts/" + id, data, { withCredentials: true })
          .then((res: { data: analystType }) => {
            setAnalyst(res.data);
            setWarning({ errors: ["Salvo com sucesso!"], status: "ok", timer: true });
            setSubmited(false);
            setOnEditMode(false);
          })
          .catch((e) => {
            setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
          });
      } else {
        setWarning({ errors: ["Existem campos obrigatórios que não foram preenchidos."], status: "error", timer: false });
      }
    } else {
      setOnEditMode(false);
    }
  }
  async function handleRemove() {
    await api
      .delete("analysts/" + id, { withCredentials: true })
      .then((res: { data: analystType }) => {
        setWarning({ errors: ["Salvo com sucesso!"], status: "ok", timer: true });
        resetAnalystCount();
        navigate("../analistas", { replace: true });
      })
      .catch((e) => {
        setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
      });
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

  async function handleGetDepartures() {
    await api
      .get("Departures", {
        withCredentials: true,
        params: {
          order: "asc",
          analystId: id,
          countOnly: false,
          searchData: "",
          status: statusFilter,
          dateFilter: dateOptionFilter,
          dateFilterFrom: dateFilterFrom != "" ? moment(dateFilterFrom).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ") : undefined,
          dateFilterTo: dateFilterTo != "" ? moment(dateFilterTo).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ") : undefined,
          typeFilter: filterTypeDeparture ,
          page: pageDepartures,
        },
      })
      .then((res) => {
        setDepartures(res.data[1]);
        setTotalDepartureCount(res.data[0]);
      })
      .catch((e) => {
        setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
      });
  }
  async function handleGetReports() {
    await api
      .get("reports", {
        withCredentials: true,
        params: {
          order: "asc",
          analystId: id,
          searchData: "",
          status: statusFilterReport,
          dateFrom: dateFilterFromReport != "" ? moment(dateFilterFromReport).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ") : undefined,
          dateTo: dateFilterToRepoort != "" ? moment(dateFilterToRepoort).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ") : undefined,
          typeFilter: filterTypeReport,
          page: pageReports,
        },
      })
      .then((res) => {
        setReports(res.data[0]);
        setTotalReportsCount(res.data[1]);
      });
  }

  function fetchToVariables() {
    setName(analyst ? analyst.name : "");
    setCPF(analyst ? analyst.cpf : "");
    setEmail(analyst ? (analyst.email ? analyst.email : "") : "");
    setWhatsapp(analyst ? (analyst.whatsapp ? analyst.whatsapp : "") : "");
    setPendingDays(analyst ? String(analyst.pending_vacation_days) : "0");
  }

  function clearFields() {
    setName("");
    setCPF("");
    setEmail("");
    setWhatsapp("");
    setPendingDays("0");
    setReports([]);
    setDepartures([]);
  }
  useEffect(() => {
    handleGetReports();
  }, [pageReports, filterTypeReport, statusFilterReport, dateFilterFromReport, dateFilterToRepoort]);

  useEffect(() => {
    handleGetDepartures();
  }, [pageDepartures, dateFilterFrom, dateFilterTo, statusFilter, dateOptionFilter, filterTypeDeparture]);
  useEffect(() => {
    if (id != "novo") {
      if (!analyst) {
        handleGetAnalyst();
        handleGetDepartures();
        handleGetReports();
      } else {
        fetchToVariables();
      }
    } else {
      setIsLoadingPage(false);
      setLoadPage(true);
      clearFields();
      setOnEditMode(true);
    }
  }, [analyst, isOnEditMode, id]);
  return loadPage ? (
    <div className={` w-full h-full overflow-y-auto`}>
      {/*@ts-ignore*/}
      {warning.errors ? warning.errors.length >= 1 ? <ErrorCard errors={warning?.errors} setErrors={setWarning} status={warning?.status} timer={warning.timer ? 1500 : 0} /> : null : null}
      <div className={`h-[2rem] w-full p-2 mb-8 font-semibold text-3xl text-lightBlack-100 flex items-baseline `}>
        Analista
        <span className="text-lightBlack-100 font-medium text-lg ml-4"> Informações gerais </span>
      </div>
      <div className={`w-full min-h-[20rem] h-fit pb-[8rem] bg-white rounded-md relative`}>
        <div>
          <div className={`flex flex-wrap pl-6 pr-6 pt-6`}>
            <div className="flex-1 min-w-[20rem] mr-4 mt-2">
              <InputText isDisabled={!isOnEditMode} onSubmit={onSubmit} isNotOptional={true} input={name} setInput={setName} label="Nome" />
            </div>
            <div className="flex-1  min-w-[20rem] mr-4 mt-2">
              <InputText isDisabled={!isOnEditMode} onSubmit={onSubmit} isNotOptional={true} input={cpf} setInput={setCPF} label="CPF" typeData="cpf" />
            </div>
          </div>
          <div className={`flex flex-wrap pl-6 pr-6 pt-6`}>
            <div className="flex-1 min-w-[20rem] mr-4 mt-2">
              <InputText isDisabled={!isOnEditMode} input={email} setInput={setEmail} label="Email" />
            </div>
            <div className="flex-1  min-w-[20rem] mr-4 mt-2">
              <InputText isDisabled={!isOnEditMode} input={whatsapp} setInput={setWhatsapp} label="Whatsapp" />
            </div>
          </div>
          <div className={`flex flex-wrap pl-6 pr-6 pt-6 items-center h-[5rem]`}>
            <div className="flex-1  min-w-[20rem] mr-4 mt-2 ">
              <InputText isDisabled={!isOnEditMode} onSubmit={onSubmit} isNotOptional={true} input={pendingDays} setInput={setPendingDays} label="Dias de afastamento pendentes" />
            </div>
            {analyst != null && id != "novo" ? (
              <div className="h-full flex-1 mt-2  flex items-end ">
                <span className="font-semibold flex items-center mr-2 text-lightBlack-100">Status:</span>
                <div className="flex items-baseline">
                  {analystStatus[analyst?.status+1]}
                  <div className={`h-3 w-3 rounded-full ml-2 ${analyst.status == 2 ? "bg-yellow-400" : analyst.status == 0 ? "bg-green-500" : analyst.status == 1 || analyst.status == 3 ? "bg-red-400" : ""}`}></div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {!isOnEditMode ? (
          <div className={`absolute  right-6 bottom-4   flex items-center  `}>
            <div
              className={` flex items-center cursor-pointer mr-10`}
              onClick={() => {
                handleRemove();
              }}
            >
              {<TrashSimple className={`mr-2 `} />}Deletar
            </div>

            <div
              className={` flex items-center cursor-pointer `}
              onClick={() => {
                setOnEditMode(true);
              }}
            >
              {<PencilSimple className={`mr-2 `} />}Editar
            </div>
          </div>
        ) : (
          <div className="w-60 h-8 absolute  right-6 bottom-4  flex items-center justify-between">
            <Button
              text="Cancelar"
              className="bg-red-400  ring-red-400 hover:bg-red-400 rounded-sm"
              onClick={() => {
                setSubmited(false);
                if (id != "novo") {
                  setOnEditMode(!isOnEditMode);
                  fetchToVariables();
                } else {
                  navigate(-1);
                }
              }}
            />

            <Button
              confirm={true}
              confirmText={""}
              text="Salvar"
              className="ml-4 rounded-sm "
              onClick={() => {
                if (id != "novo") {
                  handlePatch();
                } else {
                  handleCreate();
                }
              }}
            />
          </div>
        )}
        {id != "novo" ? (
          <span
            onClick={() => {
              setDetailOpen(!isDetailOpen);
            }}
            className={`absolute bottom-4 left-6 underline cursor-pointer `}
          >
            Mostrar {isDetailOpen ? "menos " : "mais "}
            detalhes
          </span>
        ) : null}
        {isDetailOpen ? (
          <div className={`flex w-full  h-[5rem] pl-6 pr-6 mt-2`}>
            <div className={`flex-1   mt-4 h-fit mr-10`}>
              <InputText label={"Data de criação"} input={moment(analyst?.create_at).format("DD/MM/YYYY")} isDisabled={true} />
            </div>
            <div className={`flex-1   mt-4 h-fit`}>
              <InputText label={"Criado por:"} input={analyst ? analyst?.user.name : ""} isDisabled={true} />
            </div>
          </div>
        ) : null}
      </div>

      {!isOnEditMode ? (
        <div>
          {/* RELATORIOS */}
          <div className={`w-full h-fit bg-white rounded-md mt-4 relative`}>
            <div className={` w-full h-[5rem]  p-6 text-2xl text-lightBlack-100`}>Relatórios</div>
            <div className={`w-full h-fit 0 flex-row `}>
              <div className={`w-full min-h-[4rem]   p-2 bg-gray-50`}>
                <div className="flex  items-center flex-wrap  justify-between">
                  <div className="rounded-md   h-10  flex mb-2 ">
                    <div className=" flex">
                      <div
                        className="bg-gray-100  h-10 w-10  rounded-l-md flex items-center justify-center cursor-pointer hover:bg-opacity-50"
                        onClick={() => {
                          pageReports > 1 ? setPageReports(pageReports - 1) : null;
                        }}
                      >
                        <CaretLeft className={`${Math.ceil(totalReportsCount / 8) > 0 && pageReports > 1 ? "text-brand-100" : "text-gray-300 "}`} />
                      </div>
                      <div className="bg-white w-10 h-10 ml-2  flex items-center justify-center">
                        {pageReports}/{totalReportsCount / 8 > 0 ? Math.ceil(totalReportsCount / 8) : 1}
                      </div>
                      <div
                        className="bg-gray-100 h-10 w-10 ml-2 rounded-r-md flex items-center justify-center hover:bg-opacity-50 cursor-pointer"
                        onClick={() => {
                          pageReports < Math.ceil(totalReportsCount / 8) ? setPageReports(pageReports + 1) : null;
                        }}
                      >
                        <CaretRight className={`${Math.ceil(totalReportsCount / 8) > 0 && pageReports < Math.ceil(totalReportsCount / 8) ? "text-brand-100" : "text-gray-300 "}`} />
                      </div>
                    </div>
                    <div
                      title="Resetar filtros"
                      className=" mb-2 flex items-center justify-center ml-2 bg-gray-100 h-10 w-10 rounded-md mr-2 hover:text-purple-600 cursor-pointer"
                      onClick={() => {
                        setFilterTypeReport(undefined);
                        setStatusFilterReport(0);
                        setDateFilterFromReport("");
                        setDateFilterToReport("");
                      }}
                    >
                      <ArrowClockwise className="" />
                    </div>
                    <Select
                      placeholder="Tipo"
                      className="z-40  mr-2 mb-2 w-[20vw] min-w-[2rem] "
                      maxMenuHeight={200}
                      value={report_types.filter((e,i)=>(i==filterTypeReport)).map((v, index) => ({ label: v, value: index }))}
                      onChange={(e) => {
                        setFilterTypeReport(e?.value)
                        setPageReports(1);
                      }}
                      options={report_types.map((v, index) => ({ label: v, value: index }))}
                    />
                    <Select
                      placeholder="Status"
                      className="z-40  mr-2 max-w-[18rem]   mb-2 min-w-[2rem]"
                      maxMenuHeight={200}
                      onChange={(e) => {
                         setStatusFilterReport(e?.value) 
                        setPageReports(1);
                      }}
                      value={[
                        { value: 0, label: "Todos" },
                        { value: 1, label: "Em espera" },
                        { value: 2, label: "Em analise" },
                        { value: 3, label: "Em revisão" },
                        { value: 4, label: "Revisado" },
                      ].filter((el) => el.value == statusFilterReport)}
                      options={[
                        { value: 0, label: "Todos" },
                        { value: 1, label: "Em espera" },
                        { value: 2, label: "Em analise" },
                        { value: 3, label: "Em revisão" },
                        { value: 4, label: "Revisado" },
                      ].sort()}
                    />
                  </div>

                  <div className="h-[2.4rem] w-[52%] flex items-center mb-2 min-w-[20rem] max-w-[50rem]">
                    <span className="whitespace-nowrap">Criado entre: </span>
                    <div className="h-full w-[50%] bg-white rounded-sm flex items-center mr-2 ">
                      <input
                        type={"date"}
                        className="h-full w-full p-1 border-[1px] border-gray-300 rounded-md ml-2"
                        value={dateFilterFromReport}
                        onChange={(e) => {
                          setDateFilterFromReport(e.target.value);
                        }}
                      ></input>
                    </div>
                    <ArrowRight size={"2rem"} className="min-w-[1rem]" />
                    <div className="h-full w-[50%] bg-white rounded-sm flex items-center ml-2  ">
                      <input
                        type={"date"}
                        className="h-full w-full p-1 border-[1px] border-gray-300 rounded-md "
                        value={dateFilterToRepoort}
                        onChange={(e) => {
                          setDateFilterToReport(e.target.value);
                        }}
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className={` h-14 bg-gray-100 w-full flex items-center  pl-6 pr-6 shadow-sm`}>
                {["Nº do relatório", "Status", "Tipo", "Arquivo"].map((v, i) => {
                  return (
                    <div key={v} className={`flex-1 font-semibold`}>
                      {v}
                    </div>
                  );
                })}
              </div>

              <div className={`min-h-[20rem] max-h-[25rem] overflow-y-auto border-b-[1px] `}>
                {reports ? (
                  reports.length > 0 ? (
                    reports?.map((i, index) => {
                      return (
                        <div key={i.id} className={`flex items-center justify-between pl-6 pr-6 h-[4rem] border-b-[1px]`}>
                          <div className={`flex-1 cursor-pointer`}>
                            <Link to={"../relatorios=" + i.id}>{i.num_report}</Link>
                          </div>
                          <div className={`flex-1`}>{report_status[i.status]}</div>
                          <div className={`flex-1`}>{report_types[i.type]}</div>
                          <span
                            className="flex-1 cursor-pointer"
                            onClick={() => {
                              i.file ? downloadReport(i.file, i.num_report, i.type) : null;
                            }}
                          >
                            <Download size={"20px"} className={`${i.file ? "text-brand-100" : "text-gray-200"}`} />
                          </span>
                          
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full min-h-[20rem] flex items-center justify-center text-xl font-thin">
                      {" "}
                      <Ghost size={"3rem"} weight={"thin"} className="mr-4" />
                      Nenhum investigado encontrado, tente adicionar alguns.
                    </div>
                  )
                ) : null}
              </div>
              <div className={`min-h-[5rem] h-[90%] `}></div>
            </div>
            <div className={`absolute  right-6 bottom-6   flex items-center  `}></div>
          </div>
          {/* AFASTAMENTOS */}
          <div className={`w-full h-fit bg-white rounded-md mt-4 relative`}>
            <div className={` w-full h-[5rem]  p-6 text-2xl text-lightBlack-100`}>Afastamentos</div>
            <div className={`w-full h-fit 0 flex-row `}>
              <div className={`w-full min-h-[4rem] xl:h-[4rem] 2xl:h-[4rem]  p-2 bg-gray-50`}>
                <div className="flex  items-center flex-wrap  ">
                  <div className="rounded-md  w-32  h-10  flex mb-2 ">
                    <div
                      className="bg-gray-100  h-10 w-10  rounded-l-md flex items-center justify-center cursor-pointer hover:bg-opacity-50"
                      onClick={() => {
                        pageDepartures > 1 ? setPageDepartures(pageDepartures - 1) : null;
                      }}
                    >
                      <CaretLeft className={`${Math.ceil(totalDeparturesCount / 8) > 0 && pageDepartures > 1 ? "text-brand-100" : "text-gray-300 "}`} />
                    </div>
                    <div className="bg-white w-10 h-10 ml-2  flex items-center justify-center">
                      {pageDepartures}/{totalDeparturesCount / 8 > 0 ? Math.ceil(totalDeparturesCount / 8) : 1}
                    </div>
                    <div
                      className="bg-gray-100 h-10 w-10 ml-2 rounded-r-md flex items-center justify-center hover:bg-opacity-50 cursor-pointer"
                      onClick={() => {
                        pageDepartures < Math.ceil(totalDeparturesCount / 8) ? setPageDepartures(pageDepartures + 1) : null;
                      }}
                    >
                      <CaretRight className={`${Math.ceil(totalDeparturesCount / 8) > 0 && pageDepartures < Math.ceil(totalDeparturesCount / 8) ? "text-brand-100" : "text-gray-300 "}`} />
                    </div>
                  </div>
                  <div
                    title="Resetar filtros"
                    className=" mb-2 flex items-center justify-center ml-2 bg-gray-100 h-10 w-10 rounded-md mr-2 hover:text-purple-600 cursor-pointer"
                    onClick={() => {
                      setDateFilterFrom("");
                      setStatusFilter(0);
                      setDateOptionFilter(0);
                      setDateFilterTo("");
                      setTypeDepartureFilter(undefined);
                    }}
                  >
                    <ArrowClockwise className="" />
                  </div>
                  <Select
                    placeholder="Tipo"
                    className="z-40  mr-2 mb-2 max-w-[25rem] min-w-[2rem] "
                    maxMenuHeight={200}
                    value={ departureTypes.filter((e,i)=>i==filterTypeDeparture).map((v, index) => ({ label: v, value: index }))}
                    onChange={(e) => {
                      e ? setTypeDepartureFilter(e.value) : null;
                      setPageDepartures(1);
                    }}
                    options={departureTypes.map((v, index) => ({ label: v, value: index }))}
                  />
                  <Select
                    placeholder="Status"
                    className="z-40  mr-2 max-w-[18rem]   mb-2 min-w-[2rem]"
                    maxMenuHeight={200}
                    onChange={(e) => {
                      e ? setStatusFilter(e.value) : null;
                      setPageDepartures(1);
                    }}
                    value={[
                      { value: 0, label: "Todos" },
                      { value: 2, label: "Agendado" },
                      { value: 3, label: "Iniciado" },
                      { value: 4, label: "Finalizado" },
                      { value: 1, label: "Aguardando" },
                    ].filter((el) => el.value == statusFilter)}
                    options={[
                      { value: 0, label: "Todos" },
                      { value: 2, label: "Agendado" },
                      { value: 3, label: "Iniciado" },
                      { value: 4, label: "Finalizado" },
                      { value: 1, label: "Aguardando" },
                    ].sort()}
                  />
                  <Select
                    placeholder="Filtro"
                    className="z-40   mr-2 max-w-[18rem] min-w-[2rem] mb-2 "
                    maxMenuHeight={200}
                    value={dateOptionFilter ? DateFilters.map((v, index) => ({ label: v, value: index }))[dateOptionFilter] : undefined}
                    onChange={(e) => {
                      e ? setDateOptionFilter(e.value) : null;
                      setPageDepartures(1);
                    }}
                    options={DateFilters.map((v, index) => ({ label: v, value: index }))}
                  />

                  <div className="h-[2.4rem] w-[52%] flex items-center mb-2 min-w-[20rem] max-w-[50rem]">
                    <div className="h-full w-[50%] bg-white rounded-sm flex items-center mr-2 ">
                      <input
                        type={"date"}
                        className="h-full w-full p-1 border-[1px] border-gray-300 rounded-md ml-2"
                        value={dateFilterFrom}
                        onChange={(e) => {
                          setDateFilterFrom(e.target.value);
                        }}
                      ></input>
                    </div>
                    <ArrowRight size={"2rem"} className="min-w-[1rem]" />
                    <div className="h-full w-[50%] bg-white rounded-sm flex items-center ml-2  ">
                      <input
                        type={"date"}
                        className="h-full w-full p-1 border-[1px] border-gray-300 rounded-md "
                        value={dateFilterTo}
                        onChange={(e) => {
                          setDateFilterTo(e.target.value);
                        }}
                      ></input>
                    </div>
                  </div>
                </div>
              </div>

              <div className={` h-14 bg-gray-100 w-full flex items-center  pl-6 pr-6 shadow-sm`}>
                {["Tipo", "Agendado para", "Iniciado em", "Finalizado em"].map((v, i) => {
                  return (
                    <div key={v} className={`flex-1 font-semibold`}>
                      {v}
                    </div>
                  );
                })}
              </div>
              <div className={`min-h-[20rem] max-h-[25rem] overflow-y-auto border-b-[1px] `}>
                {departures ? (
                  departures.length > 0 ? (
                    departures?.map((i, index) => {
                      return (
                        <Link key={i.id} to={"../calendario-afastamentos=" + i.id}>
                          <div className={`flex items-center justify-between pl-6 pr-6 h-[4rem] border-b-[1px]`}>
                            <div className={`flex-1`}>{i.type != null ? departureTypes[parseInt(i.type)] : null}</div>
                            <div className={`flex-1`}>
                              {moment(i.date_sche_ini, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]").format("DD/MM/YYYY")} <span className="pl-2 pr-2">até</span> {moment(i.date_sche_end, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]").format("DD/MM/YYYY")}
                            </div>
                            <div className={`flex-1`}>{i.date_ini ? moment(i.date_ini, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]").format("DD/MM/YYYY") : ""}</div>
                            <div className={`flex-1`}>{i.date_end ? moment(i.date_end, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]").format("DD/MM/YYYY") : ""}</div>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="w-full min-h-[20rem] flex items-center justify-center text-xl font-thin">
                      <Ghost size={"3rem"} weight={"thin"} className="mr-4" />
                      Nenhum afastamento encontrado.
                    </div>
                  )
                ) : null}
              </div>
              <div className={`min-h-[5rem] h-[90%] `}></div>
            </div>
            <div className={`absolute  right-6 bottom-6   flex items-center  `}></div>
          </div>
        </div>
      ) : null}
    </div>
  ) : !isLoadingPage ? (
    <div className=" w-full h-full  flex items-center justify-center">
      <div className="">
        <div className="flex items-center text-2xl">
          <Ghost weight="thin" size="5rem" className="mr-4" />
          Pagina não encontrada ou excluida.
        </div>
        <div
          onClick={() => {
            navigate(-1);
          }}
          className="w-full flex justify-center rounded-md h-10  items-center underline font-bold text-brand-100 hover:text-notify-500 cursor-pointer"
        >
          Voltar
        </div>
      </div>
    </div>
  ) : null;
}

/* <div>DEPARTURES:
        <div>
          {departures?.map((v, i) => {
            return <div key={v.id} className={`border-2 mt-2`}>
              <div>Data marcada:{v.date_sche_ini} - {v.date_sche_end}</div>
              <div>Tipo:{v.type}</div>
              <div>Data:{v.date_ini} - {v.date_end}</div>
              {v.date_ini && v.date_end && v.alterpendentdays ? <div>Dias pendentes: {(moment(v.date_sche_ini).diff(moment(v.date_ini), 'days') - moment(v.date_sche_end).diff(moment(v.date_end), 'days')) * -1}</div> : null}
            </div>
          })}
        </div>
      </div>

      <div>Reports:
        <div>
          {reports?.map((v, i) => {
            return <div key={v.id} className={`border-2 mt-2`}>
              <div>Nº report:{v.num_report}</div>
              <div>Tipo:{v.type}</div>
              <div>case:{v.case_id} </div>
              <div>status:{v.status} </div>
              <div>file:{v.file} </div>
            </div>
          })}
        </div>
      </div> */
