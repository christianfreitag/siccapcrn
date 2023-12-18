import { CaretCircleDown, CaretDown } from "phosphor-react";
import { ElementType } from "react";
import { useNavigate } from "react-router-dom";


type titleItensType = {
  title: string;
  spacing: string
};

interface listTitlesInterface {
  titleItens: titleItensType[];
  btEnd?: boolean
}
export function ListTitles({
  titleItens,
  btEnd = false
}: listTitlesInterface) {

  const navigate = useNavigate();

  return (
    <div className=" p-1 flex w-full h-[3rem] text-lightBlack-100 justify-start font-bold text-[0.80rem] bg-neutral-900 shadow-sm rounded-b-none  md:text-sm items-center">
      {titleItens.map((value, index) => {
        return (
          <div
            className={`flex ${value.title != '' ? 'cursor-pointer' : ''} items-center whitespace-nowrap  #${index != 0 ? 'border-l-[1px]' : ''} pl-2 flex-1  h-8 `}
            key={index}
            onClick={() => {
              //order - pegar elemento que vai ordenar na interface
            }}
          >
            {value.title.toUpperCase()}

          </div>
        );
      })}
      {btEnd ? <CaretDown size="20px" className="mr-4" /> : null}
    </div>
  );
}
