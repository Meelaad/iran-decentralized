import React, { useEffect, useMemo, useState } from "react";

const CELL = 59;
const DEPTH_X = 30;
const DEPTH_Y = -30;

export default function BlockchainOverlay() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const onResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const cells = useMemo(() => {
        const cols = Math.ceil(size.width / CELL) + 2;
        const rows = Math.ceil(size.height / CELL) + 2;
        const items = [];

        for (let row = -1; row < rows; row += 1) {
            for (let col = -1; col < cols; col += 1) {
                const x = col * CELL;
                const y = row * CELL;
                const reverse = (row + col) % 2 === 0;
                const showCube = (row + col) % 3 === 0;

                items.push({
                    id: `${col}-${row}`,
                    x,
                    y,
                    reverse,
                    showCube,
                    duration: 9,
                    delay: 1,
                });
            }
        }

        return items;
    }, [size]);

    return (
        <svg
            className="grid-overlay"
            width={size.width}
            height={size.height}
            viewBox={`0 0 ${size.width} ${size.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>
                <filter id="overlayGlow">
                    <feGaussianBlur stdDeviation="1.2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <g className="svg-grid-drift">
                {cells.map((cell) => {
                    const forwardPath = `M ${cell.x} ${cell.y} H ${cell.x + CELL} V ${cell.y + CELL} H ${cell.x} V ${cell.y}`;
                    const reversePath = `M ${cell.x} ${cell.y} V ${cell.y + CELL} H ${cell.x + CELL} V ${cell.y} H ${cell.x}`;

                    const cubeForwardPath = `
                        M ${cell.x} ${cell.y}
                        H ${cell.x + CELL}
                        L ${cell.x + CELL + DEPTH_X} ${cell.y + DEPTH_Y}
                        V ${cell.y + CELL + DEPTH_Y}
                        L ${cell.x + CELL} ${cell.y + CELL}
                        H ${cell.x}
                        L ${cell.x + DEPTH_X} ${cell.y + CELL + DEPTH_Y}
                        V ${cell.y + DEPTH_Y}
                        L ${cell.x} ${cell.y}
                        Z
                    `;

                    const cubeReversePath = `
                        M ${cell.x} ${cell.y}
                        L ${cell.x + DEPTH_X} ${cell.y + DEPTH_Y}
                        H ${cell.x + CELL + DEPTH_X}
                        V ${cell.y + CELL + DEPTH_Y}
                        L ${cell.x + CELL} ${cell.y + CELL}
                        H ${cell.x}
                        V ${cell.y}
                        H ${cell.x + CELL}
                        L ${cell.x + CELL + DEPTH_X} ${cell.y + DEPTH_Y}
                        Z
                    `;

                    const motionPath = cell.showCube
                        ? (cell.reverse ? cubeReversePath : cubeForwardPath)
                        : (cell.reverse ? reversePath : forwardPath);

                    return (
                        <g key={cell.id}>
                            <rect
                                x={cell.x}
                                y={cell.y}
                                width={CELL}
                                height={CELL}
                                fill="none"
                                stroke="rgba(139,92,246,0.035)"
                                strokeWidth="1"
                            />

                            {cell.showCube && (
                                <>
                                    <rect
                                        x={cell.x + DEPTH_X}
                                        y={cell.y + DEPTH_Y}
                                        width={CELL}
                                        height={CELL}
                                        fill="none"
                                        stroke="rgba(139,92,246,0.018)"
                                        strokeWidth="1"
                                    />
                                    <line
                                        x1={cell.x}
                                        y1={cell.y}
                                        x2={cell.x + DEPTH_X}
                                        y2={cell.y + DEPTH_Y}
                                        stroke="rgba(139,92,246,0.018)"
                                        strokeWidth="1"
                                    />
                                    <line
                                        x1={cell.x + CELL}
                                        y1={cell.y}
                                        x2={cell.x + CELL + DEPTH_X}
                                        y2={cell.y + DEPTH_Y}
                                        stroke="rgba(139,92,246,0.018)"
                                        strokeWidth="1"
                                    />
                                    <line
                                        x1={cell.x}
                                        y1={cell.y + CELL}
                                        x2={cell.x + DEPTH_X}
                                        y2={cell.y + CELL + DEPTH_Y}
                                        stroke="rgba(139,92,246,0.018)"
                                        strokeWidth="1"
                                    />
                                    <line
                                        x1={cell.x + CELL}
                                        y1={cell.y + CELL}
                                        x2={cell.x + CELL + DEPTH_X}
                                        y2={cell.y + CELL + DEPTH_Y}
                                        stroke="rgba(139,92,246,0.018)"
                                        strokeWidth="1"
                                    />
                                </>
                            )}

                            <circle
                                r="1"
                                fill="rgba(139,92,246,0.3)"
                                filter="url(#overlayGlow)"
                            >
                                <animateMotion
                                    dur={`${cell.duration}s`}
                                    begin={`${cell.delay}s`}
                                    repeatCount="indefinite"
                                    path={motionPath}
                                />
                            </circle>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
}