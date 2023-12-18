import { PencilSimple } from "phosphor-react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/Button"
import { InputText } from "../../components/InputText"



interface caseVariablesProps {
    setNumCasoLab: (nw: string) => void
    setNumIp: (nw: string) => void
    setNumSei: (nw: string) => void
    setDemandantUnit: (nw: string) => void
    setOperationName: (nw: string) => void
    setObject: (nw: string) => void
    setInfoGeneralEditMode: (nw: boolean) => void
    fetchToVariables: () => void
    patch: () => void
    create: () => {}

    id?: string

    onSubmit: boolean
    infoGeneralEditMode: boolean,
    num_caso_lab: string,
    numSei: string,
    operationName: string,
    numIP: string,
    demandantUnit: string,
    object: string,

}

export function CaseGeneralInformation({ onSubmit = false, create, id, patch, fetchToVariables, infoGeneralEditMode, numIP, numSei, num_caso_lab, operationName, setDemandantUnit, setInfoGeneralEditMode, setNumCasoLab, setNumIp, setNumSei, setObject, setOperationName, demandantUnit, object, }: caseVariablesProps) {
    const navigate = useNavigate()
    return (
        <div className="h-fit mt-10 bg-white p-3 rounded-lg shadow-sm">
            <div className=" h-[10%] flex items-end">
                <span className="text-lightBlack-100 font-medium text-lg"> Informações gerais</span>
            </div>
            <div className={` h-fit p-2 pb-16 relative`}>
                <div className={` h-fit  flex flex-wrap p-1`}>
                    <div className={`flex-1 min-w-[20rem] mr-10 mb-6`}>
                        <InputText label={"Nº do caso LAB:"} input={num_caso_lab} setInput={setNumCasoLab} onSubmit={onSubmit} isNotOptional={true} isDisabled={infoGeneralEditMode} /></div>
                    <div className={`flex-1 min-w-[20rem] mr-10 mb-6`}>
                        <InputText label={"Nº do SEI:"} input={numSei} setInput={setNumSei} isNotOptional={true} onSubmit={onSubmit} isDisabled={infoGeneralEditMode} /></div>
                    <div className={`flex-1 min-w-[20rem] mr-10 mb-6`}>
                        <InputText label={"Nº do IP:"} input={numIP} setInput={setNumIp} isNotOptional={true} onSubmit={onSubmit} isDisabled={infoGeneralEditMode} /></div>
                </div>
                <div className={`bg-white h-fit w-full flex flex-wrap p-1 mt-4`}>
                    <div className={`mr-10 mb-6 flex-1 min-w-[20rem]`}>
                        <InputText label={"Nome da operação"} input={operationName} setInput={setOperationName} isNotOptional={true} onSubmit={onSubmit} isDisabled={infoGeneralEditMode} /></div>
                    <div className={`mr-10 mb-6 flex-1 min-w-[20rem]`}>
                        <InputText label={"Unidade demandante:"} input={demandantUnit} setInput={setDemandantUnit} isDisabled={infoGeneralEditMode} /></div>
                </div>
                <div className={`bg-white h-fit  flex flex-wrap p-1 mt-4`}>
                    <div className={`mr-10 mb-6  min-w-[20rem]`}>
                        <InputText label={"Objeto:"} input={object} setInput={setObject} isDisabled={infoGeneralEditMode} /></div>
                </div>
                {infoGeneralEditMode ? <div className={`absolute  right-2 bottom-2 flex items-center cursor-pointer `} onClick={() => { setInfoGeneralEditMode(false) }}>
                    {<PencilSimple className={`mr-2 `} />}Editar</div> :
                    <div className="w-60 h-8 absolute  right-2 bottom-2 flex items-center justify-between">
                        <Button text="Cancelar" className="bg-red-400  ring-red-400 hover:bg-red-400 rounded-sm" onClick={() => {
                            if (id != "novo") {
                                setInfoGeneralEditMode(!infoGeneralEditMode)
                                fetchToVariables()
                            } else {
                                navigate(-1)
                            }

                        }} />
                        <Button confirm={true} confirmText={""} text="Salvar" className="ml-4 rounded-sm " onClick={() => {
                            if (id != "novo") {
                                patch()
                            }
                            else {
                                create()
                            }
                        }} /></div>}
            </div>
        </div>
    )
}