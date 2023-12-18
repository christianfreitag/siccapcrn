import moment from "moment";
import { ArrowLineDown, Download, PencilSimple, TrashSimple } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { Button } from "../../components/Button";
import { InputText } from "../../components/InputText";
import { SearchListPopup } from "../../components/SearchListPopup";
import { analystType, caseType } from "../../components/Type/DataType";
import { api } from "../../services/api";

import Dropzone from "react-dropzone";
import { analystStatus } from "../Analysts/Constants";
import { report_types } from "./Constants";

interface reportGeneralInformationProps {
  caseId: string;
  analystId: string;
  numReport: string;
  analystName: string;
  reviewName:string;
  userName: string;
  createdAt: string;
  reviewId:string;
  type: number | undefined;
  id?: string;
  editMode: boolean;
  onSubmit: boolean;
  selectedFiles: File | undefined;
  fileName: string;

  downloadReport: () => void;
  setSelectedFiles: (nw: File | undefined) => void;
  patch: () => void;
  create: () => void;
  fetchToVariables: () => void;
  setEditModeChange: (nw: boolean) => void;
  setReviewId:(nw:string)=>void;
  setCaseId: (nw: string) => void;
  setAnalystId: (nw: string) => void;
  setNumReport: (nw: string) => void;
  setAnalystName: (nw: string) => void;
  setReviewName:(nw:string)=>void;
  setType: (nw: number | undefined) => void;
  setWarning: (nw: { errors: string[]; status: "ok" | "info" | "error"; timer: boolean }) => void;

  fieldEnabled: boolean;
}

