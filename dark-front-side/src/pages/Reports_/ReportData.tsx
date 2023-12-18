import moment from "moment";
import { Ghost, GitCommit, Trash } from "phosphor-react";
import { useEffect, useState, useContext, useRef, useLayoutEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { ErrorCard } from "../../components/ErrorCard";
import { InputText } from "../../components/InputText";
import { Timeline } from "../../components/Timeline";
import { analystType, reportType } from "../../components/Type/DataType";
import { DataCountContext } from "../../hooks/DataCountContext";
import { api } from "../../services/api";
import { report_status, report_types, timeLineReportBase } from "./Constants";
import { ReportGeneralInformation } from "./ReportGeneralInformation";
import CreatableSelect from "react-select/creatable";
export function ReportData() {
  const { id } = useParams();

  const locationState = useLocation() as { state: { case_id: string; edit: boolean } };
  const navigate = useNavigate();
  const { resetReportCount, resetAnalystCount } = useContext(DataCountContext);
  const [warning, setWarning] = useState<{ errors: string[]; status: "ok" | "info" | "error"; timer: boolean }>({ errors: [], status: "error", timer: false });

  const [selectedFiles, setSelectedFiles] = useState<File | undefined>(undefined);
  const [num_report, setNumReport] = useState("");
  const [type, setType] = useState<number | undefined>(undefined);
  const [create_at, setCreatedAt] = useState("");
  const [case_id, setCaseId] = useState("");
  const [analystId, setAnalystId] = useState("");
  const [reviewId,setReviewId] = useState("")
  const [reviewName,setReviewName] = useState("")
  const [analystName, setAnalystName] = useState("");
  const [timeLineReport, setTimeLineReport] = useState<{date:string,type:number}[]>([]);
  const [fileName, setFileName] = useState("");
  const [userName, setUserName] = useState("");

  const [statusStepDateReport,setStepReportDate] = useState<number|undefined>(undefined)

  const [loadPage, setLoadPage] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [infoGeneralEditMode, setInfoGeneralEditMode] = useState(locationState.state ? (locationState.state.edit ? !locationState.state.edit : true) : true);

  const [nextStepDate, setNextStepDate] = useState("");

  const [report_, setReport] = useState<reportType>();

  const [timelineDataPrepared, setTimelinePrepared] = useState<{ date?: string; color1: string; color2: string; description: string }[]>();
  const [isSubmitted, setSubmitted] = useState(false);

  async function fetchToVariables() {
    setNumReport(report_?.num_report ? report_.num_report : "");
    setCaseId(report_?.case_id ? report_.case_id : "");
    setAnalystId(report_?.analyst?.id ? report_.analyst.id : "");
    setAnalystName(report_?.analyst?.name ? report_.analyst.name : "");
    setType(report_?.type!=(null||undefined )? report_.type : undefined);
    
    setCreatedAt(report_?.create_at ? report_.create_at : "");
    setUserName(report_?.user?.name ? report_.user.name : "");
    setTimeLineReport(report_?.step_dates ? report_.step_dates : []);
    setFileName(report_ ? (report_.file ? report_.file : "") : "");
    setSelectedFiles(undefined);

    setReviewId(report_?.review_id?report_.review_id:"")
  }

  async function get() {
    await api
      .get<reportType>("reports/" + id, { withCredentials: true })
      .then( async(res: { data: reportType }) =>  {
        setReport(res.data);
        prepareDatToTimeline(res.data.step_dates);
        fetchToVariables();

        
        setLoadPage(true);
        setIsLoadingPage(false);

        if(res.data.review_id){
          await api.get("analysts/"+res.data.review_id,{withCredentials:true}).then((res:{data:analystType})=>{
            setReviewName(res.data.name)
          }).catch((e: { response: { data: { message: string[] | string } } }) => {
            setIsLoadingPage(false);
            setWarning({ errors: ["Ocorreu um erro enquanto buscava analista."], status: "error", timer: false });
          });
        }
      })
      .catch((e: { response: { data: { message: string[] | string } } }) => {
        setIsLoadingPage(false);
        console.log(e)
        //setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
      });
  }

  async function patch(data: { case_id?: string | null; num_report?: string; analyst_id?: string | null; step_dates?: {date:string,type:number}[]; type?: number; file?: string }) {
    var fileNameReport = "";
    if (selectedFiles) {
      fileNameReport = await upload();
    }
    data["file"] = fileNameReport;

    await api
      .patch<reportType>("reports/" + id, data, { withCredentials: true, params: { updateStatus: true } })
      .then((res: { data: reportType }) => {
        setReport(res.data);
        resetReportCount();
        resetAnalystCount();
        setInfoGeneralEditMode(true);
        setWarning({ errors: ["Salvo com sucesso!"], status: "ok", timer: true });
        console.log(res.data)
        prepareDatToTimeline(res.data.step_dates);
      })
      .catch((e: { response: { data: { message: string[] | string } } }) => {
        setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
      });
  }

  function patchGeneralData() {
    setSubmitted(true);
    if (num_report != "" && type != undefined) {
      let data = {
        case_id: case_id ? case_id.trim() : null,
        num_report: num_report.trim(),
        analyst_id: analystId ? analystId.trim() : null,
        review_id:reviewId?reviewId.trim():null,
        type: type,
      };

      

      patch(data);
    } else {
      setWarning({ errors: ["Existem campos obrigatórios que estão vazios."], status: "error", timer: false });
    }
  }

  function patchTimeLine(undo = false) {
    
    if(undo){
      prepareDatToTimeline(timeLineReport.filter((t,i)=>i!=timeLineReport.length-1));
      setTimeLineReport(timeLineReport.filter((t,i)=>i!=timeLineReport.length-1));
      patch({step_dates:timeLineReport.filter((t,i)=>i!=timeLineReport.length-1),analyst_id:analystId,})
    }else{
      console.log(statusStepDateReport,nextStepDate)
      if(statusStepDateReport!=undefined && nextStepDate){
        const nwStep = {
          date: moment(nextStepDate).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
          type:statusStepDateReport
        }
        patch({step_dates:[...timeLineReport, nwStep],analyst_id:analystId,})
        
        
        
      }else{
        setWarning({ errors: ["Selecione uma etapa e uma data antes de confirmar."], status: "error", timer: false });
      }
    }
  }

  async function downloadReport() {
    await api.get("reports/download/" + fileName, { withCredentials: true, responseType: "blob" }).then(async (res) => {
      var blob = new Blob([res.data], { type: "application/pdf" });

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      //@ts-ignore
      link.download = report_?.num_report + "_" + report_types[report_?.type];
      document.body.appendChild(link);
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      document.body.removeChild(link);
    });
  }

  async function upload() {
    if (selectedFiles) {
      const formData = new FormData();
      formData.append("file", selectedFiles);
      return await api
        .post("reports/upload", formData, { withCredentials: true, params: { numReport: num_report } })
        .then(async (res) => {
          return res.data;
        })
        .catch((e) => {
          
        });
    }
  }

  async function create() {
    setSubmitted(true);
    
    if (num_report != "" && type != undefined) {
      var fileNameReport = "";
      if (selectedFiles) {
        fileNameReport = await upload();
      }

      const datas = {
        num_report: num_report,
        type: type,
        case_id: case_id != "" ? case_id : null,
        analyst_id: analystId != "" ? analystId : null,
        file: selectedFiles ? fileNameReport : undefined,
      };
      

      await api
        .post("reports", datas, { withCredentials: true })
        .then((res: { data: reportType }) => {
          setWarning({ errors: ["Salvo com sucesso!"], status: "ok", timer: true });
          resetReportCount();
          setReport(res.data)
          resetAnalystCount();
          setInfoGeneralEditMode(true);
          navigate("../relatorios=" + res.data.id, { replace: true });
        })
        .catch((e: { response: { data: { message: string[] | string } } }) => {
          setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
        });
    } else {
      setWarning({ errors: ["Existem campos obrigatórios que estão vazios."], status: "error", timer: false });
    }
  }

  async function deleteReport() {
    await api
      .delete<reportType>("reports/" + id, { withCredentials: true })
      .then((res: { data: reportType }) => {
        setWarning({ errors: ["Deletado com sucesso!"], status: "ok", timer: true });
        resetReportCount();
        resetAnalystCount();
        navigate("../", { replace: true });
      })
      .catch((e: { response: { data: { message: string[] | string } } }) => {
        setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
      });
  }

  function clearFields() {
    setNumReport("");
    setCaseId("");
    setAnalystId("");
    setAnalystName("");
    setType(undefined);
    setCreatedAt("");
    setUserName("");
    setReport(undefined);
    setTimeLineReport([]);
    setSelectedFiles(undefined);
    setReviewId("")
  }

  function prepareDatToTimeline(sDates?:{date:string,type:number}[]) {

      var timelineListPrepared = [] as { date: string; color1: string; color2: string; description: string }[];
      let listDates = [] as {date:string,type:number}[]
      if(sDates){
        listDates = sDates
      }else{
        listDates = timeLineReport
      }

      console.log("PREPARE:",listDates)
      console.log("PRETIMELIN:",timeLineReport)

      listDates.forEach((e, index) => {
        var color1 = "#ededed";
        var color2 = "#ededed";
        var description = report_status[e.type+1]

        if (index <=listDates.length) {
          color1 = "#6F90AF";
          color2 = "#6F90AF";
        }
        if (listDates[listDates.length -1].type== 2 ) {
          color1 = "#4c9c3d";
          color2 = "#4c9c3d";
        }

        timelineListPrepared.push({ date: listDates[index]["date"], color1, color2, description });
      });
      
      setTimelinePrepared(timelineListPrepared);
    
  }

  function timelineFieldsPreConfig() {
    var now = moment(moment.now()).format(moment.HTML5_FMT.DATE);
    var nowPlus10days = moment(moment(now).add(10, "days")).format(moment.HTML5_FMT.DATE);
    setNextStepDate(now);
  }

  useEffect(() => {
    timelineFieldsPreConfig();
    if (id != "novo") {
      fetchToVariables();
      
    } else {
      setLoadPage(true)
      setIsLoadingPage(false)
      if (report_) {
        clearFields();
      }
      locationState.state != null ? setCaseId(locationState.state.case_id) : null;
      setInfoGeneralEditMode(false);
    }
  }, [id, report_]);

  useLayoutEffect(() => {
    
    if(id!="novo"){
      if(!report_){
        get()
        
      }
    }
  },[])
  
  return loadPage ? (
    <div className={` w-full  h-full overflow-y-scroll overflow-x-hidden relative p-1`}>
      {/*@ts-ignore*/}

      {warning.errors ? warning.errors.length >= 1 ? <ErrorCard errors={warning?.errors} setErrors={setWarning} status={warning?.status} timer={warning.timer ? 1500 : 0} /> : null : null}

      <div className={`h-[2rem] w-full p-2 mb-8 font-semibold text-3xl text-lightBlack-100 flex items-baseline mr-10`}>
        Relatório
        <span className="text-lightBlack-100 font-medium text-lg ml-4"> Linha do tempo </span>
      </div>
      <div className={` bg-zinc-800 h-[18%]  min-h-[8rem] w-full  p-2 rounded-lg shadow-sm relative `}>
        <div className={` h-full rounded-md  p-1 pb-2 flex items-center `}>
        {timelineDataPrepared && timelineDataPrepared.length > 0 ? <Timeline data={timelineDataPrepared} lenDataNotNull={timelineDataPrepared?timelineDataPrepared.length:0} /> : <div className="w-full h-full flex items-center justify-center"><GitCommit className="mr-4" weight="thin" size={'30px'} /> Nenhuma movimentação, tente adicionar uma selecionando abaixo e confirmando.</div>}
        </div>
      </div>

      <div className={` bg-zinc-800  h-fit min-h-[6rem] w-full mt-2  rounded-lg shadow-sm relative p-4`}>
        <div className={`w-full h-full flex flex-wrap items-center  pr-4 pl-4`}>
          <div className={`flex-1 ml-4  min-w-[15rem] `}>
          <CreatableSelect
              placeholder="Selecione a etapa"
              isSearchable={true}

              isClearable={true}
              value={report_status.filter((e,i)=>(i-1)==statusStepDateReport).map((v,index)=>({label:v,value:index}))}
              className={`z-50 my-react-select-container`}
              classNamePrefix="my-react-select"
              onChange={(e)=>{setStepReportDate(e?.value)}}
              options={report_status.filter((e,i)=>i!=0).map((v,index)=>({label:v,value:index}))}
            />
            
          </div>
          <div className={`flex flex-1 min-w-[20rem] ml-4 w-full`}>
            <InputText setInput={setNextStepDate} isDisabled={!infoGeneralEditMode} typeData={"date"} labelPosition={"left"} input={nextStepDate} label={"Data:"} />
          </div>
          <div></div>

          <div className={`mb-2 flex-1  h-16 ml-8 flex  items-center   $bg-yellow-100 min-w-[15rem]`}>
            <div className={`h-10 w-full min-w-[16rem]`}>
              <Button
                confirm={true}
                onClick={() => {
                  patchTimeLine();
                }}
                className="rounded-md"
                disabled={!infoGeneralEditMode  ? true : false}
                text={"Confirmar nova Etapa"}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-[99%] justify-end text-sm  mt-3 ">
        {timeLineReport.length > 0 ? (
          <Button
            className="cursor-pointer mr-2 w-fit underline "
            textOnly={true}
            confirm={true}
            confirmText={"Confirmar ação"}
            text={"Desfazer ultima etapa"}
            onClick={() => {
              patchTimeLine(true);
            }}
          />
        ) : null}
        {id != "novo" ? (
          <Button
            className="cursor-pointer ml-2  w-fit underline"
            textOnly={true}
            confirm={true}
            onClick={() => {
              deleteReport();
            }}
            icon={Trash}
            text={"Apagar relatório"}
          />
        ) : null}
      </div>

      <ReportGeneralInformation
        setReviewId={setReviewId}
        setReviewName={setReviewName}
        reviewName={reviewName}
        reviewId={reviewId}
        selectedFiles={selectedFiles}
        fileName={fileName}
        downloadReport={downloadReport}
        setSelectedFiles={setSelectedFiles}
        setWarning={setWarning}
        caseId={case_id}
        onSubmit={isSubmitted}
        editMode={infoGeneralEditMode}
        setEditModeChange={setInfoGeneralEditMode}
        fetchToVariables={fetchToVariables}
        create={create}
        patch={patchGeneralData}
        type={type}
        setType={setType}
        createdAt={create_at}
        userName={userName}
        setCaseId={setCaseId}
        analystName={analystName}
        setAnalystName={setAnalystName}
        analystId={analystId}
        setAnalystId={setAnalystId}
        fieldEnabled={infoGeneralEditMode}
        setNumReport={setNumReport}
        id={id}
        numReport={num_report}
      />
    </div>
  ) : !isLoadingPage ? (
    <div className=" w-full h-full  flex items-center justify-center">
      <div className="">
        <div className="flex items-center text-2xl">
          <Ghost weight="thin" size="5rem" className="mr-4" />
          Pagina não encontrada ou excluida.
        </div>
        <div 
        onClick={()=>{navigate(-1)}}
        className="w-full flex justify-center rounded-md h-10  items-center underline font-bold text-zinc-400 hover:text-notify-500 cursor-pointer">Voltar</div>
      </div>
    </div>
  ) : null;
}
