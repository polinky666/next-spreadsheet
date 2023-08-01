import { useState, useEffect, KeyboardEvent } from "react";
import { CellContent } from "@/types/spreadsheet";
interface Props {
    content: CellContent;
    onChange: (updated: CellContent) => void;
}

export default function Cell({ content: initialContent, onChange }: Props) {
    const [editing, setEditing] = useState<boolean>(false)
    const [content, setContent] = useState<CellContent>(initialContent)
    const onKeyDown = (event: KeyboardEvent) => {
        if (['Enter', 'Escape'].includes(event.key)) {
            setEditing(!editing)
        }
        if (event.key === 'Enter') {
            onChange(content)
        }
        if (event.key === 'Escape') {
            setContent(initialContent)
        }
    }
    useEffect(() => {
        setContent(initialContent)
    }, [initialContent])
    const evaluateFormula = (exp: string) => {
        const sanitized = exp.slice(1).replace(/[^\=\+\-\*%/0-9]/g, '');
        return eval(sanitized);
    };
    return (
        <td onClick={() => { setEditing(!editing) }}>
            {editing ? (
                <input
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={onKeyDown}
                    value={content}
                    onChange={(e) => { setContent(e.target.value) }}
                />
            ) : content.toString().startsWith('=') ? (
                evaluateFormula(content.toString())
            ) : (initialContent)}
        </td>
    )
}