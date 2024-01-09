import { useState } from 'react';
import * as Dijkstra from "../algorithms/dijkstra.js"
import PathNode from './PathNode/PathNode'
import "./Visualizer.css"

const START_NODE_ROW = 15;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 15;

// Properties of an individual Node
export interface pathNode {
    col: number,
    row: number,
    isStart: boolean,
    isFinish: boolean,
    distance: number,
    isVisited: boolean,
    isWall: boolean,
    previousNode: pathNode | null | undefined
}

const Visualizer = () => {
    const [grid, setGrid] = useState(getInitialGrid())
    const [mouseIsPressed, setMouseIsPressed] = useState(false)

    function handleMouseDown(row: number, col: number) {
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid)
        setMouseIsPressed(true)
    }

    function handleMouseEnter(row: number, col: number) {
        if (!mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid)
    }

    function handleMouseUp() {
        setMouseIsPressed(false)
    }

    function animateDijkstra(visitedNodesInOrder: Array<pathNode>, nodesInShortestPathOrder: Array<pathNode>) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }

    function animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    }

    function visualizeDijkstra() {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = Dijkstra.dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = Dijkstra.getNodesInShortestPathOrder(finishNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    return (<>
        <button onClick={() => visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
        </button>
        <div className="grid">
            {grid.map((row, rowIdx) => {
                return (
                    <div key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                            const { row, col, isFinish, isStart, isWall } = node;
                            return (
                                <PathNode
                                    key={nodeIdx}
                                    col={col}
                                    isFinish={isFinish}
                                    isStart={isStart}
                                    isWall={isWall}
                                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                                    onMouseEnter={(row, col) =>
                                        handleMouseEnter(row, col)
                                    }
                                    onMouseUp={() => handleMouseUp()}
                                    row={row}></PathNode>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    </>
    )
}

const getInitialGrid = (): Array<Array<pathNode>> => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col: number, row: number): pathNode => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: undefined,
    };
};

const getNewGridWithWallToggled = (grid: Array<Array<pathNode>>, row: number, col: number) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

export default Visualizer