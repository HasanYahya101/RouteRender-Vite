import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEffect } from "react";

export function Playground() {
    const [grid, setGrid] = useState([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    const [startNode, setStartNode] = useState([0, 0]);
    const [endNode, setEndNode] = useState([9, 9]);
    const [isRunning, setIsRunning] = useState(false);
    const handleGridClick = (row, col) => {
        if (!isRunning) {
            const newGrid = [...grid];
            newGrid[row][col] = newGrid[row][col] === 0 ? 1 : 0;
            setGrid(newGrid);
        }
    }
    const handleStartNodeChange = (row, col) => {
        if (!isRunning) {
            setStartNode([row, col]);
        }
    }
    const handleEndNodeChange = (row, col) => {
        if (!isRunning) {
            setEndNode([row, col]);
        }
    }
    const runPathfindingAlgorithm = () => {
        setIsRunning(true);
        const queue = [[startNode[0], startNode[1], 0]];
        const visited = new Set();
        const path = [];
        while (queue.length > 0) {
            const [row, col, distance] = queue.shift();
            const key = `${row},${col}`;
            if (visited.has(key)) continue;
            visited.add(key);
            if (row === endNode[0] && col === endNode[1]) {
                path.forEach(([r, c]) => {
                    const newGrid = [...grid];
                    newGrid[r][c] = 2;
                    setGrid(newGrid);
                })
                setIsRunning(false);
                return;
            }
            if (grid[row][col] === 0) {
                const newGrid = [...grid];
                newGrid[row][col] = 3;
                setGrid(newGrid);
                path.push([row, col]);
                queue.push([row - 1, col, distance + 1]);
                queue.push([row + 1, col, distance + 1]);
                queue.push([row, col - 1, distance + 1]);
                queue.push([row, col + 1, distance + 1]);
            }
        }
        setIsRunning(false);
    }

    return (
        (<div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Path Finding Algorithm Visualizer</h1>
            <div className="grid grid-cols-10 gap-1">
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-8 h-8 border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${cell === 0
                                ? "bg-white dark:bg-gray-800"
                                : cell === 1
                                    ? "bg-gray-400 dark:bg-gray-600"
                                    : cell === 2
                                        ? "bg-green-500 dark:bg-green-700"
                                        : "bg-blue-500 dark:bg-blue-700"
                                }`}
                            onClick={() => handleGridClick(rowIndex, colIndex)}
                            onMouseEnter={() => handleGridClick(rowIndex, colIndex)}
                        />
                    )),
                )}
            </div>
            <div className="mt-8 flex gap-4">
                <Button
                    onClick={() => handleStartNodeChange(0, 0)}
                    className={`px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors ${startNode[0] === 0 && startNode[1] === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Set Start
                </Button>
                <Button
                    onClick={() => handleEndNodeChange(9, 9)}
                    className={`px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors ${endNode[0] === 9 && endNode[1] === 9 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Set End
                </Button>
                <Button
                    onClick={runPathfindingAlgorithm}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                    Run Algorithm
                </Button>
            </div>
        </div>)
    );
}
