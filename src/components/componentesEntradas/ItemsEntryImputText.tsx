import { GradeItem } from "../../../core"
import { concat } from "../../../core/utils/tools"

export interface ItemsEntryImputTextProps {
    itemSelecionado?: GradeItem
    labelName: string
    value: string | undefined
}

export default function ItemsEntryImputText( props : ItemsEntryImputTextProps) {    
    return (
        <div className="flex flex-col items-start justify-center gap-y-3">
            <label htmlFor={`${concat(props.labelName)}-input`} className="flex text-left text-[15px]
            text-zinc-400 tracking-[2px]">
                {props.labelName}
            </label>
            <input className="flex p-2 w-full text-left text-[27px] bg-trans rounded-md  
            outline-none border border-gray-700 text-cyan-500 h-[50px] min-w-[374px]"
                type="text"
                name={`${concat(props.labelName)}`}
                id={`${concat(props.labelName)}-input`}
                value={props.value}
                readOnly
            />
        </div>
    )
}
