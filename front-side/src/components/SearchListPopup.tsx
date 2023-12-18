import { Eye, Info, MagnifyingGlass, PlusCircle, Question, SmileyXEyes, XCircle } from "phosphor-react";
import { ReactNode, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { Button } from "./Button";
import { InputText } from "./InputText";
import { ListDataFooter } from "./ListData/ListDataFooter";
import { ListTitles } from "./ListData/ListTitles";
import { analystType, caseType, reportType, requestType } from "./Type/DataType";


interface searchListPopupProps {
    trigger: JSX.Element,

    searchData: string,
    setSearchData: (nw: string) => void
    dataList?: { id?: string }[]
    totalData: number

    page: number,
    setPage: (nw: number) => void

    searchFunction?: () => {},
    onSelect: (op: string[]) => void
    selectedItem?: string
    onOpen?: () => {}
    isDisabled?: boolean
    maxSelected?: number
}

export function SearchListPopup({ selectedItem = "", maxSelected = 1, onSelect, isDisabled = false, dataList = [], searchFunction, onOpen, trigger, page, setPage, totalData, searchData, setSearchData }: searchListPopupProps) {


    const [selected, setSelected] = useState<string[]>(selectedItem != "" ? [selectedItem] : [])

    return (
        <Popup modal={true} disabled={isDisabled} onOpen={() => { onOpen; setSelected(selectedItem != "" ? [selectedItem] : []) }} overlayStyle={{ 'backgroundColor': 'rgba(0, 0, 0,0.15)' }} closeOnDocumentClick={true} lockScroll={true}
            trigger={trigger} >
            {
                //@ts-ignore
                (close) => (<div className="w-[50rem] h-[30rem] bg-white rounded-md shadow-md flex-col p-2">
                    <header className={`w-full h-[15%]  p-2`}>
                        <div className="flex h-full">
                            <InputText
                                input={searchData}
                                onEnter={searchFunction}
                                setInput={setSearchData}
                                iconInput={<MagnifyingGlass weight="light" />} placeholder="Pesquise aqui.." />
                            <Button className="h-[82%] ml-2 w-[20%] rounded-md" text="Procurar" onClick={searchFunction} />
                        </div>

                    </header>

                    <section className={`w-full h-[68%]  p-2`}>
                        <span className="pb-2 text-lightBlack-100 flex items-center"><Question size={"18px"} weight="duotone" className="mr-2" />Selecione um item para <p className="underline ml-1 font-semibold"> adicionar</p>. Para fechar <XCircle size={"18px"} weight="duotone" className=" ml-1 mr-1" /> basta clicar fora.</span>
                        {dataList.length > 0 ? <div className={` rounded-md h-full w-full  overflow-y-auto`}>
                            <div className="flex border-b-[1px] p-1 font-semibold">
                                {dataList.length > 0 ? Object.entries(dataList[0]).map((value, rowIndex) => {
                                    return (
                                        value[0] != "id" ? <span key={rowIndex} className="flex-1">{value[0]}</span> : null
                                    )
                                }) : null}
                                <div className="w-16"></div>
                            </div>
                            {dataList != null ? dataList.map((item, index) => {
                                const itemId = item.id as string
                                return (
                                    <div key={index} className={` group   flex ${index % 2 != 0 ? 'bg-slate-200' : 'bg-transparent'} h-fit p-1 items-center`}>
                                        {/*@ts-ignore */}

                                        {Object.entries(item).map((value: [string, string], indexCol) => {
                                            return (
                                                value[0] != "id" ? <span key={indexCol} className="flex-1 ">{value[1]}</span> : null
                                            )
                                        })
                                        }
                                        <div className="mr-2 flex w-16 justify-end text-lightBlack-100 "
                                            onClick={() => {
                                                selected.includes(itemId) ?
                                                    setSelected(selected.filter(x => x != item["id"])) :
                                                    selected.length >= maxSelected ?
                                                        setSelected([itemId]) :
                                                        setSelected([...selected, itemId])
                                            }}>
                                            <div className={`w-5 h-5 bg-gray-50 rounded-md cursor-pointer flex items-center justify-center border-[1px]`}>
                                                {selected.includes(itemId) ? <div className={`w-[60%] h-[60%] bg-brand-100 rounded-sm cursor-pointer flex i  tems-center justify-center`}></div> : null}
                                            </div>
                                        </div>

                                    </div>
                                )
                            }) : null}
                        </div> : <div className="w-full h-[80%] flex items-center justify-center"><SmileyXEyes weight="duotone" size={"40%"} className={"text-slate-400 w-fit"} /> Não foi encontrado nenhum item.</div>}
                    </section>
                    <footer className={`w-full h-[12%] p-2 mt-6 flex`}>
                        <ListDataFooter
                            page={page}
                            showTotal={false}
                            nPerPage={8}
                            totalData={totalData}
                            setPage={setPage}
                        />
                        <div className={`w-full flex justify-end `}>
                            <Button text="Criar novo" confirm={true} textOnly={true} className="w-24 rounded-sm  underline " />
                            <Button text="Remover" textOnly={true} className="w-24 rounded-sm underline" onClick={() => { onSelect([]); close() }} />
                            {<Button text="Adicionar" disabled={selected.length > 0 ? false : true} className="w-28 rounded-sm ml-2 " onClick={() => { onSelect(selected); close() }} />}
                        </div>



                    </footer>

                </div >)
            }
        </Popup >
    )
}