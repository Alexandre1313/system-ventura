import { ChevronsLeft } from "react-feather";

interface BotaoArrowLeftProps {
    onClick?: () => void; // Define a prop onClick que o componente pai deve passar
    stringButtton: string
    iconSize: number
    bgColor?: string
    bgHoverColor?:string
    textColor?: string
    arrowColor?: string
    strokeWidth?: number
}

export default function BotaoArrowLeft(props: BotaoArrowLeftProps) {
    const bgColor = props.bgColor ? props.bgColor: 'bg-emerald-600'
    const bgHoverColor = props.bgHoverColor ? props.bgHoverColor: 'hover:bg-emerald-500'
    const textColor = props.textColor ? props.textColor: 'text-white'
    const arrowColor = props.arrowColor ? props.arrowColor: 'white'
    const strokeWidth = props.strokeWidth ? props.strokeWidth: 2
    return (
        <button
            type="button"
            onClick={props.onClick}  // Use a função onClick passada via props
            className={`px-4 py-4 ${bgColor} ${textColor} font-medium rounded-md flex text-[13px] w-[115px]
            items-center justify-center gap-x-3 ${bgHoverColor}
            ${bgHoverColor} transition duration-500`}
        >
            <ChevronsLeft className="animate-bounceXL" size={props.iconSize} color={arrowColor} strokeWidth={strokeWidth}/> {props.stringButtton}
        </button>
    )
}
