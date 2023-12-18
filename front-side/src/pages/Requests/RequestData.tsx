import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useState, useEffect, useContext } from "react";
import { caseType, investigatedType, requestType } from "../../components/Type/DataType";
import moment from "moment";
import { InputText } from "../../components/InputText";
import { DotsThreeVertical, Ghost, GitFork, LinkBreak, PencilSimple, Plus, TrashSimple, X } from "phosphor-react";
import { Button } from "../../components/Button";
import { SearchListPopup } from "../../components/SearchListPopup";
import { DataCountContext } from "../../hooks/DataCountContext";
import { ErrorCard } from "../../components/ErrorCard";
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";
import Popup from "reactjs-popup";

export function RequestData() {
  const [warning, setWarning] = useState<{ errors: string[]; status: "ok" | "info" | "error"; timer: boolean }>({ errors: [], status: "error", timer: false });
  const { id } = useParams();
  const [request, setRequest] = useState<requestType>();
  const [investigated, setInvestigated] = useState<investigatedType[]>([]);
  const [isEditMode, setEditMode] = useState(id != "novo" ? false : true);

  const [investigatedName, setInvestigatedName] = useState("");
  const [investigatedCpf, setInvestigatedCpf] = useState("");
  const [createInvestigatedIsSubmited, setCreateInvestigatedIsSubmited] = useState(false);

  const [isDetailOpen, setDetailOpen] = useState(false);
  const [requestNum, setRequestNum] = useState("");
  const [caseId, setCaseId] = useState("");
  const [history, setHistory] = useState("");
  const [loadPage, setLoadPage] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const { resetRequestCount } = useContext(DataCountContext);
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

  const [popUpInvestigatedIsDisabled, setPopUpInvestigatedDisabled] = useState(true);

  async function handleFindRequestData() {
    await api
      .get("requests/" + id, {
        withCredentials: true,
      })
      .then((res) => {
        
        setRequest(res.data);
        setLoadPage(true)
      setIsLoadingPage(false)
      })
      .catch((e: { response: { data: { message: string[] | string } } }) => {
        setIsLoadingPage(false)
        setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
      });
  }

  async function handleCreateRequestData() {

    if (requestNum && caseId) {
      await api
        .post(
          "requests",
          {
            num_request: requestNum,
            history: history,
            id_case: caseId,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          
          setRequest(res.data);
          setEditMode(true);
          resetRequestCount();
          navigate("../solicitacoes=" + res.data.id, { replace: true });
          setWarning({ errors: ["Criado com sucesso!"], status: "ok", timer: true });
        })
        .catch((e) => {
          setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
        });
    } else {
      setWarning({ errors: ["Existem campos obrigatórios que estão vazios."], status: "error", timer: false });
    }
  }

  async function handlePatchRequestData() {
    if (requestNum && caseId) {
      if (requestNum == request?.num_request && history == request.history && caseId == request.id_case) {
        setEditMode(!isEditMode);
      } else {
        await api
          .patch(
            "requests/" + id,
            {
              num_request: requestNum != request?.num_request ? requestNum : undefined,
              history: history != request?.history ? history : undefined,
              id_case: caseId != request?.id_case ? caseId : undefined,
            },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            
            setRequest(res.data);
            setWarning({ errors: ["Salvo com sucesso!"], status: "ok", timer: true });
          })
          .catch((e) => {
            setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
          });
      }
    } else {
      setWarning({ errors: ["Existem campos obrigatórios que estão vazios."], status: "error", timer: false });
    }
  }

  async function handleDeleteRequestData() {
    await api
      .delete("requests/" + id, {
        withCredentials: true,
      })
      .then((res) => {
        
        resetRequestCount();
        navigate("../solicitacoes", { replace: true });
        setWarning({ errors: ["Deletado com sucesso!"], status: "ok", timer: true });
      })
      .catch((e) => {
        setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
      });
  }

  async function handleCreateInvestigated(close: () => void) {
    setCreateInvestigatedIsSubmited(true);
    if (investigatedName && investigatedCpf) {
      if (investigatedCpf.length == 14) {
        await api
          .post(
            "request-investigated/" + id,
            {
              name: investigatedName,
              cpf: investigatedCpf,
            },
            {
              withCredentials: true,
            }
          )
          .then((res: { data: { investigated: { name: string; cpf: string; id: string }; id: string; id_request: string } }) => {
            
            setInvestigated([
              ...investigated,
              { name: res.data.investigated.name, cpf: res.data.investigated.cpf, id: res.data.investigated.id, Investigated_requests: { id: res.data.id, id_request: res.data.id_request, id_investigated: res.data.investigated.id } },
            ]);
            setWarning({ errors: ["Criado com sucesso!"], status: "ok", timer: true });
            close();
            setInvestigatedCpf("");
            setInvestigatedName("");
            setCreateInvestigatedIsSubmited(false);
          })
          .catch((e) => {
            setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
          });
      } else {
        setWarning({ errors: ["O CPF do investigado é invalido."], status: "error", timer: false });
      }
    } else {
      setWarning({ errors: ["Existem campos obrigatórios que estão vazios."], status: "error", timer: false });
    }
  }

  async function handleFindAllInvestigated() {
    await api
      .get("request-investigated/" + id, {
        withCredentials: true,
      })
      .then((res) => {
        
        setInvestigated(res.data);
      })
      .catch((e) => {
        setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
      });
  }

  async function handleRemoveInvestigated(idInv: string) {
    await api
      .delete("request-investigated/" + id + "/" + idInv, {
        withCredentials: true,
      })
      .then((res) => {
        
        setInvestigated(investigated?.filter((inv) => inv.id != idInv));
        setWarning({ errors: ["Removido com sucesso!"], status: "ok", timer: true });
      })
      .catch((e) => {
        setWarning({ errors: typeof e.response.data.message == "string" ? [e.response.data.message] : e.response.data.message, status: "error", timer: false });
      });
  }

  function setCaseOnChoose(op: string[]) {
    if (casesList != null && op.length > 0) {
      setCaseId(op[0]);
    } else {
      setCaseId("");
    }
  }

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

  function fetchToVariables() {
    setCaseId(request ? request.id_case : "");
    setRequestNum(request ? request.num_request : "");
    setHistory(request ? request.history : "");
  }

  function clearVariables() {
    setCaseId("");
    setRequestNum("");
    setHistory("");
  }

  useEffect(() => {
    searchCases();
  }, [pageCaseList]);

  useEffect(() => {
    handleFindAllInvestigated();
    if (id != "novo") {
      if (!request) {
        handleFindRequestData();
      } else {
        fetchToVariables();
      }
      setEditMode(false);
    } else {
      setLoadPage(true)
      setIsLoadingPage(false)
      if (request) {
        clearVariables();
        setEditMode(true);
      }
    }
  }, [request, id]);

  return loadPage ? (
    <div className={` w-full h-full overflow-y-auto`}>
      {/*@ts-ignore*/}
      {warning.errors ? warning.errors.length >= 1 ? <ErrorCard errors={warning?.errors} setErrors={setWarning} status={warning?.status} timer={warning.timer ? 1500 : 0} /> : null : null}
      <div className={`h-[2rem] w-full p-2 mb-8 font-semibold text-3xl text-lightBlack-100 flex items-baseline `}>
        Solicitação
        <span className="text-lightBlack-100 font-medium text-lg ml-4"> Informações gerais </span>
      </div>
      <div className={`w-full min-h-[40rem] h-fit bg-white rounded-md relative`}>
        <div className={`w-full  flex-row h-fit mt-4`}>
          <div className={`w-full flex  justify-between p-6`}>
            <InputText input={requestNum} setInput={setRequestNum} isDisabled={!isEditMode} isNotOptional={true} placeholder="Digite aqui.." label={"Nº da solicitação"} />

            <div className={`ml-4 w-full`}>
              <SearchListPopup
                isDisabled={!isEditMode}
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
                    <InputText input={caseId} setInput={setCaseId} isNotOptional={true} isDisabled={!isEditMode} refOnDisable={caseId ? "../casos/" + caseId : undefined} placeholder="Digite aqui.." label={"ID do caso"} />
                  </div>
                }
              />
            </div>
          </div>
          <div className={`w-full    p-6`}>
            <span className="text-lightBlack-100">Histórico:</span>
            <textarea
              disabled={!isEditMode}
              placeholder="Digite o histórico aqui.."
              className="rounded-md w-full border-[1px] resize-none h-[25rem] p-3 mt-2"
              value={history}
              onChange={(e) => {
                setHistory(e.target.value);
              }}
            />
          </div>
        </div>

        {!isEditMode ? (
          <div className={`absolute  right-6 bottom-6   flex items-center  `}>
            <div
              className={` flex items-center cursor-pointer mr-10`}
              onClick={() => {
                handleDeleteRequestData();
              }}
            >
              {<TrashSimple className={`mr-2 `} />}Deletar
            </div>

            <div
              className={` flex items-center cursor-pointer `}
              onClick={() => {
                setEditMode(true);
              }}
            >
              {<PencilSimple className={`mr-2 `} />}Editar
            </div>
          </div>
        ) : (
          <div className="w-60 h-8 absolute  right-6  flex items-center justify-between">
            <Button
              text="Cancelar"
              className="bg-red-400  ring-red-400 hover:bg-red-400 rounded-sm"
              onClick={() => {
                if (id != "novo") {
                  setEditMode(!isEditMode);
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
                  handlePatchRequestData();
                } else {
                  handleCreateRequestData();
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
            className={`absolute bottom-6 left-6 underline cursor-pointer`}
          >
            Mostrar {isDetailOpen ? "menos " : "mais "}
            detalhes
          </span>
        ) : null}
        {isDetailOpen ? (
          <div className={`flex w-full  h-[10rem] pl-6 pr-6 `}>
            <div className={`flex-1   mt-4 h-fit mr-10`}>
              <InputText label={"Data de criação"} input={moment(request?.create_at).format("DD/MM/YYYY")} isDisabled={true} />
            </div>
            <div className={`flex-1   mt-4 h-fit`}>
              <InputText label={"Criado por:"} input={request ? request?.user.name : ""} isDisabled={true} />
            </div>
          </div>
        ) : null}
      </div>

      {!isEditMode ? (
        <div className={`w-full h-fit bg-white rounded-md mt-4 relative`}>
          <div className={` w-full h-[5rem]  p-6 text-2xl text-lightBlack-100`}>Investigados</div>
          <div className={`w-full h-fit 0 flex-row `}>
            <div className={` h-14 bg-gray-100 w-full flex items-center  pl-6 pr-6 shadow-sm`}>
              {["Nome", "CPF"].map((v, i) => {
                return (
                  <div key={v} className={`flex-1 font-semibold`}>
                    {v}
                  </div>
                );
              })}
            </div>

            <div className={`min-h-[20rem] max-h-[25rem] overflow-y-auto border-b-[1px] `}>
              {investigated.length > 0 ? (
                investigated?.map((i, index) => {
                  return (
                    <div key={i.id} className={`flex items-center justify-between pl-6 pr-6 h-[4rem] border-b-[1px]`}>
                      <div className={`flex-1`}>{i.name}</div>
                      <div className={`flex-1`}>{i.cpf}</div>
                      <Popover dismiss={{ ancestorScroll: true }} placement="bottom-end">
                        <PopoverHandler>
                          <DotsThreeVertical className="cursor-pointer" size={"23px"} />
                        </PopoverHandler>
                        <PopoverContent className={`rounded-sm h-fit pb-2 pt-4  w-[10rem] shadow-md p-0 duration-75 ml-2 border-[1px] } `}>
                          <div className=" h-3 w-3 rotate-[135deg] translate-x-[-120%] -translate-y-[50%] bg-white top-0 right-0 border-l-[1px] border-b-[1px] absolute z-auto "></div>
                          <div className="flex-row">
                            <div
                              className="z-50 h-8 flex  items-center hover:text-red-500 cursor-pointer w-full pl-4 justify-between"
                              onClick={() => {
                                handleRemoveInvestigated(i.id);
                              }}
                            >
                              Remover <TrashSimple className={"text-base ml-1 mr-2"} />
                            </div>
                            <div className="z-50 h-8 flex  items-center hover:text-purple-600 cursor-pointer w-full pl-4 justify-between" onClick={() => {}}>
                              Outros vínculos
                              <GitFork size={"20px"} weight={"thin"} className={"text-base ml-1 mr-2"} />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  );
                })
              ) : (
                <div className="w-full min-h-[20rem] flex items-center justify-center text-xl font-thin">
                  {" "}
                  <Ghost size={"3rem"} weight={"thin"} className="mr-4" />
                  Nenhum investigado encontrado, tente adicionar alguns.
                </div>
              )}
            </div>
            <div className={`min-h-[5rem] h-[90%] `}></div>
          </div>

          <div className={`absolute  right-6 bottom-6   flex items-center  `}>
            <Popup
              modal={true}
              disabled={isEditMode}
              onOpen={() => {}}
              overlayStyle={{ backgroundColor: "rgba(0, 0, 0,0.15)" }}
              closeOnDocumentClick={true}
              lockScroll={true}
              trigger={<div className={` flex items-center cursor-pointer `}>{<Plus className={`mr-2 `} />}Novo</div>}
            >
              {
                //@ts-ignore
                (close) => (
                  <div className={`w-[50rem] h-[13rem] bg-white rounded-md `}>
                    <div className={`w-full h-[3rem]  rounded-t-md justify-between flex items-center shadow-sm`}>
                      <div className="font-semibold text-brand-100 ml-4">Novo investigado</div>
                      <div
                        className={`h-7 w-7 rounded-md bg-gray-50 text-brand-100 mr-2 flex items-center  justify-center cursor-pointer hover:bg-brand-100 hover:text-white duration-700`}
                        onClick={() => {
                          close();
                          setCreateInvestigatedIsSubmited(false);
                        }}
                      >
                        <X size={"16px"} />
                      </div>
                    </div>
                    <div className={`w-full h-[7rem] bg-white-50 rounded-t-md  justify-between  flex items-center pr-4 pl-4 `}>
                      <InputText input={investigatedName} isNotOptional={true} onSubmit={createInvestigatedIsSubmited} setInput={setInvestigatedName} label={"Nome"} />
                      <InputText input={investigatedCpf} isNotOptional={true} onSubmit={createInvestigatedIsSubmited} setInput={setInvestigatedCpf} typeData={"cpf"} label={"CPF"} className="ml-4" />
                    </div>
                    <div className={`w-full h-[4rem] bg-gray-50 rounded-b-md justify-end flex items-center`}>
                      <div>
                        <Button
                          text="Criar"
                          className="rounded-sm w-[6rem] h-8 mr-4"
                          onClick={() => {
                            handleCreateInvestigated(close);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              }
            </Popup>
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
