import moment from "moment";
import Select from "react-select";
import {
  AirplaneLanding,
  AirplaneTakeoff,
  AirplaneTilt,
  ArrowClockwise,
  ArrowRight,
  ArrowSquareOut,
  CaretLeft,
  CaretRight,
  Funnel,
  Info,
  MagnifyingGlass,
  Plus,
  X,
} from "phosphor-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { InputText } from "../../../components/InputText";
import { analystType, departureType } from "../../../components/Type/DataType";
import { UserContext } from "../../../hooks/UserContext";
import { api } from "../../../services/api";

import { Button } from "../../../components/Button";
import { DateFilters, departureTypes } from "../Constants";
import { ErrorCard } from "../../../components/ErrorCard";
import { DataCountContext } from "../../../hooks/DataCountContext";
import {
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
const calendar = [];
moment.locale("pt-br");

export function Calendar() {
  //const { logout } = useContext(UserContext);
  //const { isAuth } = useContext(UserContext);

  const query = new URLSearchParams(location.search);
  const locationState = useLocation();

  const [calendarDays, setCalendarDays] = useState<
    { d: number; m: number; y: number }[]
  >([]);
  const [dateCalendar, setDateCalendar] = useState<Date>();
  const [departures, setDepartures] = useState<departureType[]>([]);
  const [departureCurrentTab, setDepartureCurrentTab] = useState<string[][]>(
    []
  );
  const [searchDepartures, setSearchDepartures] = useState("");
  const [departureSelected, setDepartureSelected] = useState<departureType>();

  const [analystId, setAnalystId] = useState("");
  const [analystName, setAnalystName] = useState("");
  const [typeDeparture, setTypeDeparture] = useState<string | undefined>("");
  const [schedIni, setSchedIni] = useState("");
  const [schedIniTempHover, setSchedIniTempHover] = useState("");
  const [schedEnd, setSchedEnd] = useState("");
  const [departureIni, setDepartureIni] = useState("");
  const [departureEnd, setDepartureEnd] = useState("");

  //PEGAR
  const [dateOptionFilter, setDateOptionFilter] = useState<number | undefined>(
    undefined
  );
  const [statusFilter, setStatusFilter] = useState<number | undefined>(0);
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [isFilterActive, setFilterActive] = useState(false);

  const [selectedFromCurrentMonth, setFromCurrentMonth] = useState(false);
  const [departureCurrentMonth, setDepartureCurrentMonth] = useState<
    departureType[]
  >([]);
  const [analystList, setAnalystList] = useState<
    { label: string; value: number; id: string; days: number }[]
  >([]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [defineRealDepartureDate, setDefineRealDepartureDate] = useState(false);

  const [alterPendentDays, setAlterpendentDays] = useState(false);
  const [daysNotUsed, setDaysNotused] = useState(0);
  const [warning, setWarning] = useState<{
    errors: string[];
    status: "ok" | "info" | "error";
    timer: boolean;
  }>({ errors: [], status: "error", timer: false });

  const navigate = useNavigate();
  const [defStatusDeparture, setStatusDeparture] = useState(0);
  //
  const { resetAnalystCount } = useContext(DataCountContext);
  const [page, setPage] = useState(1);
  const [totalDepartures, setTotalDepartures] = useState(0);
  const { id } = useParams();

  const [years, setYears] = useState<{ label: string; value: number }[]>([]);
  const weekNames = ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sab."];
  const months = [
    { label: "Janeiro", value: 1 },
    { label: "Fevereiro", value: 2 },
    { label: "Março", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Maio", value: 5 },
    { label: "Junho", value: 6 },
    { label: "Julho", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Setembro", value: 9 },
    { label: "Outubro", value: 10 },
    { label: "Novembro", value: 11 },
    { label: "Dezembro", value: 12 },
  ];

  async function patch() {
    var data = {
      analyst_id: analystId != "" ? analystId : undefined,
      date_end: departureEnd
        ? moment(departureEnd, "DD/MM/YYYY").format(
            "YYYY-MM-DD[T][00]:[00]:[00].[000][Z]"
          )
        : null,
      date_ini: departureIni
        ? moment(departureIni, "DD/MM/YYYY").format(
            "YYYY-MM-DD[T][00]:[00]:[00].[000][Z]"
          )
        : null,
      alterpendentdays: daysNotUsed != 0 ? alterPendentDays : false,
    };

    if (id) {
      api
        .patch("departures/" + id, data, { withCredentials: true })
        .then((res) => {
          setCreating(false);
          setEditing(false);
          setDepartureSelected(res.data);
          navigate("../calendario-afastamentos=" + res.data.id);
          resetAnalystCount();
        })
        .catch((e) => {
          setWarning({
            errors: [e.response.data.message],
            status: "error",
            timer: false,
          });
        });
    }
  }

  async function create() {
    
    if (schedIni && schedEnd && analystId && typeDeparture) {
      var dataD = {
        analyst_id: analystId != "" ? analystId : undefined,
        date_sche_end: schedEnd
          ? moment(schedEnd, "DD/MM/YYYY").format(
              "YYYY-MM-DD[T][00]:[00]:[00].[000][Z]"
            )
          : undefined,
        date_sche_ini: schedIni
          ? moment(schedIni, "DD/MM/YYYY").format(
              "YYYY-MM-DD[T][00]:[00]:[00].[000][Z]"
            )
          : undefined,
        date_end: departureEnd
          ? moment(departureEnd, "DD/MM/YYYY").format(
              "YYYY-MM-DD[T][00]:[00]:[00].[000][Z]"
            )
          : undefined,
        date_ini: departureIni
          ? moment(departureIni, "DD/MM/YYYY").format(
              "YYYY-MM-DD[T][00]:[00]:[00].[000][Z]"
            )
          : undefined,
        alterpendentdays: daysNotUsed != 0 ? alterPendentDays : false,
        type: typeDeparture ? parseInt(typeDeparture) : undefined,
      };

      await api
        .post("departures", dataD, {
          withCredentials: true,
          params: { allowPendentDays: true },
        })
        .then((res: { data: departureType }) => {
          setCreating(false);
          setEditing(false);
          setDepartureSelected(res.data);
          navigate("../calendario-afastamentos=" + res.data.id);
          handleGetDeparturesFromMonth(new Date(res.data.date_sche_ini));
          handleGetAllDepartures();
          resetAnalystCount();
        })
        .catch((e) => {
          setWarning({
            errors: [e.response.data.message],
            status: "error",
            timer: false,
          });
        });
    } else {
      setWarning({
        errors: ["Existem campos que precisam ser preenchidos"],
        status: "error",
        timer: false,
      });
    }
  }

  async function del() {
    await api
      .delete("departures/" + id, { withCredentials: true })
      .then((res) => {
        navigate("../calendario-afastamentos",{replace:true});
        setCreating(false);
        setEditing(false);
        handleGetDeparturesFromMonth(new Date(res.data.date_sche_ini));
        resetAnalystCount();
        setPage(1)
        setDepartureSelected(undefined)
      })
      .catch((e) => {
        setWarning({
          errors: [e.response.data.message],
          status: "error",
          timer: false,
        });
      });
  }

  async function getAnalysts() {
    await api
      .get("analysts", {
        withCredentials: true,
        params: {
          searchData: "",
          status: 9,
          countOnly: false,
          page: 1,
        },
      })
      .then((res: { data: [analystType[], number] }) => {
        let auxAnalyst = res.data[0].map((a, index) => ({
          label: a.name,
          value: index,
          id: a.id,
          days: a.pending_vacation_days,
        }));
        setAnalystList(auxAnalyst);
      });
  }

  function clearFields() {
    setAnalystName("");
    setAnalystId(""), setSchedIni("");
    setSchedEnd("");
    setDepartureIni("");
    setDepartureEnd("");
    setTypeDeparture("");
    setAlterpendentDays(false);
  }

  function fetchVariables() {
    if (departureSelected) {
      setAnalystId(
        departureSelected != null ? departureSelected.analyst.id : ""
      );
      setAnalystName(
        departureSelected != null ? departureSelected.analyst.name : ""
      );
      setTypeDeparture(departureSelected != null ? departureSelected.type : "");
      setSchedIni(
        departureSelected != null
          ? moment(
              departureSelected.date_sche_ini,
              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            ).format("DD/MM/YYYY")
          : ""
      );
      setSchedEnd(
        departureSelected != null
          ? moment(
              departureSelected.date_sche_end,
              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            ).format("DD/MM/YYYY")
          : ""
      );
      setDepartureIni(
        departureSelected != null
          ? departureSelected.date_ini
            ? moment(
                departureSelected.date_ini,
                "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
              ).format("DD/MM/YYYY")
            : ""
          : ""
      );
      setDepartureEnd(
        departureSelected != null
          ? departureSelected.date_end
            ? moment(
                departureSelected.date_end,
                "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
              ).format("DD/MM/YYYY")
            : ""
          : ""
      );
      setAlterpendentDays(departureSelected.alterpendentdays);
    }
  }

  // Essa função carrega os dias (números) do calendário
  function loadCalendarDays(d?: Date) {
    let dates = [];

    const date = d ? moment(d) : moment(dateCalendar);

    let startDay = date.clone().startOf("month").startOf("week");
    let endDay = date.clone().endOf("month").endOf("week");

    let calc = endDay.diff(startDay, "days");
    if (calc < 35) {
      endDay.add(1, "weeks");
    }
    while (startDay <= endDay) {
      dates.push({
        d: startDay.date(),
        m: startDay.month() + 1,
        y: startDay.year(),
      });
      startDay = startDay.add(1, "days");
    }
    setCalendarDays(dates);
  }

  async function handleGetAllDepartures() {
    await api
      .get("departures", {
        withCredentials: true,
        params: {
          order: "asc",
          countOnly: false,
          searchData: searchDepartures,
          status: query.get("status") ? query.get("status") : 0,
          dateFilter: dateOptionFilter != 0 ? dateOptionFilter : undefined,
          dateFilterFrom:
            dateFromFilter != ""
              ? moment(dateFromFilter).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ")
              : undefined,
          dateFilterTo:
            dateToFilter != ""
              ? moment(dateToFilter).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ")
              : undefined,
          page: page,
        },
      })
      .then(async (res: { data: [number, departureType[]] }) => {
        setDepartures(res.data[1]);
        setTotalDepartures(res.data[0]);
        
      })
      .catch((e) => {
        
        setWarning({
          errors: ["Erro na busca dos afastamentos."],
          status: "error",
          timer: false,
        });
      });
  }

  async function handleGetDeparture(){

    await api.get("departures/"+id,{withCredentials:true}).then((res)=>{
        
        
        setDepartureSelected(res.data);
       
        setDateCalendar(
          new Date(
            moment(res.data.date_sche_ini).format("YYYY-MM-DD")
          )
        );
        
        loadCalendarDays(
          new Date(
            moment(res.data.date_sche_ini).format("YYYY-MM-DD")
          )
        );
        
        setDepartureCurrentTab([
          [
            moment(res.data.date_sche_ini).format("YYYY-MM-DD"),
            moment(res.data.date_sche_end).format("YYYY-MM-DD"),
            id,
            res.data.analyst.name,
          ],
        ]);

        handleGetDeparturesFromMonth(
          new Date(
            moment(res.data.date_sche_ini).format("YYYY-MM-DD")
          )
        );

  
    }).catch((e)=>{
      setWarning({
        errors: ["Erro para localizar afastamento."],
        status: "error",
        timer: false,
      });
    })
  }

  async function handleGetDeparturesFromMonth(d: Date) {
    let startDay = moment(d).clone().startOf("month").startOf("week");
    let endDay = moment(d).clone().endOf("month").endOf("week");
    let calc = endDay.diff(startDay, "days");
    if (calc < 35) {
      endDay.add(1, "weeks");
    }

    console.log("INICIO:",moment(startDay).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"))
    console.log("FIM:",moment(endDay).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"))

    await api
      .get("departures", {
        withCredentials: true,
        params: {
          order: "asc",
          countOnly: false,
          searchData: "",
          status: 0,
          dateFrom: moment(startDay).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
          dateTo: moment(endDay).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
          page: 0,
        },
      })
      .then((res: { data: [number, departureType[]] }) => {
        setDepartureCurrentMonth(res.data[1]);
        console.log(res.data)
      })
      .catch((e) => {
        setWarning({
          errors: e.response.data.message,
          status: "error",
          timer: false,
        });
      });
  }

  function changeMonth(d: "l" | "r") {
    if (d == "l") {
      setDateCalendar(
        new Date(moment(dateCalendar).add(-1, "months").format())
      );
      handleGetDeparturesFromMonth(
        new Date(moment(dateCalendar).add(-1, "months").format())
      );
    } else if (d == "r") {
      setDateCalendar(new Date(moment(dateCalendar).add(1, "months").format()));
      handleGetDeparturesFromMonth(
        new Date(moment(dateCalendar).add(1, "months").format())
      );
    }
    loadCalendarDays();
  }

  async function handleGetSelectedDeparture() {
    await api
      .get("departures/" + id, { withCredentials: true })
      .then((resSelected) => {
        setDepartureSelected(resSelected.data);
        selectDeparture(resSelected.data);
        setDepartureCurrentTab([
          [
            moment(resSelected.data.date_sche_ini).format("YYYY-MM-DD"),
            moment(resSelected.data.date_sche_end).format("YYYY-MM-DD"),
            id,
            resSelected.data.analyst.name,
          ],
        ]);
      })
      .catch((e) => {
        setWarning({
          errors: ["Erro enquanto selecionada um afastamento."],
          status: "error",
          timer: false,
        });
      });
  }

  function selectDeparture(dep?: departureType) {
    navigate("../calendario-afastamentos=" + dep?.id);
    if (dep != undefined) {
      setDepartureSelected(dep);
      if (departures.length > 0) {
        setDateCalendar(new Date(moment(dep.date_sche_ini).format()));
        loadCalendarDays(new Date(moment(dep.date_sche_ini).format()));
        handleGetDeparturesFromMonth(
          new Date(moment(dep.date_sche_ini).format())
        );
      }
    }
  }

  function calcDaysNotused() {
    setDaysNotused(
      moment(schedIni, "DD/MM/YYYY").diff(
        moment(departureIni, "DD/MM/YYYY"),
        "days"
      ) -
        moment(schedEnd, "DD/MM/YYYY").diff(
          moment(departureEnd, "DD/MM/YYYY"),
          "days"
        )
    );
  }

  useEffect(() => {
    if (departureIni && departureEnd) {
      //Positivo o analista usou a mais, e negativo ele usou de menos
      calcDaysNotused();
    } else {
      setDaysNotused(0);
    }
  }, [departureIni, departureEnd]);

  useEffect(() => {
    getAnalysts();
    handleGetDeparturesFromMonth(dateCalendar ? dateCalendar : new Date());
  }, []);

  useEffect(() => {
    loadCalendarDays();
    fetchVariables();
    if (id && id != "novo" && !departureSelected) {
      handleGetSelectedDeparture();
    }
  }, [
    dateCalendar,
    departureSelected,
    departureCurrentMonth,
    page,
    id,
    locationState,
  ]);

  useEffect(() => {
    if(query.get('status')!=null){
      //@ts-ignore
      setStatusFilter(parseInt(query.get('status')))
    }
    handleGetAllDepartures();
    if(id && id!="novo"){
      handleGetDeparture()
    }
  }, [page, dateFromFilter, dateToFilter, statusFilter, dateOptionFilter]);//MODIFICADO - apaguei ID

  const FilterDeparture = () => {
    return (
      <div>
        <div className="border-b-[1px] pb-2 pl-2 pr-4 mb-2">
          <div className="w-full flex h-12 ">
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
          <Select
            placeholder="Tipo de periodo"
            className="z-50 w-full pl-6 pr-2"
            maxMenuHeight={200}
            value={
              DateFilters.map((v, index) => ({
                label: v,
                value: index,
              })).filter((d) => d.value == dateOptionFilter)[0]
            }
            onChange={(e) => {
              setDateOptionFilter(e?.value);
              setPage(1);
            }}
            options={DateFilters.map((v, index) => ({
              label: v,
              value: index,
            }))}
          />
        </div>
        <div className="w-full flex h-12 border-b-[1px] pb-2 pl-2 pr-4 ">
          <Select
            placeholder="Status"
            className="z-40 w-full pl-6 pr-2"
            maxMenuHeight={200}
            value={
              query.get("status") != (null && undefined)? [
              { value: 0, label: "Todos" },
              { value: 2, label: "Agendado" },
              { value: 3, label: "Iniciado" },
              { value: 4, label: "Finalizado" },
              { value: 1, label: "Aguardando" },
            ]
              .sort().filter((e) => String(e.value) == query.get("status"))
            : undefined}

            onChange={(e) => {
              query.set("status", String(e?.value));
              navigate("/calendario-afastamentos?" + query, { replace: true });
              setStatusFilter(e?.value);
              setPage(1);
            }}
            options={[
              { value: 0, label: "Todos" },
              { value: 2, label: "Agendado" },
              { value: 3, label: "Iniciado" },
              { value: 4, label: "Finalizado" },
              { value: 1, label: "Aguardando" },
            ].sort()}
          />
        </div>

        <div className="w-full flex h-8 pl-2 pr-4 pb-2 mt-2 justify-center items-center">
          <span
            onClick={() => {
              setDateFromFilter("");
              setDateToFilter("");
              setStatusFilter(undefined);
              setDateOptionFilter(undefined);
              navigate("/calendario-afastamentos", { replace: true });
            }}
            className="group font-semibold hover:text-notify-500 flex items-center cursor-pointer"
          >
            Resetar filtros{" "}
            <ArrowClockwise
              size={"15px"}
              className="ml-2 group-hover:text-notify-500"
            />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full w-full  rounded-md   flex-row overflow-y-auto `}>
      {/*@ts-ignore*/}
      {warning.errors ? (
        warning.errors.length >= 1 ? (
          <ErrorCard
            errors={warning?.errors}
            setErrors={setWarning}
            status={warning?.status}
            timer={warning.timer ? 1500 : 0}
          />
        ) : null
      ) : null}
      <div className="flex w-full  min-h-[32rem]  flex-1 ">
        <div className=" w-full min-h-[32rem]   rounded-md  relative  bg-white  ">
          {/* Gerando as tab's de cada um dos dias da semana */}
          <div className="h-[3.5rem] w-full flex justify-between items-center  bg-gray-50">
            {weekNames.map((v) => {
              return (
                <span key={v} className="noselect flex-1 justify-center flex ">
                  {v}
                </span>
              );
            })}
          </div>

          {/* Gerando a grid dos dias da semana */}
          <div className=" h-[75vh] w-full grid grid-cols-7 overflow-y-auto border-collapse">
            {calendarDays.map((v, index) => {
              return (
                <div
                  key={index}
                  onMouseOver={() => {
                    if (schedEnd == "") {
                      setSchedIniTempHover(
                        moment(
                          "" + v.y + "-" + v.m + "-" + v.d,
                          "YYYY-MM-DD"
                        ).format("DD/MM/YYYY")
                      );
                    }
                  }}
                  className={`w-full min-h-[12vh] h-full  border-[1px] 
                                ${
                                  creating
                                    ? schedEnd == "" &&
                                      moment(
                                        "" + v.y + "-" + v.m + "-" + v.d,
                                        "YYYY-M-DD"
                                      ).isBetween(
                                        moment(schedIni, "DD/MM/YYYY"),
                                        moment(schedIniTempHover, "DD/MM/YYYY")
                                      )
                                      ? "hover:border-notify-500  border-brand-100 "
                                      : "hover:border-brand-100 border-gray-50"
                                    : "border-gray-50 hover:border-gray-200"
                                }
                        
                                    `}
                  onClick={(e) => {
                    if (
                      schedIni != "" &&
                      creating &&
                      moment(
                        "" + v.y + "-" + v.m + "-" + v.d,
                        "YYYY-M-DD"
                      ).isAfter(moment(schedIni, "DD/MM/YYYY"))
                    ) {
                      setSchedEnd(
                        moment(
                          "" + v.y + "-" + v.m + "-" + v.d,
                          "YYYY-M-DD"
                        ).format("DD/MM/YYYY")
                      );
                      //setDepartureEnd(moment("" + v.y + "-" + v.m + "-" + v.d, 'YYYY-M-DD').format("DD/MM/YYYY"))
                    } else if (
                      (schedIni == "" && schedEnd == "" && creating) ||
                      (creating &&
                        schedIni != "" &&
                        moment(
                          "" + v.y + "-" + v.m + "-" + v.d,
                          "YYYY-M-DD"
                        ).isBefore(moment(schedIni, "DD/MM/YYYY")))
                    ) {
                      setSchedIni(
                        moment(
                          "" + v.y + "-" + v.m + "-" + v.d,
                          "YYYY-M-DD"
                        ).format("DD/MM/YYYY")
                      );
                      //setDepartureIni(moment("" + v.y + "-" + v.m + "-" + v.d, 'YYYY-M-DD').format("DD/MM/YYYY"))
                    }
                    /**( creating && schedIni!="" &&   */
                  }}
                >
                  <div className={` w-full  flex `}>
                    <div
                      className={` noselect w-full h-full flex items-start justify-end font-text-base ${
                        moment(dateCalendar).month() + 1 != v.m
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      <div
                        className={`h-6 w-full justify-end flex items-center   p-1  
                                             ${
                                               schedIni != "" &&
                                               !moment(
                                                 "" +
                                                   v.y +
                                                   "-" +
                                                   v.m +
                                                   "-" +
                                                   v.d,
                                                 "YYYY-MM-DD"
                                               ).diff(
                                                 moment(schedIni, "DD/MM/YYYY")
                                               ) &&
                                               (creating || editing)
                                                 ? "bg-brand-100  text-white rounded-l-full  ml-[80%]"
                                                 : ""
                                             }
                                                ${
                                                  schedEnd != "" &&
                                                  !moment(
                                                    "" +
                                                      v.y +
                                                      "-" +
                                                      v.m +
                                                      "-" +
                                                      v.d,
                                                    "YYYY-MM-DD"
                                                  ).diff(
                                                    moment(
                                                      schedEnd,
                                                      "DD/MM/YYYY"
                                                    )
                                                  ) &&
                                                  (creating || editing)
                                                    ? "bg-brand-100 rounded-r-full text-white "
                                                    : ""
                                                }
                                                ${
                                                  moment(
                                                    "" +
                                                      v.y +
                                                      "-" +
                                                      v.m +
                                                      "-" +
                                                      v.d,
                                                    "YYYY-MM-DD"
                                                  ).isBetween(
                                                    moment(
                                                      schedIni,
                                                      "DD/MM/YYYY"
                                                    ),
                                                    moment(
                                                      schedEnd,
                                                      "DD/MM/YYYY"
                                                    )
                                                  ) &&
                                                  (creating || editing)
                                                    ? "bg-brand-100  text-white "
                                                    : ""
                                                }
                                                ${
                                                  !moment(
                                                    "" +
                                                      v.y +
                                                      "-" +
                                                      v.m +
                                                      "-" +
                                                      v.d,
                                                    "YYYY-MM-DD"
                                                  ).diff(
                                                    moment(
                                                      departureIni,
                                                      "DD/MM/YYYY"
                                                    )
                                                  ) &&
                                                  departureIni != "" &&
                                                  (creating || editing)
                                                    ? " font-bold bg-notify-500 rounded-l-full text-white ml-[80%]"
                                                    : ""
                                                }
                                                ${
                                                  !moment(
                                                    "" +
                                                      v.y +
                                                      "-" +
                                                      v.m +
                                                      "-" +
                                                      v.d,
                                                    "YYYY-MM-DD"
                                                  ).diff(
                                                    moment(
                                                      departureEnd,
                                                      "DD/MM/YYYY"
                                                    )
                                                  ) &&
                                                  departureEnd != "" &&
                                                  (creating || editing)
                                                    ? " font-bold bg-notify-500 rounded-r-full text-white"
                                                    : ""
                                                }
                                                `}
                      >
                        {v.d}
                      </div>
                    </div>
                  </div>
                  <div className=" w-full">
                    {departureCurrentMonth.length > 0
                      ? departureCurrentMonth
                          .sort()
                          .map((dep: departureType, indexDep) => {
                            return moment(
                              "" + v.y + "-" + v.m + "-" + v.d,
                              "YYYY-MM-DD"
                            ).isBetween(
                              moment(
                                dep.date_sche_ini,
                                "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                              ),
                              moment(
                                dep.date_sche_end,
                                "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                              )
                            ) ||
                              moment(
                                dep.date_sche_ini,
                                "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                              ).isSame(
                                moment(
                                  "" + v.y + "-" + v.m + "-" + v.d,
                                  "YYYY-MM-DD"
                                )
                              ) ||
                              moment(
                                dep.date_sche_end,
                                "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                              ).isSame(
                                moment(
                                  "" + v.y + "-" + v.m + "-" + v.d,
                                  "YYYY-MM-DD"
                                )
                              ) ? (
                              <div
                                key={dep.id}
                                onClick={() => {
                                  if (!creating && !editing) {
                                    setCreating(false);
                                    setDepartureSelected(dep);
                                    navigate(
                                      "../calendario-afastamentos=" + dep?.id
                                    );
                                    setFromCurrentMonth(true);
                                  }
                                }}
                                className={` h-[2vh] shadow-md  mt-[0.5px] overflow-hidden  flex text-xs  justify-center items-center text-gray-500
                                                        ${
                                                          !creating && !editing
                                                            ? "cursor-pointer"
                                                            : null
                                                        }   
                                                        ${
                                                          departureSelected?.id ==
                                                          dep.id
                                                            ? "bg-brand-100"
                                                            : "bg-gray-50"
                                                        }
                                                        ${
                                                          !moment(
                                                            "" +
                                                              v.y +
                                                              "-" +
                                                              v.m +
                                                              "-" +
                                                              v.d,
                                                            "YYYY-MM-DD"
                                                          ).diff(
                                                            moment(
                                                              dep.date_sche_ini,
                                                              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                                                            ).format(
                                                              "YYYY-MM-DD"
                                                            )
                                                          )
                                                            ? `rounded-l-full  ${
                                                                departureSelected?.id ==
                                                                dep.id
                                                                  ? "border-notify-500"
                                                                  : "border-brand-100"
                                                              }`
                                                            : "w-full"
                                                        }
                                                        ${
                                                          !moment(
                                                            "" +
                                                              v.y +
                                                              "-" +
                                                              v.m +
                                                              "-" +
                                                              v.d,
                                                            "YYYY-MM-DD"
                                                          ).diff(
                                                            moment(
                                                              dep.date_sche_end,
                                                              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                                                            ).format(
                                                              "YYYY-MM-DD"
                                                            )
                                                          )
                                                            ? "rounded-r-full  "
                                                            : "w-full"
                                                        }
                                                        
                                                        `}
                              >
                                {dep.analyst.name.split(" ")[0]}
                                {departureSelected?.id == dep.id ? (
                                  <div>
                                    {" "}
                                    <AirplaneTilt className="ml-2 text-white" />
                                  </div>
                                ) : null}
                              </div>
                            ) : null;
                          })
                      : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {
          <div className="bg-white ml-2  rounded-md w-[60%]">
            {/* Navegador do calendario com mes e ano */}
            <div className="flex items-center w-full h-[6vh] shadow-sm justify-center ">
              <CaretLeft
                size={"40%"}
                className="text-lightBlack-100 cursor-pointer h-8 w-8 rounded-full p-1 hover:bg-slate-100"
                onClick={() => {
                  changeMonth("l");
                }}
              />
              <div className="noselect flex w-[15rem] text-xl justify-center">
                {months[moment(dateCalendar).month()].label}
                {" " + moment(dateCalendar).year()}
              </div>
              <CaretRight
                size={"40%"}
                className="text-lightBlack-100 cursor-pointer h-8 w-8 rounded-full p-1 hover:bg-slate-100 "
                onClick={() => {
                  changeMonth("r");
                }}
              />
            </div>

            {/* BArra de pesquisa , de novo afastamento e botões de paginação */}
            <div>
              {!departureSelected && creating == false && editing == false ? (
                <>
                  <div className="noselect shadow-sm min-h-[4rem]  h-[6vh] p-2 flex">
                    {/* Barra de pesquisa */}
                    <InputText
                      iconInput={<MagnifyingGlass />}
                      placeholder={"Pesquise aqui.."}
                      input={searchDepartures}
                      setInput={setSearchDepartures}
                      onEnter={handleGetAllDepartures}
                    />

                    {/* Botão de criar novo  */}
                    <div
                      className="w-[6rem] h-10  rounded-md bg-gray-100 text-lightBlack-10 flex justify-center items-center ml-4 cursor-pointer  hover:ring-[0.1rem] ring-brand-100"
                      onClick={() => {
                        setCreating(true);
                        clearFields();
                      }}
                    >
                      <Plus size={"20px"} />
                    </div>

                    {/* Botão de criar novo  */}
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
                          className={`cursor-pointer h-10 w-[6rem] ml-4 ${
                            dateFromFilter ||
                            dateToFilter ||
                            statusFilter ||
                            dateOptionFilter
                              ? "bg-brand-100 text-white"
                              : "bg-gray-100"
                          } rounded-md flex items-center justify-center`}
                        >
                          <Funnel />
                        </div>
                      </PopoverHandler>
                      <PopoverContent
                        className={`rounded-md h-[13rem] pb-2 pt-4  w-[30rem] shadow-md p-0 duration-75 ml-2 border-[1px] } `}
                      >
                        <FilterDeparture />
                      </PopoverContent>
                    </Popover>

                    {/* botões de paginação */}
                    <div className="rounded-md  w-32  h-10 ml-4 flex">
                      <div
                        className="bg-gray-100 h-10 w-10  rounded-l-md flex items-center justify-center cursor-pointer hover:bg-opacity-50"
                        onClick={() => {
                          page > 1 ? setPage(page - 1) : null;
                        }}
                      >
                        <CaretLeft
                          className={`${
                            Math.ceil(totalDepartures / 8) > 0 && page > 1
                              ? "text-brand-100"
                              : "text-gray-300 "
                          }`}
                        />
                      </div>
                      <div className="bg-white w-10 h-10 ml-2  flex items-center justify-center">
                        {page}/
                        {totalDepartures / 8 > 0
                          ? Math.ceil(totalDepartures / 8)
                          : 1}
                      </div>
                      <div
                        className="bg-gray-100 h-10 w-10 ml-2 rounded-r-md flex items-center justify-center hover:bg-opacity-50 cursor-pointer"
                        onClick={() => {
                          page < Math.ceil(totalDepartures / 8)
                            ? setPage(page + 1)
                            : null;
                        }}
                      >
                        <CaretRight
                          className={`${
                            Math.ceil(totalDepartures / 8) > 0 &&
                            page < Math.ceil(totalDepartures / 8)
                              ? "text-brand-100"
                              : "text-gray-300 "
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Títulos da lista de analistas e afastamentos */}
                  <div className="noselect h-[6vh]  bg-gray-100 flex justify-between items-center pl-6 shadow-sm">
                    <span className="flex-1 max-w-[8rem]">Analista</span>
                    <span className="flex-1">Agendado</span>
                    <span className="flex-1">Tipo</span>
                    <span className="flex-1">Status</span>
                  </div>

                  {/* Lista de afastamentos */}
                  <div
                    className={`flex-row overflow-y-auto   
                                lg:h-[17rem] #lg:bg-pink-50 
                                xl:h-[18rem] #xl:bg-blue-50
                                2xl:h-[30rem] #2xl:bg-green-50`}
                  >
                    {departures.map((v:departureType, index) => {
                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            selectDeparture(v);
                            
                          }}
                          className="noselect w-full border-b-[1px] pt-3  p-2 pl-4 flex cursor-pointer hover:bg-slate-50 "
                        >
                          <div className="flex-1 max-w-[8rem]">
                            {" "}
                            {v.analyst.name.split(" ")[0]}
                            {v.analyst.name.split(" ").length > 1
                              ? " " + v.analyst.name.split(" ")[1][0] + "."
                              : null}
                          </div>
                          <div className="flex-1 ">
                            <div
                              className=" flex flex-wrap items-center
                                        "
                            >
                              <div className="font-semibold bg-gray-100  rounded-md p-1  border-b-[2px] border-b-brand2-100 w-fit ">
                                {moment(
                                  v.date_sche_ini,
                                  "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                                ).format("DD/MM/YY")}
                              </div>
                              <ArrowRight />
                              <div className="font-semibold bg-gray-100  rounded-md p-1  border-b-[2px] border-b-brand2-100 w-fit ">
                                {moment(
                                  v.date_sche_end,
                                  "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                                ).format("DD/MM/YY")}
                              </div>
                            </div>
                          </div>
                          <div className="pl-2 flex-1 justify-start">
                            {departureTypes[parseInt(v.type)]}
                          </div>
                          <div className="pl-2 w-[30%]">
                            {v.date_ini != null
                              ? v.date_end != null
                                ? "Finalizado"
                                : "Iniciado"
                              : "Agendado"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Tela de criação e edição de um afastamento */
                <div className="overflow-y-auto min-h-[32rem]">
                  <div className=" min-h-[3rem] justify-between flex items-center pl-4 pr-4 shadow-sm ">
                    {/* <Button text="Novo" className="w-[20%] rounded-md h-full" /> */}
                    <div className="noselect text-lg font-semibold ">
                      Informações do afastamento
                    </div>
                    <X
                      size={"1.9rem"}
                      weight={"bold"}
                      className="cursor-pointer  bg-gray-100 p-1 rounded-md text-lightBlack-100 hover:bg-opacity-60 h-full"
                      onClick={() => {
                        setDepartureSelected(undefined),
                          setCreating(false),
                          setEditing(false),
                          setDaysNotused(0),
                          navigate("../calendario-afastamentos");
                      }}
                    />
                  </div>
                  <div className="flex-row p-6 ">
                    <span className="font-semibold"> Agendar:</span>
                    <div className="flex h-15 w-[100%] rounded items-center justify-between mt-2">
                      <div className=" w-[50%] flex items-center h-full  f">
                        <div className="border-[1px] min-h-[2.5rem] border-brand-100 h-[4vh] w-full rounded-md  pl-2  text-brand-100 font-thin flex items-center ">
                          <span className=" noselect ">De:</span>{" "}
                          <input
                            type={"date"}
                            disabled={!creating}
                            value={moment(schedIni, "DD/MM/YYYY").format(
                              "YYYY-MM-DD"
                            )}
                            onChange={(e) => {
                              setSchedEnd(
                                moment(e.target.value)
                                  .add(1, "days")
                                  .format("DD/MM/YYYY")
                              );
                              setSchedIni(
                                moment(e.target.value).format("DD/MM/YYYY")
                              );
                              setDateCalendar(new Date(e.target.value));
                              handleGetDeparturesFromMonth(
                                new Date(e.target.value)
                              );
                            }}
                            className="ml-[0.3vw] font-semibold outline-0 cursor-pointer   bg-transparent  mr-2 w-full"
                          />
                          {creating ? (
                            <div
                              className="h-[40%] w-10 border-l-[1px] flex items-center justify-center cursor-pointer"
                              onClick={() => {
                                setSchedIni("");
                              }}
                            >
                              {" "}
                              <X />
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="w-[10%] flex justify-center">
                        <ArrowRight size={"25px"} />
                      </div>
                      <div className=" w-[48%] flex items-center h-full ">
                        <div className="border-[1px] min-h-[2.5rem] border-brand-100 h-[4vh] w-full rounded-md  text-brand-100 pl-2 font-thin flex items-center">
                          <span className=" noselect">Até:</span>
                          <input
                            disabled={!creating}
                            type={"date"}
                            value={moment(schedEnd, "DD/MM/YYYY").format(
                              "YYYY-MM-DD"
                            )}
                            onChange={(e) => {
                              setSchedEnd(
                                moment(e.target.value).format("DD/MM/YYYY")
                              );
                            }}
                            className="ml-[0.3vw] font-semibold  bg-transparent outline-0 cursor-pointer  mr-2 w-full"
                          />
                          {creating ? (
                            <div
                              className="h-[40%] w-10 border-l-[1px] flex items-center justify-center cursor-pointer "
                              onClick={() => {
                                setSchedEnd("");
                              }}
                            >
                              {" "}
                              <X />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {schedEnd != "" &&
                    schedIni != "" &&
                    analystId &&
                    (editing||creating) &&
                    
                    typeDeparture == "0" &&
                    moment(schedEnd, "DD/MM/YYYY").diff(
                      moment(schedIni, "DD/MM/YYYY"),
                      "days"
                    ) +
                      1 >
                      analystList.filter((a) => a.id == analystId)[0].days ? (
                      <span className="text-notify-500 font-medium flex items-center">
                        {" "}
                        <Info className="mr-2" size={"1.3rem"} />O analista tem
                        um total de{" "}
                        {analystList.filter((a) => a.id == analystId)[0].days}{" "}
                        dias. Você selecionou um periodo de{" "}
                        {moment(schedEnd, "DD/MM/YYYY").diff(
                          moment(schedIni, "DD/MM/YYYY"),
                          "days"
                        ) + 1}{" "}
                        dias.
                      </span>
                    ) : null}
                    {creating ? (
                      <Select
                        placeholder="Analista"
                        className=" flex-1 z-50 mt-3"
                        maxMenuHeight={200}
                        options={analystList}
                        isClearable={true}
                        isDisabled={!creating && !editing}
                        onChange={(e) => {
                          setAnalystId(e ? e.id : "");
                        }}
                      />
                    ) : (
                      <div className="h-10 w-full bg-gray-50  flex-1 mt-6 rounded-md border-[1px] border-brand-100 flex items-center pl-3 justify-between ">
                        <div>
                          <Link to={"../analistas=" + analystId}>
                            {analystName}
                          </Link>
                        </div>
                        <Link to={"../analistas=" + analystId}>
                          <ArrowSquareOut className="mr-2" />{" "}
                        </Link>
                      </div>
                    )}

                    <div className="flex items-end h-fit mt-6 ">
                      {creating ? (
                        <Select
                          placeholder="Tipo de afastamento"
                          className="z-40 w-full"
                          maxMenuHeight={200}
                          isClearable={true}
                          isDisabled={!creating && !editing}
                          onChange={(e) => {
                            setTypeDeparture(String(e?.value));
                          }}
                          options={departureTypes.map((v, index) => ({
                            value: index,
                            label: v,
                          }))}
                        />
                      ) : (
                        //@ts-ignore
                        <div className="h-fit w-full bg-gray-100 p-2 rounded-md border-[1px] border-brand-100">
                          {departureTypes[typeDeparture?parseInt(typeDeparture):0]}
                        </div>
                      )}
                    </div>

                    {creating ? (
                      <div className="mt-2  font-semibold flex items-center">
                        <input
                          checked={defineRealDepartureDate}
                          onChange={(e) => {
                            setDefineRealDepartureDate(e.target.checked);
                            if (e.target.checked) {
                              setDepartureIni(schedIni);
                              setDepartureEnd(schedEnd);
                            } else {
                              setDepartureIni("");
                              setDepartureEnd("");
                            }
                          }}
                          type={"checkbox"}
                          className="h-4 w-4 accent-brand-100 mr-2"
                        />
                        Definir data de afastamento
                      </div>
                    ) : null}
                    <div
                      className={`mt-4 ${
                        !defineRealDepartureDate && creating ? "h-0" : ""
                      } overflow-hidden`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold w-[50%] flex items-center">
                          {" "}
                          Inicio: <AirplaneTakeoff className="ml-2" />
                        </span>
                        <span className="font-semibold w-[50%] flex items-center">
                          {" "}
                          Fim:
                          <AirplaneLanding className="ml-2" />
                        </span>
                      </div>
                      <div className="flex h-15 w-[100%] rounded items-center justify-between mt-2">
                        <div className=" w-[50%] flex items-center h-full  f">
                          <div
                            className={`border-[1px] min-h-[2.5rem] ${
                              departureIni
                                ? "border-green-500"
                                : "border-notify-500"
                            } h-[4vh] w-full rounded-md  pl-2  text-brand-100 font-thin flex items-center `}
                          >
                            <span className=" noselect ">De:</span>{" "}
                            <input
                            onDoubleClick={()=>{
                              setDepartureIni(schedIni)
                            }}
                              disabled={!creating && !editing}
                              type={"date"}
                              value={
                                departureIni != ""
                                  ? moment(departureIni, "DD/MM/YYYY").format(
                                      "YYYY-MM-DD"
                                    )
                                  : ""
                              }
                              onChange={(e) => {
                                setDepartureIni(
                                  e
                                    ? e.target.value
                                      ? moment(e.target.value).format(
                                          "DD/MM/YYYY"
                                        )
                                      : ""
                                    : ""
                                );
                              }}
                              className="ml-[0.3vw] font-semibold  bg-transparent outline-0 cursor-pointer  mr-2 w-full"
                            />
                            {creating || editing ? (
                              <div
                                className="h-[40%] w-10 border-l-[1px] flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                  setDepartureIni("");
                                }}
                              >
                                {" "}
                                <X />
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="w-[10%] flex justify-center">
                          <ArrowRight size={"25px"} />
                        </div>
                        <div className=" w-[48%] flex items-center h-full ">
                          <div
                            className={`border-[1px] min-h-[2.5rem] ${
                              departureEnd
                                ? "border-green-500"
                                : "border-notify-500"
                            } h-[4vh] w-full rounded-md  text-brand-100 pl-2 font-thin flex items-center`}
                          >
                            <span className=" noselect">Até:</span>
                            <input
                            onDoubleClick={()=>{
                              setDepartureEnd(schedEnd)
                            }}
                              disabled={!creating && !editing}
                              type={"date"}
                              value={
                                departureEnd != ""
                                  ? moment(departureEnd, "DD/MM/YYYY").format(
                                      "YYYY-MM-DD"
                                    )
                                  : ""
                              }
                              onChange={(e) => {
                                setDepartureEnd(
                                  e
                                    ? e.target.value
                                      ? moment(e.target.value).format(
                                          "DD/MM/YYYY"
                                        )
                                      : ""
                                    : ""
                                );
                              }}
                              className="ml-[0.3vw] font-semibold  bg-transparent outline-0 cursor-pointer  mr-2 w-full"
                            />
                            {creating || editing ? (
                              <div
                                className="h-[40%] w-10 border-l-[1px] flex items-center justify-center cursor-pointer "
                                onClick={() => {
                                  setDepartureEnd("");
                                }}
                              >
                                {" "}
                                <X />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      {(creating || editing) && daysNotUsed != 0 ? (
                        <div className="mt-3 flex items-center">
                          <input
                            type={"checkbox"}
                            className="h-4 w-4 accent-notify-500   "
                            checked={alterPendentDays}
                            onChange={(e) => {
                              setAlterpendentDays(e.target.checked);
                            }}
                          />
                          <span className="pl-2 text-semibold underline">
                            <span className="font-semibold text-notify-500">
                              {daysNotUsed > 0 ? "Remover do" : "Adicionar ao"}
                            </span>{" "}
                            analista
                            <span className="font-bold text-notify-500">
                              {" " + Math.abs(daysNotUsed)} dia(s){" "}
                            </span>
                            {daysNotUsed > 0
                              ? ",devido ao excedente do periodo agendado."
                              : ",recorrente ao não uso do período total agendado."}
                          </span>
                        </div>
                      ) : alterPendentDays && !creating && !editing ? (
                        <div className="pt-2 text-semibold">
                          Neste afastamento foram{" "}
                          <span className="font-semibold text-notify-500">
                            {daysNotUsed > 0
                              ? "Removidos do"
                              : "Adicionados ao"}
                          </span>{" "}
                          analista
                          <span className="font-bold text-notify-500">
                            {" " + Math.abs(daysNotUsed)} dia(s).{" "}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {creating || editing ? (
                    <div
                      className={`flex-row pl-6 pr-6 flex ${
                        editing ? "justify-between" : "justify-end"
                      }`}
                    >
                      {editing ? (
                        <Button
                          text="Apagar"
                          confirm={true}
                          className="w-[25%] rounded-sm bg-red-400 ring-red-400 h-[4vh] p-2 min-h-[2.2rem]"
                          onClick={() => {
                            del();
                          }}
                        />
                      ) : null}
                      <Button
                        text="Salvar"
                        confirm={true}
                        className="w-[25%] rounded-sm h-[4vh] p-2 min-h-[2.2rem]"
                        onClick={() => {
                          creating && !editing ? create() : patch();
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex-row p-6 flex justify-end">
                      <Button
                        text="Editar"
                        className="w-[25%]  rounded-md h-[4vh] p-2"
                        onClick={() => {
                          setEditing(true), setDepartureSelected(undefined);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        }
      </div>
    </div>
  );
}
