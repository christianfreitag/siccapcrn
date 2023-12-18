
import moment from "moment";
import { useContext, useEffect, useRef, useState ,useLayoutEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { caseType, reportType } from "../../components/Type/DataType"
import { Button } from "../../components/Button";
import { ErrorCard } from "../../components/ErrorCard";
import { InputText } from "../../components/InputText";

import { Timeline } from "../../components/Timeline";
import { api } from "../../services/api";
import { timeLineCaseBase } from "./Constants";
import { CaseGeneralInformation } from "./CaseGeneralData";
import { CaseRequestList } from "./CaseRequestList";
import { CaseReportList } from "./CaseReportList";
import { DataCountContext } from "../../hooks/DataCountContext";

import { Ghost, GitCommit } from "phosphor-react";
import CreatableSelect from "react-select/creatable";




export function Case() {
  const { id } = useParams()

  const [warning, setWarning] = useState<{ errors: string[], status: "ok" | "info" | "error", timer: boolean }>({ errors: [], status: "error", timer: false })
  const [timelineDataPrepared, setTimelinePrepared] = useState<{ date: string, color1: string, color2: string, description: string }[]>()
  const [caseMovements, setCaseMovements] = useState<{ id: string, case_id: string, observation: string, label: string, date: string, expire_date: string }[]>()
  const [case_, setCase] = useState<caseType>()
  const navigate = useNavigate()
  const [num_caso_lab, setNumCasoLab] = useState("")
  const [numSei, setNumSei] = useState("")
  const [timeLineCase, setTimeLineCase] = useState<string[]>([])
  const [numIP, setNumIp] = useState("")
  const [operationName, setOperationName] = useState("")
  const [end_date, setEndDate] = useState("")
  const [demandantUnit, setDemandantUnit] = useState("")
  const [object, setObject] = useState("")
  const [infoGeneralEditMode, setInfoGeneralEditMode] = useState(true)
  const [movementsTypes, setMovementTypes] = useState<{ value: number, label: string }[]>([])

  const [reports, setReports] = useState<reportType[]>([])
  const [nextStepDate, setNextStepDate] = useState("")
  const [nextExpireDate, setNextExpireDate] = useState("")
  const [loadPage,setLoadPage] = useState(false)
  const [isLoadingPage,setIsLoadingPage] = useState(true)

  const { resetCaseCount } = useContext(DataCountContext);
  const [isSubmitted, setSubmitted] = useState(false)

  const [movement, setMovement] = useState<{ label: string, value: number }>()
  const [movementValue, setMovementValue] = useState<{ value: number, label: string }>()

  async function getAllMovements() {
    await api.get("casesMovement/" + id, { withCredentials: true }).then(res => {

      setCaseMovements(res.data)
    }).catch(e => {
      setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false })
    })
  }

  

  async function createMovement() {


    if (movement != undefined  && movement.label != "" && nextExpireDate) {
      var dtCaseMovement = {
        case_id: id,
        date: moment(nextStepDate).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
        expire_date: moment(nextExpireDate).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ"),
        label: movement.label,
      }

      await api.post("casesMovement", dtCaseMovement, { withCredentials: true }).then(res => {

        //@ts-ignore
        setCaseMovements([...caseMovements, res.data])
        resetCaseCount()
        
        setWarning({ errors: ["Salvo com sucesso!"], status: "ok", timer: true })
      }).catch(e => {
        setWarning({ errors: ["Erro quando criava a movimentação"], status: "error", timer: false })
      })

    } else {
      setWarning({ errors: ["É necessário selecionar o tipo de movimentação antes."], status: "error", timer: false })
    }
  }

  async function removeCaseMovement() {
    if (caseMovements != null && caseMovements.length > 0) {
      let idCaseMove = caseMovements[caseMovements?.length - 1]
      await api.delete("casesMovement/" + idCaseMove.id, { withCredentials: true }).then(res => {
        setCaseMovements(caseMovements.length == 1 ? [] : caseMovements.filter(cM => cM.id != idCaseMove.id))
        resetCaseCount()
        api.patch("cases/" + idCaseMove.case_id, { expiredDate: caseMovements[caseMovements?.length - 2] ? moment(caseMovements[caseMovements?.length - 2].expire_date).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : null }, { withCredentials: true }).then(res => {
          resetCaseCount()
        }).catch(e => {
          setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false })
        })
        setWarning({ errors: ["Salvo com sucesso!"], status: "ok", timer: true })

      }).catch(e => {
        setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false })
      })
    }

  }


  async function patch(datas: {}) {

    await api.patch<caseType>('cases/' + id, datas, { withCredentials: true }).then((res: { data: caseType }) => {
      setCase(res.data)

      setInfoGeneralEditMode(!infoGeneralEditMode)
      resetCaseCount()
      setWarning({ errors: ["Salvo com sucesso!"], status: "ok", timer: true })
    }).catch((e: { response: { data: { message: string[] | string } } }) => {

      setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false })
    })
  }

  function patchGeneralInformation() {
    setSubmitted(true)
    if (num_caso_lab != "" && numSei != "" && numIP != "" && operationName != "") {
      const datas = {
        num_caso_lab: num_caso_lab.trim() != "" ? num_caso_lab : "",
        num_sei: numSei != "" ? numSei.trim() : "",
        operation_name: operationName.trim(),
        ip_number: numIP.trim(),

        demandant_unit: demandantUnit.trim(),
        object: object.trim(),
      }
      patch(datas)
    } else {
      setWarning({ errors: ["Existem campos obrigatórios que estão vazios."], status: "error", timer: false })
    }

  }

  async function patchCaseStatus(close = true) {

    const datas = {
      end_date: close ? moment().format("YYYY-MM-DD[T][00]:[00]:[00].[000][Z]") : null
    }
    patch(datas)
  }

  async function get() {
    await api.get<caseType>('cases/' + id, { withCredentials: true }).then((res: { data: caseType }) => {
      setCase(res.data)
      fetchToVariables()
      setLoadPage(true)
      setIsLoadingPage(false)

    }).catch((e: { response: { data: { message: string[] | string } } }) => { setIsLoadingPage(false) })
  }

  async function create() {

    if (num_caso_lab != "" && numSei != "" && numIP != "" && operationName != "") {
      const datas = {
        num_caso_lab: num_caso_lab,
        num_sei: numSei,
        operation_name: operationName,
        ip_number: numIP,
        demandant_unit: demandantUnit,
        object: object,
      }

      await api.post<caseType>('cases/', datas, { withCredentials: true }).then((res: { data: caseType }) => {
        setWarning({ errors: ["Salvo com sucesso!"], status: "ok", timer: true })
        setCase(res.data)
        navigate('../casos=' + res.data.id, { replace: true })
        resetCaseCount()
      }).catch((e: { response: { data: { message: string[] | string } } }) => { setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false }) })
    } else {
      setWarning({ errors: ["Existem campos obrigatórios que estão vazios."], status: "error", timer: false })
    }
  }

  function fetchToVariables() {
    setSubmitted(false)
    setNumCasoLab(case_?.num_caso_lab ? case_?.num_caso_lab : "")
    setNumIp(case_?.ip_number ? case_?.ip_number : "")
    setNumSei(case_?.num_sei ? case_?.num_sei : "")
    setDemandantUnit(case_?.demandant_unit ? case_?.demandant_unit : "")
    setOperationName(case_?.operation_name ? case_?.operation_name : "")
    setObject(case_?.object ? case_?.object : "")
    setReports(case_?.Report ? case_.Report : [])
    //@ts-ignore
    setEndDate(case_?.end_date ? case_?.end_date : "")

  }

  function clearFields() {
    setNumCasoLab("")
    setNumIp("")
    setNumSei("")
    setDemandantUnit("")
    setOperationName("")
    setObject("")
    setCase(undefined)
    setTimeLineCase([])
  }

  function timelineFieldsPreConfig() {
    var now = moment(moment.now()).format(moment.HTML5_FMT.DATE)
    var nowPlus10days = moment(moment(now).add(10, 'days')).format(moment.HTML5_FMT.DATE)
    setNextStepDate(now)
    setNextExpireDate(nowPlus10days)
  }

  function prepareDatToTimeline() {
    var timelineListPrepared = [] as { date: string, color1: string, color2: string, description: string }[]
    if (caseMovements != null && caseMovements.length > 0) {



      caseMovements.forEach((e, index) => {

        var color1 = "#6F90AF"
        var color2 = ((caseMovements.length - 1) == index ? "#ededed" : "#6F90AF")
        var description = e.label



        if (moment(moment(e.expire_date).format(moment.HTML5_FMT.DATE)).isSameOrBefore(moment().format(moment.HTML5_FMT.DATE)) && index == caseMovements.length - 1) {
          color1 = "#ff6e5e"
          color2 = "#ff6e5e"
        }
        if(case_?.end_date != null){
          color1 = "#4c9c3d"
          color2 = "#4c9c3d"
          
        }
        timelineListPrepared.push({ date: end_date ? end_date : e.date, color1, color2, description })
        if (case_?.end_date != null && index == (caseMovements.length - 1)) {
          description = "Finalizado"
          color1 = "#4c9c3d"
          color2 = "#ededed"
          timelineListPrepared.push({ date: end_date ? end_date : e.date, color1, color2, description })
        }
        

      })
      setTimelinePrepared(timelineListPrepared)
    }
  }

  function getListOfMovements() {
    const mov = localStorage.getItem('movetypes')
    const movs = mov?JSON.parse(mov):[]
    
    if(movs.length>0){
      setMovementTypes(movs)
    }
    
    //@ts-ignore
    
  }
  
  useEffect(() => { getAllMovements(), getListOfMovements() }, [])
  
  useEffect(() => {

    timelineFieldsPreConfig()
    //@ts-ignore
    if (id != "novo") {

      setInfoGeneralEditMode(true)
      prepareDatToTimeline()
      fetchToVariables()
      
      
    } else {
      prepareDatToTimeline()
      setIsLoadingPage(false)
      setLoadPage(true)
      if (case_) {
        clearFields()
      }
      if (infoGeneralEditMode) { setInfoGeneralEditMode(false) }


    }
  }, [id, case_, timeLineCase, caseMovements])

  useLayoutEffect(() => {
    
    if(id!="novo"){
      if(!case_){
        get()
      }
    }
  },[])


  return loadPage?(

    <div className={` w-full  h-full overflow-y-scroll overflow-x-hidden relative p-1`}>
      <div className={`h-[2rem] w-full p-2 mb-8 font-semibold text-3xl text-brand-100 flex items-baseline mr-10`}>
        Caso
        <span className="text-brand-100 font-medium text-lg ml-4"> Linha do tempo </span></div>
      {/*@ts-ignore*/}
      {warning.errors ? warning.errors.length >= 1 ? <ErrorCard errors={warning?.errors} setErrors={setWarning} status={warning?.status} timer={warning.timer ? 1500 : 0} /> : null : null}


      <div className={` bg-white ${caseMovements != null && caseMovements?.length <= 0 ? 'h-[5%]  min-h-[7rem] ' : 'h-[20%]  min-h-[8rem] '} w-full  p-2 rounded-lg shadow-sm relative `}>
        <div className={` h-full rounded-md  p-1 pb-2 flex items-center `}>
          {caseMovements != null && caseMovements?.length > 0 ? <Timeline data={timelineDataPrepared} lenDataNotNull={timeLineCase.length} /> : <div className="w-full h-full flex items-center justify-center"><GitCommit className="mr-4" weight="thin" size={'30px'} /> Nenhuma movimentação, tente adicionar uma selecionando abaixo e confirmando.</div>}
        </div>
      </div>

      {!end_date ? <div className={` bg-white  h-fit min-h-[6rem] w-full mt-2  rounded-lg shadow-sm relative p-4`}>
        <div className={`w-full h-full flex flex-wrap items-center  pr-4 pl-4`}>
          <div className={`flex-1 ml-4  min-w-[15rem] `}>
            <CreatableSelect
              placeholder="Tipo de movimentação"
              isSearchable={true}
              isDisabled={case_?.end_date != null || !infoGeneralEditMode ? true : false}
              isClearable={true}

              onCreateOption={(e) => {
                getListOfMovements()
                
                movementsTypes ? localStorage.setItem('movetypes', JSON.stringify([...movementsTypes, { label: e, value:  movementsTypes?.length+timeLineCaseBase.length }])) : null
                movementsTypes.length>0 ? 
                  setMovementTypes([...movementsTypes, { value: movementsTypes?.length+timeLineCaseBase.length+1, label: e }]) : 
                  setMovementTypes([...movementsTypes,{ value: ( movementsTypes.length+timeLineCaseBase.length+1), label: e }]);
                movementsTypes ? 
                  setMovement({ value: movementsTypes?.length+timeLineCaseBase.length, label: e }) : 
                  null

                
              }}
              onChange={(e) => { e != null ? setMovement({ label: e.label, value: e.value }) : null }}
              value={movement}
              className={`z-50`}

              options={movementsTypes?timeLineCaseBase.map((v,i)=>({value:i,label:v})).concat(movementsTypes):timeLineCaseBase.map((v,i)=>({value:i,label:v}))}
            />

          </div>
          <div className={`flex flex-1 min-w-[20rem] ml-4 w-full`}><InputText setInput={setNextStepDate} isDisabled={!infoGeneralEditMode} typeData={"date"} labelPosition={"left"} input={nextStepDate} label={"Data:"} /></div>
          <div className={`flex ml-4 min-w-[20rem] flex-1 w-full`}><InputText isDisabled={!infoGeneralEditMode} typeData={"date"} setInput={setNextExpireDate} labelPosition={"left"} input={nextExpireDate} label={"Validade:"} /></div>
          <div className={`mb-2 flex-1  h-16 ml-8 flex  items-center   $bg-yellow-100 min-w-[15rem]`}>
            <div className={`h-10 w-full min-w-[16rem]`}>
              <Button confirm={true}
                onClick={() => { createMovement() }}
                className="rounded-md"
                disabled={!infoGeneralEditMode || end_date != ''} text={"Confirmar nova Etapa"} />
            </div>
          </div>
        </div>

      </div> : null
      }


      <div className="flex w-[99%] justify-end text-sm  mt-3 ">
        {caseMovements != null && caseMovements?.length > 0 ?
          <Button className="cursor-pointer mr-2 w-fit underline "
            textOnly={true} confirm={true} confirmText={"Confirmar ação"} text={"Desfazer ultima etapa"} onClick={() => { removeCaseMovement() }} /> : null}
        <Button className="cursor-pointer ml-2  w-fit underline" textOnly={true} confirm={true} onClick={() => { patchCaseStatus(!end_date ? true : false) }} text={!end_date ? "Finalizar caso" : "Reabrir caso"} />
      </div>

      {/*INFORMAÇÕES GERAIS*/}
      <CaseGeneralInformation
        onSubmit={isSubmitted}
        demandantUnit={demandantUnit}
        infoGeneralEditMode={infoGeneralEditMode}
        fetchToVariables={fetchToVariables}
        numIP={numIP}
        numSei={numSei}
        num_caso_lab={num_caso_lab}
        object={object}
        operationName={operationName}
        patch={patchGeneralInformation}
        create={create}
        setDemandantUnit={setDemandantUnit}
        setInfoGeneralEditMode={setInfoGeneralEditMode}
        setNumCasoLab={setNumCasoLab}
        setNumIp={setNumIp}
        setNumSei={setNumSei}
        setObject={setObject}
        setOperationName={setOperationName}
        id={id}
      />

      {/*RELATÓRIOS*/}
      <CaseReportList  reports={reports} setReports={setReports} id={id} setWarning={setWarning} />

      {/*SOLICITAÇÕES*/}
      <CaseRequestList case_={case_} setCase={setCase} id={id} />



    </div >): !isLoadingPage ? (
    <div className=" w-full h-full  flex items-center justify-center">
      <div className="">
        <div className="flex items-center text-2xl">
          <Ghost weight="thin" size="5rem" className="mr-4" />
          Pagina não encontrada ou excluida.
        </div>
        <div 
        onClick={()=>{navigate(-1)}}
        className="w-full flex justify-center rounded-md h-10  items-center underline font-bold text-brand-100 hover:text-notify-500 cursor-pointer">Voltar</div>
      </div>
    </div>
  ) : null;
}
