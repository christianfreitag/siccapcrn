
import moment from "moment";
import { CaretCircleLeft, CaretCircleRight, GitCommit, SmileyXEyes } from "phosphor-react"
import { useEffect, useRef, useState } from "react";


interface timelineProps {
    lenDataNotNull: number
    data?: { date?: string, color1: string, color2: string, description: string }[]

}

export function Timeline({ data, lenDataNotNull }: timelineProps) {
    console.log("T:",data)
    const [minVisible, setMinVisible] = useState(0);
    const [maxVisible, setMaxVisible] = useState(0)
    //@ts-ignore


    useEffect(() => {
        mainConfigurations()
        

    }, [data])

    function mainConfigurations() {
        let width = window.innerWidth;


        let perTimeLine = width > 1300 ? 5 :
            width <= 1300 && width > 900 ? 4 :
                width > 600 && width <= 900 ?
                    3 : 2
        if (data != null) {
            setMinVisible((data.length - perTimeLine) <= 0 ? 0 : (data.length - perTimeLine))
            setMaxVisible(data.length)
           
        }
    }



    //TAILWIND DANDO PROBLEMAS COM AS CORES
    return (

        data != null ?
            <div className={` w-full h-full flex min-h-[5rem] items-center p-2`}>
                <div className={`h-full w-16  flex  justify-center items-center cursor-pointer `} onClick={() => {

                    if (minVisible > 0) {
                        setMaxVisible(maxVisible - 1)
                        setMinVisible(minVisible - 1)
                    }
                }}>
                    <CaretCircleLeft size={"1.8rem"} weight={"light"} color={`${minVisible > 0 ? '#6F90AF' : '#BFBFBF'}`} />
                </div>
                <div className={`h-full w-full  flex items-center  `}>
                    {data?.map((value, index) => {

                        return (
                            index < maxVisible && index >= minVisible ? <div key={index} className={`flex-row items-center justify-center  h-full flex-1   rounded-md`}>
                                <div className="noselect flex w-full h-[40%]  items-center justify-center text-lightBlack-100 text-sm">
                                    <span className={`text-lightBlack-100 ${value.date != undefined ? 'visible' : 'hidden'}`}>
                                        {value.date != undefined ? moment(value.date).add(1, 'day').format("DD/MM/YYYY") : "none"}
                                    </span>
                                </div>
                                <div className={`flex items-center h-[20%]  w-full $border-r-[3px]`}>
                                    <div style={{ 'backgroundColor': value.color1 }} className={`h-[0.1rem] w-full`}></div>
                                    <div style={{ 'borderColor': value.color1 }} className={`h-5 w-10 rounded-full bg-transparent border-[2px]`}></div>
                                    <div style={{ 'backgroundColor': value.color2 }} className={`h-[0.1rem] w-full  `}></div>
                                </div>
                                <div className="noselect flex w-full  h-[40%]  $border-r-[3px] items-center justify-center text-sm p-4 overflow-hidden">
                                    <span className={`text-lightBlack-100  text-center`}>{value.date != undefined || (value.date == undefined && index > 0 ? (data[index - 1].date != undefined) : false) || (index == 0 && value.date == undefined) ? value.description : ""}</span>
                                </div>
                            </div> : null)
                    })}
                </div>
                <div className={`h-full w-16  flex justify-center items-center cursor-pointer `} onClick={() => {
                    if (maxVisible < data.length) {
                        setMaxVisible(maxVisible + 1)
                        setMinVisible(minVisible + 1)
                    }

                }}>
                    <CaretCircleRight size={"1.8rem"} weight={"light"} color={`${maxVisible < data.length ? '#6F90AF' : '#BFBFBF'}`} /></div>
            </div > : null)

}