import { PopoverContent, PopoverHandler, Popover } from "@material-tailwind/react";
import { ArrowSquareOut, DotsThreeVertical, Download, Ghost, LinkBreak, Pencil, PencilLine, PencilSimpleLine, PlusCircle, Trash, TrashSimple } from "phosphor-react";
import { Link, useNavigate } from "react-router-dom";

import { ListTitles } from "../../components/ListData/ListTitles";
import { caseType, reportType } from "../../components/Type/DataType";
import { api } from "../../services/api";
import { report_status, report_types } from "../Reports_/Constants";

interface CaseReportListProps {
  reports: reportType[];
  setReports?: (nw: reportType[]) => void;
  id?: string;
  setWarning: (nw: { errors: string[]; status: "ok" | "info" | "error"; timer: boolean }) => void;
}
export function CaseReportList({ setWarning, reports, setReports, id }: CaseReportListProps) {
  const navigate = useNavigate();

  async function unlinkReport(id: string) {
    await api
      .patch<reportType>("reports/" + id, { case_id: null }, { withCredentials: true })
      .then((res) => {
        //@ts-ignore
        setReports(reports.filter((r) => r.id != id));
      })
      .catch((e) => {
        setWarning({ errors: ["Erro enquanto desvinculava relatório."], status: "error", timer: false });
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

  return id != "novo" ? (
    <div className={`w-full h-fit bg-zinc-800 rounded-md mt-4 relative`}>
      <div className={` w-full h-[5rem]  p-6 text-2xl text-lightBlack-100`}>Relatórios</div>
      <div className={`w-full h-fit 0 flex-row `}>
        <div className={` h-14 bg-neutral-900 w-full flex items-center  pl-6 pr-6 shadow-sm`}>
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
                      <Download size={"20px"} className={`${i.file ? "text-zinc-400" : "text-gray-200"}`} />
                    </span>
                    <Popover dismiss={{ ancestorScroll: true }} placement="bottom-end">
                      <PopoverHandler>
                        <DotsThreeVertical className="cursor-pointer" size={"23px"} />
                      </PopoverHandler>
                      <PopoverContent className={`rounded-sm h-fit  w-[8rem] shadow-md pt-3 p-0 duration-75 ml-2   bg-zinc-600 border-0`}>
                        <div className=" h-3 w-3 rotate-[135deg] translate-x-[-120%] -translate-y-[50%] bg-zinc-800 top-0 right-0 border-l-[1px] border-b-[1px] absolute z-auto "></div>
                        <div className="flex-row">
                          <Link to={"../relatorios=" + i.id}>
                            <div className="z-50 h-8 flex  items-center hover:bg-neutral-900 cursor-pointer w-full pl-4 justify-between">
                              Ver <ArrowSquareOut className={"text-base ml-1 mr-2"} />
                            </div>
                          </Link>
                          <Link to={"../relatorios=" + i.id} state={{ edit: true }}>
                            <div className="z-50 h-8 flex  items-center hover:bg-neutral-900 cursor-pointer w-full pl-4 justify-between">
                              Editar <PencilSimpleLine className={"text-base ml-1 mr-2"} />
                            </div>
                          </Link>
                          <div
                            className="z-50 h-8 flex  items-center hover:bg-neutral-900 cursor-pointer w-full pl-4 justify-between"
                            onClick={() => {
                              unlinkReport(i.id);
                            }}
                          >
                            Desvincular <LinkBreak className={"text-base ml-1 mr-2"} />
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
            )
          ) : null}
        </div>
        <div className={`min-h-[5rem] h-[90%] `}></div>
      </div>
      <div
        onClick={() => {
          navigate("../relatorios=novo", {
            state: {
              case_id: id,
            },
          });
        }}
        className={`absolute cursor-pointer right-6 bottom-4 flex items-center`}
      >
        {<PlusCircle size={"1.2rem"} weight={"light"} className={`mr-2`} />}Novo
      </div>
    </div>
  ) : null;
}

/*<Popover dismiss={{ ancestorScroll: true }} placement="bottom-end">
                      <PopoverHandler>
                        <DotsThreeVertical className="cursor-pointer" size={"23px"} />
                      </PopoverHandler>
                      <PopoverContent className={`rounded-sm h-fit  w-[8rem] shadow-md pt-3 p-0 duration-75 ml-2 border-[1px] `}>
                        <div className=" h-3 w-3 rotate-[135deg] translate-x-[-120%] -translate-y-[50%] bg-zinc-800 top-0 right-0 border-l-[1px] border-b-[1px] absolute z-auto "></div>
                        <div className="flex-row">
                          <Link to={"../relatorios/" + value.id}>
                            <div className="z-50 h-8 flex  items-center hover:bg-neutral-900 cursor-pointer w-full pl-4 justify-between">
                              Ver <ArrowSquareOut className={"text-base ml-1 mr-2"} />
                            </div>
                          </Link>
                          <Link to={"../relatorios/" + value.id} state={{ edit: true }}>
                            <div className="z-50 h-8 flex  items-center hover:bg-neutral-900 cursor-pointer w-full pl-4 justify-between">
                              Editar <PencilSimpleLine className={"text-base ml-1 mr-2"} />
                            </div>
                          </Link>
                          <div
                            className="z-50 h-8 flex  items-center hover:bg-neutral-900 cursor-pointer w-full pl-4 justify-between"
                            onClick={() => {
                              unlinkReport(value.id);
                            }}
                          >
                            Desvincular <LinkBreak className={"text-base ml-1 mr-2"} />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover> <div
        onClick={() => {
          navigate("../relatorios/novo", {
            state: {
              case_id: id,
            },
          });
        }}
        className={`absolute cursor-pointer right-6 bottom-4 flex items-center`}
      >
        {<PlusCircle size={"1.2rem"} weight={"light"} className={`mr-2`} />}Novo
      </div>*/
