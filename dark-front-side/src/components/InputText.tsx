import { ArrowSquareOut, Asterisk, Icon, X } from "phosphor-react";
import { ReactNode, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { report_types } from "../pages/Reports_/Constants";


interface InputTextProps {
  iconInput?: ReactNode;
  border?: boolean;
  typeInput?: string;
  cleanBt?: boolean;
  label?: string;
  input: string;
  focused?: boolean;
  refOnDisable?: string;
  className?: string;
  isNotOptional?: boolean;
  onEnter?: () => void;
  onSubmit?: boolean;
  placeholder?: string;
  labelPosition?: "left" | "top";
  typeData?: "text" | "date" | "email" | "cpf"|"password";

  setInput?: (input: string) => void;
  isDisabled?: boolean;
}
export function InputText({
  className = "",
  refOnDisable,
  onSubmit = false,
  typeInput = "input",
  onEnter = undefined,
  placeholder,
  typeData = "text",
  labelPosition = "top",
  iconInput = null,
  border = true,
  cleanBt = true,
  label = undefined,
  input,
  setInput,
  isDisabled = false,
  focused = false,
  isNotOptional = false,
}: InputTextProps) {
  const [isFocused, setFocus] = useState(false);
  const isError = isNotOptional && (input == "" || (input == (0 || "0") && typeInput == "select")) && onSubmit ? true : false;

  useEffect(() => {}, []);
  const cpfMask = (value: string) => {
    return value
      .replace(/\D/g, "") // substitui qualquer caracter que nao seja numero por nada
      .replace(/(\d{3})(\d)/, "$1.$2") // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1"); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
  };

  return (
    <div className={`relative h-14 ${labelPosition == "left" ? "flex items-center" : "flex-col"} w-full ${className}`}>
      <span className={`noselect font-normal ${isError ? "text-red-500" : `${isDisabled ? "text-gray-400" : "text-lightBlack-100"}`} ${labelPosition == "left" ? "mr-4" : ""}`}>
        <div className="flex items-baseline ">
          {label}
          {isNotOptional && !isDisabled ? <Asterisk className="ml-2" /> : null}
        </div>
      </span>

      <div
        className={` ${isError ? "border-red-500" : "border-gray-300"}  transparent h-10 w-full rounded-[0.3rem] ${border ? "border-[1px]" : ""} flex items-center p-1 justify-between ${
          isFocused || focused ? `ring-1 ${isError ? "ring-red-500" : "ring-brand-100"}` : ""
        } `}
      >
        {iconInput != undefined ? <div className={` h-full w-10 flex items-center justify-center`}>{iconInput}</div> : null}
        <div className={`h-full items-center flex w-full pl-2 pr-2 relative`}>
          {typeInput == "input" ? (
            <input
              type={typeData}
              alt={label}
              disabled={isDisabled}
              placeholder={placeholder}
              className={` z-10 border-0   focus:outline-none focus: w-full h-full bg-transparent disabled:bg-transparent disabled:text-gray-400 `}
              onKeyDown={(e) => {
                if (onEnter && e.key == "Enter") {
                  onEnter();
                }
              }}
              onChange={(e) => {
                setInput ? setInput(typeData == "cpf" ? cpfMask(e.target.value) : e.target.value) : null;
              }}
              value={input}
              onFocus={() => {
                setFocus(true);
              }}
              onBlur={() => {
                setFocus(false);
              }}
            />
          ) : (
            <select
              onChange={(e) => {
                setInput ? setInput(e.target.value) : null;
              }}
              value={input}
              disabled={isDisabled}
              className={` z-10 border-0 focus:outline-none focus: w-full h-full bg-transparent disabled:bg-transparent disabled:text-gray-400 `}
              onFocus={() => {
                setFocus(true);
              }}
              onBlur={() => {
                setFocus(false);
              }}
            >
              {report_types.map((v, index) => {
                return (
                  <option key={index} value={index}>
                    {v}
                  </option>
                );
              })}
            </select>
          )}

          {isDisabled && refOnDisable ? (
            <Link to={refOnDisable}>
              <div className="cursor-pointer  p-1">
                <ArrowSquareOut />
              </div>
            </Link>
          ) : null}
        </div>
        {cleanBt && !isDisabled ? (
          <div
            className={`border-l-[1px] ${isError ? "border-l-red-500" : ""} w-10 flex items-center justify-center cursor-pointer`}
            onClick={() => {
              setInput ? setInput("") : null;
            }}
          >
            <X color={isError ? "red" : "gray"} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
