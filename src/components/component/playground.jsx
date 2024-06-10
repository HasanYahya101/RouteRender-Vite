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
    const [algoClicked, setAlgoClicked] = useState(false);

    const handleGridClick = (row, col) => {
        if ((row === startNode[0] && col === startNode[1]) || (row === endNode[0] && col === endNode[1])) {
            return;
        }
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
        // check if 4 or 5 is present in the grid
        let flag = false;
        grid.forEach((row) => {
            row.forEach((cell) => {
                if (cell === 4 || cell === 5) {
                    flag = true;
                }
            });
        });
        if (flag) {
            toast({
                title: "Error",
                description: "Tiles from last run (yellow or blue) are present in the maze. Clearing the maze before running the algorithm.",
                variant: "destructive",
            });

            const newGrid = [...grid];
            newGrid.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    if (cell === 4 || cell === 5) {
                        newGrid[rowIndex][colIndex] = 0;
                    }
                });
            });
            setGrid(newGrid);
        }
        setAlgoClicked(true);
        setIsRunning(true);

        const newGrid = [...grid];
        const directions = [
            [-1, 0], // Up
            [1, 0],  // Down
            [0, -1], // Left
            [0, 1],  // Right
        ];

        const dijkstra = () => {
            const pq = [[startNode[0], startNode[1], 0]];
            const distances = Array(grid.length).fill(null).map(() => Array(grid[0].length).fill(Infinity));
            const previous = Array(grid.length).fill(null).map(() => Array(grid[0].length).fill(null));
            distances[startNode[0]][startNode[1]] = 0;

            while (pq.length > 0) {
                pq.sort((a, b) => a[2] - b[2]);
                const [row, col, dist] = pq.shift();

                if (row === endNode[0] && col === endNode[1]) {
                    const path = [];
                    let current = [endNode[0], endNode[1]];
                    while (current) {
                        path.unshift(current);
                        current = previous[current[0]][current[1]];
                    }
                    return { path, found: true };
                }

                for (const [dx, dy] of directions) {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    if (
                        newRow >= 0 && newRow < grid.length &&
                        newCol >= 0 && newCol < grid[0].length &&
                        grid[newRow][newCol] !== 1 &&
                        distances[newRow][newCol] > dist + 1
                    ) {
                        distances[newRow][newCol] = dist + 1;
                        previous[newRow][newCol] = [row, col];
                        pq.push([newRow, newCol, dist + 1]);
                    }
                }
            }
            return { path: [], found: false };
        };

        const { path, found } = dijkstra();

        if (found) {
            const animatePath = (path, color) => {
                path.forEach(([r, c], index) => {
                    setTimeout(() => {
                        newGrid[r][c] = color;
                        setGrid([...newGrid]);
                        if (index === path.length - 1) {
                            setIsRunning(false);
                            setAlgoClicked(false);
                        }
                    }, index * 100);
                });
            };

            animatePath(path, 4); // Blue for explored path
            setTimeout(() => animatePath(path, 5), path.length * 100); // Yellow for shortest path

            // copy grid
            let new_grid = [...grid];
            new_grid[startNode[0]][startNode[1]] = 2;
            new_grid[endNode[0]][endNode[1]] = 3;
            setGrid(new_grid);
        } else {
            toast({
                title: "Error",
                description: "No path found.",
                variant: "destructive",
            });
            setIsRunning(false);
            setAlgoClicked(false);

            // copy grid
            let new_grid = [...grid];
            new_grid[startNode[0]][startNode[1]] = 2;
            new_grid[endNode[0]][endNode[1]] = 3;
            setGrid(new_grid);
        }
    };


    useEffect(() => {
        if (isRunning) {
            toast({
                title: "Info",
                description: "Algorithm is running. Please wait.",
            });
        }
    }, [isRunning]);


    useEffect(() => {
        const newGrid = [...grid];
        // reset the already set start and end nodes
        newGrid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 2 || cell === 3) {
                    newGrid[rowIndex][colIndex] = 0;
                }
            });
        });
        newGrid[startNode[0]][startNode[1]] = 2;
        newGrid[endNode[0]][endNode[1]] = 3;
        setGrid(newGrid);
    }, [startNode, endNode]);

    /**
     * Colors:
     * 0 - white (Unselected)
     * 1 - gray (Selected)
     * 2 - green (Start Node)
     * 3 - red (End Node)
     * 4 - blue (Path Algorithm)
     * 5 - yellow (shortest path)
     */

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
                                        : cell === 3 ? "bg-red-500 dark:bg-red-700"
                                            : cell === 4 ? "bg-blue-500 dark:bg-blue-700"
                                                : "bg-yellow-500 dark:bg-yellow-700"
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
                {algoClicked === false ?
                    (
                        <Button
                            onClick={runPathfindingAlgorithm}
                            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                            Run Algorithm
                        </Button>
                    ) : (
                        <Button disabled
                            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                            Run Algorithm
                        </Button>
                    )}
            </div>
            <Toaster />
        </div>)
    );
}


function StartDialogue({ handleStartNodeChange, startNode }) {
    const { toast } = useToast();
    const [row, setRow] = useState(startNode[0] + 1);
    const [column, setColumn] = useState(startNode[1] + 1);

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
                    onClick={() => setOpen(true)}
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
                        <Button className="px-4 py-2 rounded-md w-full bg-green-500 text-white hover:bg-green-600 transition-colors mt-4" onClick={buttonClick}
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
    const [open, setOpen] = useState(false);

    const [row, setRow] = useState(endNode[0] + 1);
    const [column, setColumn] = useState(endNode[1] + 1);

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
        handleEndNodeChange(row_, column_);
        toast({
            title: "Success",
            description: "End node has been set successfully.",
            variant: "success",
        })
        setOpen(false);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}
        >
            <DialogTrigger>
                <Button
                    onClick={() => setOpen(true)}
                    className={`px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors`}
                >
                    Set End
                </Button>
            </DialogTrigger>
            <DialogContent className="w-96"
            >
                <DialogHeader>
                    <DialogTitle>Enter End Grid (1-10)
                    </DialogTitle>
                    <DialogDescription>
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
                        <Button className="px-4 py-2 w-full rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors mt-4" onClick={buttonClick}
                        >
                            Set End
                        </Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    );
}