export function ReportGeneralInformation({
  fetchToVariables,
  editMode,
  setEditModeChange,
  id,
  reviewId,
  reviewName,
  setReviewName,
  setReviewId,
  type,
  create,
  downloadReport,
  setType,
  createdAt = "",
  userName = "",
  setAnalystName,
  analystName,
  fieldEnabled,
  onSubmit = false,
  setNumReport,
  numReport,
  setCaseId,
  fileName,
  setAnalystId,
  caseId,
  patch,
  analystId,
  setWarning,
  selectedFiles = undefined,
  setSelectedFiles,
}: reportGeneralInformationProps) {
  const inputFile = useRef(null);
  const navigate = useNavigate();
  const [searchCaseData, setSearchCaseData] = useState("");
  const [pageCaseList, setPageCaseList] = useState(1);
  const [totalCaseData, setTotalCaseData] = useState(0);
  const [casesList, setCasesList] = useState<
    {
      "Nº do caso": string;
      "Nº do SEI": string;
      Operação: string;
      id: string;
    }[]
  >();

  const [searchAnalystData, setSearchAnalystData] = useState("");
  const [pageAnalystList, setPageAnalystList] = useState(1);
  const [totalAnalystData, setTotalAnalystData] = useState(0);
  const [analystsList, setAnalystsList] = useState<
    {
      Nome: string;
      Status: string;
      id: string;
    }[]
  >();

  const [isDetailOpen, setDetailOpen] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  // handle drag events
  //@ts-ignore
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!fieldEnabled) {
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    }
  };
  //@ts-ignore
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!fieldEnabled) {
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        // at least one file has been dropped so do something
        // handleFiles(e.dataTransfer.files);
        setSelectedFiles(e.dataTransfer.files[0]);
      }
    }
  };

  async function searchCases() {
    await api
      .get<[caseType[], number]>("cases", {
        withCredentials: true,
        params: {
          searchData: searchCaseData,
          order: "asc",
          page: pageCaseList,
          searchBy: "all",
          countOnly: false,
          status: 0,
        },
      })
      .then((res: { data: [caseType[], number] }) => {
        var caseListFiltered = [] as {
          "Nº do caso": string;
          "Nº do SEI": string;
          Operação: string;
          id: string;
        }[];
        res.data[0].forEach((e) => {
          caseListFiltered.push({
            "Nº do caso": e.num_caso_lab,
            "Nº do SEI": e.num_sei,
            Operação: e.operation_name,
            id: e.id,
          });
        });
        setCasesList(caseListFiltered);
        setTotalCaseData(res.data[1]);
      })
      .catch(
        (e: {
          response: {
            data: {
              message: string[] | string;
            };
          };
        }) => {
          //setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false })
        }
      );
  }

  async function searchAnalysts() {
    await api
      .get("analysts", {
        withCredentials: true,
        params: {
          searchData: searchAnalystData,
          status: 9,
          countOnly: false,
          page: pageAnalystList,
        },
      })
      .then((res: { data: [analystType[], number] }) => {
        var analystListFiltered = [] as {
          Nome: string;
          Status: string;
          id: string;
        }[];
        res.data[0].forEach((e) => {
          analystListFiltered.push({
            Nome: e.name,
            Status: analystStatus[e.status+1],
            id: e.id,
          });
        });
        setAnalystsList(analystListFiltered);
        setTotalAnalystData(res.data[1]);
      });
  }

  function setCaseOnChoose(op: string[]) {
    if (casesList != null && op.length > 0) {
      setCaseId(op[0]);
    } else {
      setCaseId("");
    }
  }

  function setAnalystOnChoose(op: string[],review?:boolean) {
    if (op.length > 0 && analystsList != null) {
      if(review){
        setReviewId(op[0]);
        setReviewName(analystsList.filter((x) => x["id"] == op[0])[0].Nome);
      }else{
        setAnalystId(op[0]);
        setAnalystName(analystsList.filter((x) => x["id"] == op[0])[0].Nome);
      }
    } else {
      if(review){
        setReviewId("")
        setReviewName("")
      }else{
        setAnalystId("");
      setAnalystName("");
      }
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0].type == "application/pdf") {
      setSelectedFiles(event?.target?.files?.[0]);
    } else {
      setWarning({ errors: ["O arquivo precisa estar em formato PDF."], status: "error", timer: false });
    }
  };
  const onClear = () => {
    setSelectedFiles(undefined);
  };

  useEffect(() => {
    searchCases();
  }, [pageCaseList]);

  useEffect(() => {
    searchAnalysts();
  }, [pageAnalystList]);

  return (
    <div className="h-fit mt-8 bg-white p-3 rounded-lg shadow-sm">
      <div className=" h-[10%] flex items-end">
        <span className="text-lightBlack-100 font-medium text-lg"> Informações gerais</span>
      </div>

      <div className={` h-fit p-2 pb-16 relative`}>
        <div className={`flex flex-wrap w-full h-fit p-1 `}>
          <div className={`flex-1 mr-10 min-w-[10rem]`}>
            <InputText label={"Nº do relatório"} input={numReport} onSubmit={onSubmit} isNotOptional={true} setInput={setNumReport} isDisabled={fieldEnabled} />
          </div>
          <div className={`flex-1 mt-6 min-w-[8rem]`}>
            <Select
              placeholder="Tipo"
              className="z-40  min-w-[3rem] "
              maxMenuHeight={200}
              isDisabled={fieldEnabled}
              isClearable={true}
              value={type != undefined ? report_types.map((v, index) => ({ label: v, value: index })).filter((e) => e.value == type) : null}
              onChange={(e) => {
                e ? setType(e.value) : null;
              }}
              options={report_types.map((v, index) => ({ label: v, value: index }))}
            />
          </div>
        </div>
        <div className={`h-fit w-full flex flex-wrap p-1 mt-4 `}>
          <div className={`mr-10 mb-6 flex-1 min-w-[20rem]`}>
            <SearchListPopup
              isDisabled={fieldEnabled}
              dataList={casesList}
              searchData={searchCaseData}
              setSearchData={setSearchCaseData}
              totalData={totalCaseData}
              page={pageCaseList}
              setPage={setPageCaseList}
              searchFunction={searchCases}
              onSelect={setCaseOnChoose}
              selectedItem={caseId}
              trigger={
                <div>
                  <InputText input={caseId} setInput={setCaseId} refOnDisable={caseId ? "../casos=" + caseId : undefined} placeholder="Clique para adicionar" cleanBt={false} label={"ID do caso"} isDisabled={fieldEnabled} />
                </div>
              }
            />
          </div>
          <div className={` mb-6 flex-1 min-w-[20rem] mr-6 `}>
            <SearchListPopup
              isDisabled={fieldEnabled}
              dataList={analystsList}
              searchData={searchAnalystData}
              setSearchData={setSearchAnalystData}
              totalData={totalAnalystData}
              page={pageAnalystList}
              setPage={setPageAnalystList}
              searchFunction={searchAnalysts}
              selectedItem={reviewId}
              onSelect={(op)=>{setAnalystOnChoose(op,true)}}
              trigger={
                <div>
                  <InputText input={reviewName} setInput={setReviewName} refOnDisable={reviewId != "" ? "../analistas=" + reviewId : undefined} placeholder="Clique para adicionar" cleanBt={false} label={"Revisor"} isDisabled={fieldEnabled} />
                </div>
              }
            />
          </div>

          <div className={` mb-6 flex-1 min-w-[20rem] `}>
            <SearchListPopup
              isDisabled={fieldEnabled}
              dataList={analystsList}
              searchData={searchAnalystData}
              setSearchData={setSearchAnalystData}
              totalData={totalAnalystData}
              page={pageAnalystList}
              setPage={setPageAnalystList}
              searchFunction={searchAnalysts}
              selectedItem={analystId}
              onSelect={setAnalystOnChoose}
              trigger={
                <div>
                  <InputText input={analystName} setInput={setAnalystName} refOnDisable={analystId != "" ? "../analistas=" + analystId : undefined} placeholder="Clique para adicionar" cleanBt={false} label={"Analista"} isDisabled={fieldEnabled} />
                </div>
              }
            />
          </div>
        </div>

        <form
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onSubmit={(e) => e.preventDefault()}
          className={` w-full flex  p-1 mt-4 h-[30vh] md:h-[15vh] justify-center border-dashed border-[2px] 
                ${fieldEnabled ? "border-gray-200 bg-gray-50" : dragActive && !fieldEnabled ? "border-notify-500" : "border-brand-100 bg-slate-50"} rounded-md  items-center`}
        >
          {fieldEnabled ? (
            <div className=" w-[50%] flex justify-center">
              {fileName ? (
                <div
                  className="flex font-semibold items-center text-xl text-brand-100 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => {
                    downloadReport();
                  }}
                >
                  Baixar arquivo
                  <div className="bg-brand-100 h-10 w-10 rounded-md flex items-center justify-center p-1 ml-4 border-2 border-dotted border-white ">
                    <Download className=" text-white" />
                  </div>
                </div>
              ) : (
                <p className="text-center text-sm text-lightBlack-100">Nenhum arquivo foi enviado.</p>
              )}
            </div>
          ) : (
            <div className=" w-[50%] ">
              {!selectedFiles ? <p className="text-center text-sm text-lightBlack-100">{!dragActive ? "Clique no botão abaixo para selecionar um arquivo, ou arraste um arquivo dentro dessa area." : "Solte o arquivo."}</p> : null}
              <input hidden type="file" accept={".pdf"} onChange={handleFileSelect} ref={inputFile} />
              <div>
                {!selectedFiles ? (
                  //@ts-ignore
                  <Button onClick={() => inputFile.current?.click()} text={fileName ? "Substituir arquivo" : "Importar arquivo"} className={"rounded-md h-10"} disabled={fieldEnabled} />
                ) : (
                  <div className="font-semibold  flex items-center  justify-center flex-wrap">
                    <div>{selectedFiles.name.slice(0, selectedFiles.name.length > 20 ? 30 : selectedFiles.name.length)}...</div>
                    {!fieldEnabled ? (
                      <div
                        onClick={() => {
                          onClear();
                        }}
                        className={`bg-brand-100 h-10 min-w-[8rem] rounded-md flex items-center justify-center text-white cursor-pointer`}
                      >
                        Remover <TrashSimple className="text-white ml-3" />{" "}
                      </div>
                    ) : (
                      <div className={`bg-brand-100 h-10 w-10 rounded-md flex items-center justify-center text-white cursor-pointer`}>
                        <ArrowLineDown className="text-white text-lg" />{" "}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </form>

        {fieldEnabled && id != "novo" ? (
          <div
            className={`absolute  right-2 bottom-2 flex items-center cursor-pointer `}
            onClick={() => {
              setEditModeChange(!editMode);
            }}
          >
            {<PencilSimple className={`mr-2 `} />}
            Editar
          </div>
        ) : (
          <div className="w-60 h-8 absolute  right-2 bottom-2 flex items-center justify-between">
            <Button
              text="Cancelar"
              className="bg-red-400  ring-red-400 hover:bg-red-400 rounded-sm"
              onClick={() => {
                if (id != "novo") {
                  setEditModeChange(!editMode);
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
                  patch();
                } else {
                  create();
                }
              }}
            />
          </div>
        )}
        {id != "novo" && fieldEnabled ? (
          <span
            onClick={() => {
              setDetailOpen(!isDetailOpen);
            }}
            className={`absolute bottom-0 underline cursor-pointer`}
          >
            Mostrar {isDetailOpen ? "menos " : "mais "}
            detalhes
          </span>
        ) : null}
        {isDetailOpen ? (
          <div className={`flex w-full  h-fit mt-4`}>
            <div className={`flex-1   mt-4 h-fit mr-10`}>
              <InputText label={"Data de criação"} input={moment(createdAt).format("DD/MM/YYYY")} isDisabled={true} />
            </div>
            <div className={`flex-1   mt-4 h-fit`}>
              <InputText label={"Criado por:"} input={userName} isDisabled={true} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
