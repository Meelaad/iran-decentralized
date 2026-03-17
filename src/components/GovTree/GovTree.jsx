import React, { useState, useCallback, useMemo } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { useLang } from '../../contexts/LangContext';
import SectorDetailPanel from './SectorDetailPanel';
import './GovTree.css';

function getLayoutedElements(nodes, edges, direction = 'LR') {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 100 });
    nodes.forEach(n => g.setNode(n.id, { width: 160, height: 60 }));
    edges.forEach(e => g.setEdge(e.source, e.target));
    dagre.layout(g);
    return {
        nodes: nodes.map(n => {
            const { x, y } = g.node(n.id);
            return { ...n, position: { x: x - 80, y: y - 30 } };
        }),
        edges,
    };
}

function SectorNode({ data, selected }) {
    const { t } = useLang();
    const borderColor = data.color || 'rgba(139,92,246,0.4)';
    return (
        <div
            className="gov-tree-node"
            style={{
                borderLeftColor: borderColor,
                borderLeftWidth: 3,
                opacity: 1,
                boxShadow: selected ? `0 0 0 1px ${borderColor}` : 'none',
            }}
        >
            <Handle type="target" position={Position.Left} style={{ background: 'rgba(139,92,246,0.4)', border: 'none', width: 6, height: 6 }} />
            <div className="gov-tree-node-icon">{data.icon}</div>
            <div className="gov-tree-node-label">{t(data.label)}</div>
            <div className="gov-tree-node-tier">{data.tier}</div>
            <Handle type="source" position={Position.Right} style={{ background: 'rgba(139,92,246,0.4)', border: 'none', width: 6, height: 6 }} />
        </div>
    );
}

const nodeTypes = { sectorNode: SectorNode };

export default function GovTree({ blueprint }) {
    const { t } = useLang();
    const [selectedSector, setSelectedSector] = useState(null);

    const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
        if (!blueprint) return { nodes: [], edges: [] };

        const rawNodes = (blueprint.sectors || []).map(sector => ({
            id: sector.id,
            type: 'sectorNode',
            data: {
                label: sector.label,
                icon: sector.icon,
                tier: sector.tier,
                color: sector.border || sector.color,
            },
            position: { x: 0, y: 0 },
        }));

        const rawEdges = (blueprint.connections || []).map(conn => ({
            id: `${conn.from}-${conn.to}`,
            source: conn.from,
            target: conn.to,
            label: t(conn.label),
            animated: (conn.strength || 1) >= 3,
            style: {
                strokeWidth: conn.strength || 1,
                stroke: 'rgba(139,92,246,0.4)',
            },
            labelStyle: { fill: '#8B5CF6', fontSize: 10 },
            labelBgStyle: { fill: 'rgba(7,16,26,0.8)', fillOpacity: 0.8 },
        }));

        return getLayoutedElements(rawNodes, rawEdges);
    }, [blueprint, t]);

    const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
    const [edges, , onEdgesChange] = useEdgesState(layoutedEdges);

    const handleNodeClick = useCallback((event, node) => {
        const sector = blueprint?.sectors?.find(s => s.id === node.id);
        setSelectedSector(sector || null);
    }, [blueprint]);

    if (!blueprint) return null;

    return (
        <div className="gov-tree-wrap">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.3}
                maxZoom={2}
                style={{ background: '#0a141f' }}
            >
                <Background color="rgba(139,92,246,0.05)" gap={20} />
                <Controls style={{ background: 'rgba(13,31,45,0.9)', border: '1px solid rgba(139,92,246,0.2)' }} />
                <MiniMap
                    style={{ background: 'rgba(13,31,45,0.9)', border: '1px solid rgba(139,92,246,0.15)' }}
                    nodeColor={() => 'rgba(139,92,246,0.3)'}
                    maskColor="rgba(7,16,26,0.7)"
                />
            </ReactFlow>

            <SectorDetailPanel
                sector={selectedSector}
                blueprintId={blueprint.id || 'decentralized'}
                onClose={() => setSelectedSector(null)}
            />
        </div>
    );
}
