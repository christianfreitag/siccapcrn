import { CaretLeft, CaretRight, Circle, FolderNotchOpen, MagnifyingGlass, SmileyXEyes } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { InputText } from "../../components/InputText";
import { ListDataFooter } from "../../components/ListData/ListDataFooter";
import { ListTitles } from "../../components/ListData/ListTitles";
import { UserContext } from "../../hooks/UserContext";
import { api } from "../../services/api";
import { analystStatus } from "./Constants";
import Select from "react-select";
import { analystType } from "../../components/Type/DataType";

export function Analysts() {
  const { logout } = useContext(UserContext);
  const query = new URLSearchParams(location.search);
  const { isAuth } = useContext(UserContext);
  const [analysts, setAnalysts] = useState([]);
  const locationState = useLocation() as { state: { status: number } };
  const [page, setPage] = useState(1);
  const [totalAnalysts, setTotalAnalysts] = useState(0);
  const navigate = useNavigate();
  const nPerPage = 8;

  const [analystSearch, setAnalystSearch] = useState("");

  {
    /*ON RENDER */
  }

  useEffect(() => {
    handleFindAllAnalystData();

  }, [locationState, page]);

  {
    /*HEARDER FILTER */
  }
  async function handleFindAllAnalystData() {
    await api
      .get("analysts", {
        withCredentials: true,
        params: {
          searchData: analystSearch ? analystSearch : "",
          status: query.get("status") ? query.get("status") : 9,
          countOnly: false,
          page: page,
        },
      })
      .then((res) => {
        setAnalysts(res.data[0]);
        
        setTotalAnalysts(res.data[0].length);
      })
      .catch((e) => {
        /*HandleError*/
      });
  }
  return (
    <div className={`h-full w-full overflow-hidden  rounded-md pt-6 bg-zinc-800`}>
      {/*HEADER FILTER */}
      <header className={`h-[5%] min-h-[3rem] w-full flex justify-between pl-8 pr-2 pt-2 `} onClick={() => {}}>
        <div className={`w-full font-semibold text-3xl text-lightBlack-100 flex `}>Analistas</div>
        <Button
          text="Novo"
          className={`rounded-md w-[10rem] ml-4 `}
          onClick={() => {
            navigate("/analistas=novo");
          }}
        />
      </header>
      <div className={`h-[6%] min-h-[3rem] w-full mt-5  rounded-md flex bg-black p-1`} onClick={() => {}}>
        <InputText className="mr-4 min-w-[18rem]  flex-1" input={analystSearch} setInput={setAnalystSearch} onEnter={handleFindAllAnalystData} placeholder={"Pesquise aqui.."} iconInput={<MagnifyingGlass />} />
        <Select
          placeholder="Status"
          className="z-40 min-w-[10rem] mr-4 flex-1 my-react-select-container"
          classNamePrefix="my-react-select"
          maxMenuHeight={200}
          isClearable={true}
          onChange={(e) => {
            query.set("status", String(e?.value));
            navigate("/analistas?" + query, { replace: true });
            setPage(1);
          }}
          value={
            query.get("status") != (null && undefined)
              ? analystStatus
                  .filter((v, i) => i < 4)
                  .map((a, i) => (i == 0 ? { label: a, value: 9 } : { label: a, value: i - 1 }))
                  .filter((e) => String(e.value) == query.get("status"))
              : undefined
          }
          options={analystStatus.filter((v, i) => i < 4).map((a, i) => (i == 0 ? { label: a, value: 9 } : { label: a, value: i - 1 }))}
        />
        <div className="rounded-md  min-w-[10rem]  h-10  flex mb-2 ">
          <div
            className="bg-neutral-900  h-10 w-10  rounded-l-md flex items-center justify-center cursor-pointer hover:bg-opacity-50"
            onClick={() => {
              page > 1 ? setPage(page - 1) : null;
            }}
          >
            <CaretLeft className={`${Math.ceil(totalAnalysts / 8) > 0 && page > 1 ? "text-zinc-400" : "text-gray-300 "}`} />
          </div>
          <div className="bg-zinc-800 w-[3rem] h-10 ml-2  flex items-center justify-center">
            {page}/{totalAnalysts / 8 > 0 ? Math.ceil(totalAnalysts / 8) : 1}
          </div>
          <div
            className="bg-neutral-900 h-10 w-10 ml-2 rounded-r-md flex items-center justify-center hover:bg-opacity-50 cursor-pointer"
            onClick={() => {
              page < Math.ceil(totalAnalysts / 8) ? setPage(page + 1) : null;
            }}
          >
            <CaretRight className={`${Math.ceil(totalAnalysts / 8) > 0 && page < Math.ceil(totalAnalysts / 8) ? "text-zinc-400" : "text-gray-300 "}`} />
          </div>
        </div>
      </div>

      <ListTitles
        titleItens={[
          { title: "Nome", spacing: "" },
          { title: "Status", spacing: "" },
          { title: "Afastamentos pendentes", spacing: "" },
        ]}
      />
      <div className={`h-auto overflow-y-scroll min-h-fit max-h-[60%] w-full p-1`}>
        {analysts.length > 0 ? (
          <div className="   rounded-md overflow-y-scroll h-fit max-h-[95%]">
            <div className={`overflow-y-scroll min-h-20  w-full `}>
              {analysts.map((value: analystType, index) => {
                return (
                  <div key={index} className={` pl-2 w-full justify-start  p-[1%] lg:text-[0.92rem]  md:text-sm ${index != analysts.length - 1 ? "border-b-[1px]" : ""}`}>
                    <div className={`flex justify-start cursor-pointer`}>
                      <span
                        onClick={() => {
                          navigate("/analistas=" + value.id);
                        }}
                        className="flex-1 "
                      >
                        {value.name}
                      </span>
                      <span className="flex-1">
                        <div className={`w-fit bg-neutral-900 p-1 rounded-full flex items-center pr-2`}>
                          <div
                            className={`w-2 h-2 rounded-full ml-1 mr-2 
                        ${["bg-green-500", "bg-red-300", "bg-yellow-400", "bg-red-300"][value.status]} `}
                          ></div>
                          {analystStatus[value.status + 1]} {value.Report.length>=1?<span className="text-sm ml-2 rounded-full text-gray-400 underline">{value.Report.length}</span>:null}
                        </div>
                      </span>
                      <span className="flex-1 ">{value.pending_vacation_days + " dias "}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="w-full h-20 flex items-center justify-center text-xl text-lightBlack-100">
            <FolderNotchOpen weight="thin" size={"80%"} className={"text-zinc-400 w-fit"} /> <p className="p-5">Nenhum item encontrado.</p>
          </div>
        )}
      </div>

      <div className="bg-neutral-900 w-full  flex items-center justify-center cursor-pointer hover:bg-opacity-50">Total: {totalAnalysts}</div>
    </div>
  );
}
