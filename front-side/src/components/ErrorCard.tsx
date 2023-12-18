import { CaretRight, CheckCircle, Info, Warning, X } from "phosphor-react";
import { ReactNode, useEffect, useState } from "react";

interface ButtonProps {
    errors?: string[]
    status?: string

    timer?: number
    setErrors?: (nw:{
        errors: string[];
        status: "ok" | "info" | "error";
        timer: boolean;
      }) => void
}

export function ErrorCard({ timer = 0, status = "error", errors = ["Ocorreu um erro"], setErrors }: ButtonProps) {
    useEffect(() => {
        if (timer > 0) {
            setTimeout(() => { setErrors != undefined ? setErrors({ errors: [], status: "error", timer: false }) : null }, timer)
        }
    }, [])
    const [showMore, setShowMore] = useState(false)
    return (errors.length > 0 ? <div className={`h-fit w-[30vw] ${status == "error" ? 'bg-gray-50 border-b-[3px] border-red-500' : status == "ok" ? 'bg-gray-50 border-b-[3px] border-green-600' : 'bg-gray-50 border-b-[3px] border-yellow-500'} text-brand-100 fixed right-5 bottom-5 z-10 shadow-md rounded-md p-3 flex items-center`}>
        {errors.length == 1 ?

            <div className={'w-[95%] text-brand-100 flex items-center text-lg'}>
                {status == "error" ? <Warning className="mr-3 " size="25px" /> :
                    status == "ok" ? <CheckCircle className="mr-3 " size="25px" /> : <Info className="mr-3 " size="25px" />}
                {errors[0]}</div> :
            <div className={'w-[95%] text-brand-100 flex-col'}>
                <span className={`flex`}>{errors[0]} </span>
                <div className="max-h-[12rem] overflow-y-auto w-[90%]">{showMore ? errors.map((v, index) => { return <div key={index} className={`flex items-center  p-2 w-[90%]  ml-2`}> <CaretRight weight="fill" />{v}</div> }) : null}</div>
                <span className={`text-sm cursor-pointer underline`} onClick={() => { setShowMore(!showMore) }}> {!showMore ? <span>
                    Mostrar outros {errors.length - 1} erros.
                </span> : <span>Mostrar menos</span>} </span>



            </div>}
        <div className={'w-[5%] cursor-pointer'} onClick={() => { setErrors != undefined ? setErrors({ errors: [], status: "error", timer: false }) : null }}><X className="text-brand-100 p-2 h-8 w-8 hover:text-brand3-100 " /></div>
    </div> : null
    )


}
