import './PathNode.css'

interface NodeProps {
    col: number,
    isFinish: boolean,
    isStart: boolean,
    isWall: boolean,
    onMouseDown: (row: number, col: number) => void,
    onMouseEnter: (row: number, col: number) => void,
    onMouseUp: () => void,
    row: number
}

const PathNode = ({ col, isFinish, isStart, isWall, onMouseDown, onMouseEnter, onMouseUp, row }: NodeProps) => {
    const extraClassName = isFinish
        ? 'node-finish'
        : isStart
            ? 'node-start'
            : isWall
                ? 'node-wall'
                : '';

    return (
        <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}></div>
    )
}

export default PathNode