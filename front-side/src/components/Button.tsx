import { CheckCircle, Icon, Info } from "phosphor-react";
import { ReactNode, useEffect, useState } from "react";

interface ButtonProps {
  text?: string;
  icon?: Icon
  textOnly?: boolean
  outline?: boolean
  disabled?: boolean
  className?: string
  confirm?: boolean
  confirmText?: string
  onClick?: () => void
}

export function Button({ textOnly = false, confirmText = "Confirmar", confirm = false, icon = undefined, text = "button", outline = false, disabled = false, className = "", onClick = (() => { }) }: ButtonProps) {
  const [awaitingConfirmMode, setAwaitConfirmModeChange] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isDelayed, setDelayAfterConfirm] = useState(false)

  //CONSTANTS
  const DELAY_TO_CONFIRMATION_MODE = 300
  const DURATION_CONFIRMATION_MODE = 1900
  const DELAY_SUCCESS_STATUS = 300

  useEffect(() => { }, [awaitingConfirmMode])
  return (
    <div onClick={() => {
      if (confirm) {
        if (!isDelayed) {
          setDelayAfterConfirm(true)
          if (awaitingConfirmMode) {
            setAwaitConfirmModeChange(false)
            setDelayAfterConfirm(false)
            setIsConfirmed(true)
            setTimeout(() => { setIsConfirmed(false); onClick() }, DELAY_SUCCESS_STATUS)
          } else {
            setTimeout(() => { setAwaitConfirmModeChange(true); setDelayAfterConfirm(false) }, DELAY_TO_CONFIRMATION_MODE)
            setTimeout(() => { setAwaitConfirmModeChange(false) }, DURATION_CONFIRMATION_MODE)
          }

        }
      } else {
        onClick()
      }
    }}
      className={`group h-full w-full  flex justify-center items-center ${textOnly ? `${awaitingConfirmMode ? `text-red-300` : `text-current`}` : `hover:ring-2 
      hover:border-[1px] ring-0  ${awaitingConfirmMode ? "ring-red-300" : 'ring-brand-50'} relative ${disabled ? 'bg-gray-100' : `${outline ? 'text-brand-100' : awaitingConfirmMode ? 'bg-red-300 text-white' : 'bg-brand-100 text-white'} 
      hover:bg-opacity-90  cursor-pointer hover:text-white`}`}  transition-all duration-100 ${className} ${isConfirmed && !textOnly ? 'bg-green-600' : ''}`}>

      <button disabled={disabled} className={``}>{awaitingConfirmMode ?
        <span className="flex items-center"><Info size={"1.2rem"} className={`mr-2`} /> <span className="">{confirmText}</span></span> :
        isConfirmed ?
          textOnly ?
            <span className="">Feito!</span> :
            <CheckCircle size={"1.2rem"} className={`mr-2`} /> :
          text}</button>

    </div>)
}
