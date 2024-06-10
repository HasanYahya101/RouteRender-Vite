import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Variable } from "lucide-react";


export function Playground() {
    const { toast } = useToast();
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
                                        : "bg-red-500 dark:bg-red-700"
                                }`}
                            onClick={() => handleGridClick(rowIndex, colIndex)}
                            onMouseEnter={() => handleGridClick(rowIndex, colIndex)}
                        />
                    )),
                )}
            </div>
            <div className="mt-8 flex gap-4">
                <StartDialogue handleStartNodeChange={handleStartNodeChange} startNode={startNode} />
                <EndDialogue handleEndNodeChange={handleEndNodeChange} endNode={endNode} />
                <Button
                    onClick={runPathfindingAlgorithm}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                    Run Algorithm
                </Button>
            </div>
            <Toaster />
        </div>)
    );
}


function StartDialogue({ handleStartNodeChange, startNode }) {
    const { toast } = useToast();
    const [row, setRow] = useState(0);
    const [column, setColumn] = useState(0);

    const [open, setOpen] = useState(false);

    function buttonClick() {
        if (row < 1 || row > 10 || column < 1 || column > 10) {
            toast({
                title: "Error",
                description: "The value in the inputs should be from 1 to 10 or between.",
                variant: "destructive",
            })
            return;
        }
        let row_ = row - 1;
        let column_ = column - 1;
        handleStartNodeChange(row_, column_);
        toast({
            title: "Success",
            description: "Start node has been set successfully.",
            variant: "success",
        })
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}
        >
            <DialogTrigger>
                <Button
                    onClick={() => handleStartNodeChange(0, 0)}
                    className={`px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors`}
                >
                    Set Start
                </Button>
            </DialogTrigger>
            <DialogContent className="w-96"
            >
                <DialogHeader>
                    <DialogTitle>Enter Start Grid (1-10)</DialogTitle>
                    <DialogDescription
                    >
                        <div className="flex gap-4 mt-4 w-full">
                            <div>
                                <Label htmlFor="row" className="mb-3 ml-1">Row</Label>
                                <Input type="number" placeholder="Row (1-10)" required value={row} onChange={(e) => setRow(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="column" className="mb-3 ml-1">Column</Label>
                                <Input type="number" placeholder="Column (1-10)" required value={column} onChange={(e) => setColumn(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors mt-4" onClick={buttonClick}
                        >
                            Set Start
                        </Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    );
}

function EndDialogue({ handleEndNodeChange, endNode }) {
    const { toast } = useToast();
    return (
        <Dialog>
            <DialogTrigger>
                <Button
                    onClick={() => handleEndNodeChange(9, 9)}
                    className={`px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors`}
                >
                    Set End
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}