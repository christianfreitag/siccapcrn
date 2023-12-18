import { PlusCircle } from "phosphor-react";
import { useNavigate } from "react-router-dom";

import { ListTitles } from "../../components/ListData/ListTitles";
import { caseType, requestType } from "../../components/Type/DataType";
import { api } from "../../services/api";

interface CaseRequestListProps {
  case_?: caseType;
  setCase?: (nw: caseType) => void;
  id?: string;
}
export function CaseRequestList({ case_, setCase, id }: CaseRequestListProps) {
  const navigate = useNavigate();

  return id != "novo" ? (
    <div className={`w-full h-fit bg-white rounded-md mt-4 relative`}>
      <div className={` w-full h-[5rem]  p-6 text-2xl text-lightBlack-100`}>Solicitações</div>

      {
        case_?.Requests != null && case_.Requests.length > 0 ? (
          <div className={` h-[75%]   rounded-md mt-2 pb-2`}>
            <div className={` h-14 bg-gray-100 w-full flex items-center  pl-6 pr-6 shadow-sm`}>
              {["Nº do solicitação"].map((v, i) => {
                return (
                  <div key={v} className={`flex-1 font-semibold`}>
                    {v}
                  </div>
                );
              })}
            </div>
            <div className={`overflow-y-scroll  h-[80%] pb-10 w-full`}>
              {case_?.Requests.map((value: requestType, index) => {
                return (
                  <div key={index} className={`flex items-center justify-between pl-6 pr-6 h-[4rem] border-b-[1px]`}>
                    <div className={`flex justify-start`}>
                      <span
                        onClick={() => {
                          navigate("../solicitacoes=" + value.id);
                        }}
                        className="flex-1 ml-2 font-semibold cursor-pointer"
                      >
                        {value.num_request}
                      </span>
                      {/*span className="flex-1 ">{value.Investigated_requests.length}</span>*/}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null /*<div className=" flex justify-center h-10 items-center pr-20">Não foi encontrado nenhuma solicitação. Aperte em <span className="text-brand-100 font-semibold flex items-center pl-2 pr-2"> <PlusCircle size={"1.2rem"} weight={"light"} /> Novo </span> para criar uma.</div>*/
      }

      <div
        onClick={() => {
          navigate("../solicitacoes=novo");
        }}
        className={`absolute cursor-pointer right-6 bottom-4 flex items-center `}
      >
        {<PlusCircle size={"1.2rem"} weight={"light"} className={`mr-2`} />}Novo
      </div>
    </div>
  ) : null;
}
