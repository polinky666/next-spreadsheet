import { useState, useEffect } from "react";
import Cell from "./Cell";
import { CellContent } from "@/types/spreadsheet";

export default function Spreadsheet() {
    const [cellContents, setCellContents] = useState<Array<Array<CellContent>>>([
        [1, 2, 3,],
        [4, 5, 6,],
        [7, 8, 9,],
    ]);
    const persist = () => {
        fetch("/api/cells", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ cells: cellContents }),
        });
    };
    useEffect(() => {
        fetch("/api/cells").then((res) =>
            res.text().then((s) => {
                const data = JSON.parse(s);
                if (data.cells) {
                    setCellContents(data.cells);
                }
            })
        );
    }, []);
    return (
        <>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        {cellContents[0].map((_, i) => (
                            <th>{String.fromCharCode(65 + i)}</th>
                        ))}
                    </tr>
                    {cellContents.map((row, i) => (<tr><td>{i + 1}</td>{row.map((cell, j) => (<Cell onChange={(updated: CellContent) => {
                        const updatedCellContents = [...cellContents]
                        updatedCellContents[i][j] = updated
                        setCellContents(updatedCellContents)
                    }} content={cell} />))}</tr>))}
                </tbody>
            </table>
            <button
                onClick={() => {
                    setCellContents([
                        ...cellContents,
                        Array(cellContents[0].length).fill(0),
                    ])
                }}
            >+ row</button>
            <button onClick={() => setCellContents(cellContents.slice(0, -1))}>- row</button>
            <br />
            <button onClick={() => setCellContents(cellContents.map(row => [...row, 0]))}>+ column</button>
            <button onClick={() => setCellContents(cellContents.map(row => row.slice(0, -1)))}>- column</button>
            <br />
            <button onClick={persist}>Save</button>
            <br />
            <button onClick={() => console.log(cellContents)}>button</button>
        </>
    )
}