import React, { useState, useEffect, useRef } from 'react';
import { GraphNode, GraphEdge } from '../types';
import { Network, Eye, Layers, Zap, Info, ShieldAlert, ShieldCheck } from 'lucide-react';

interface GraphVisualizerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isPhishing: boolean;
  confidenceScore: number;
  gatAttentionSummary: string;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  nodes,
  edges,
  isPhishing,
  confidenceScore,
  gatAttentionSummary,
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeLayer, setActiveLayer] = useState<'graph' | 'embeddings' | 'layers'>('graph');
  const [attentionThreshold, setAttentionThreshold] = useState<number>(0.1);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Position nodes in an organic curved arc layout
  const width = 640;
  const height = 280;

  // Calculate layout coordinates for nodes
  const layoutNodes = nodes.map((node, i) => {
    const total = nodes.length;
    // Circular / elliptical arc distribution
    const angle = (i / Math.max(1, total - 1)) * Math.PI * 0.85 + Math.PI * 0.08;
    const rx = width * 0.42;
    const ry = height * 0.36;
    const cx = width / 2;
    const cy = height * 0.48;

    const x = cx + rx * Math.cos(angle + Math.PI);
    const y = cy + ry * Math.sin(angle);

    return {
      ...node,
      x: Math.max(50, Math.min(width - 50, x)),
      y: Math.max(45, Math.min(height - 45, y)),
    };
  });

  const getNodeColor = (category: string, threatWeight: number) => {
    if (category === 'urgency') return '#f43f5e'; // Rose
    if (category === 'call_to_action') return '#fbbf24'; // Amber
    if (category === 'url') return '#c084fc'; // Purple
    if (category === 'entity') return '#38bdf8'; // Sky
    if (category === 'salutation') return '#94a3b8'; // Slate
    return threatWeight > 0.6 ? '#f43f5e' : '#34d399'; // Emerald or threat
  };

  const visibleEdges = edges.filter(e => e.weight >= attentionThreshold);

  return (
    <div className="bg-[#121217] border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3 select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Network className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
              <span>GAT Token Relational Graph</span>
              <span className="text-[10px] font-mono font-normal text-slate-400">
                ({nodes.length} Nodes, {edges.length} Edges)
              </span>
            </h3>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveLayer('graph')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              activeLayer === 'graph' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Graph Attention
          </button>
          <button
            onClick={() => setActiveLayer('embeddings')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              activeLayer === 'embeddings' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DistilBERT (768-D)
          </button>
          <button
            onClick={() => setActiveLayer('layers')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              activeLayer === 'layers' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GAT Architecture
          </button>
        </div>
      </div>

      {activeLayer === 'graph' && (
        <>
          {/* Summary Banner */}
          <div className="p-2.5 bg-slate-900/50 border border-slate-800/60 rounded-lg text-xs flex items-start gap-2.5">
            <Zap className={`w-4 h-4 shrink-0 mt-0.5 ${isPhishing ? 'text-rose-400' : 'text-emerald-400'}`} />
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <strong className="text-white font-semibold">GAT Attention Insights: </strong>
              {gatAttentionSummary}
            </p>
          </div>

          {/* Interactive Graph Canvas */}
          <div className="relative w-full h-[270px] bg-[#0A0A0D] rounded-lg border border-slate-800/60 overflow-hidden flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full"
            >
              <defs>
                {/* Gradient for attention edges */}
                <linearGradient id="edgeGradPhish" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="edgeGradClean" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.6" />
                </linearGradient>

                {/* Arrow markers */}
                <marker id="arrowPhish" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" opacity="0.8" />
                </marker>
                <marker id="arrowClean" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" opacity="0.6" />
                </marker>
              </defs>

              {/* Draw Edges */}
              {visibleEdges.map((edge, i) => {
                const sourceNode = layoutNodes.find(n => n.id === edge.source);
                const targetNode = layoutNodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isDiscontinuous = edge.type === 'discontinuous_semantic';
                const isSelected = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);
                const strokeWidth = Math.max(1.2, edge.weight * 3.5);
                const isHighThreat = edge.weight > 0.75;

                return (
                  <g key={`edge-${i}`}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isHighThreat ? 'url(#edgeGradPhish)' : 'url(#edgeGradClean)'}
                      strokeWidth={isSelected ? strokeWidth + 1.5 : strokeWidth}
                      strokeDasharray={isDiscontinuous ? '4 3' : 'none'}
                      markerEnd={isHighThreat ? 'url(#arrowPhish)' : 'url(#arrowClean)'}
                      opacity={isSelected ? 1.0 : isDiscontinuous ? 0.85 : 0.6}
                    />
                    {/* Attention weight label in center of edge on hover */}
                    {isSelected && (
                      <text
                        x={(sourceNode.x + targetNode.x) / 2}
                        y={(sourceNode.y + targetNode.y) / 2 - 5}
                        fill="#cbd5e1"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="bg-slate-900 px-1"
                      >
                        α={edge.weight.toFixed(2)}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {layoutNodes.map((node) => {
                const color = getNodeColor(node.category, node.threatWeight);
                const isSelected = selectedNode?.id === node.id;
                const nodeRadius = 14 + node.attentionScore * 7;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-transform duration-200"
                    onClick={() => setSelectedNode(node)}
                    onMouseEnter={() => setSelectedNode(node)}
                  >
                    {/* Glowing halo for high attention nodes */}
                    {node.attentionScore > 0.7 && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={nodeRadius + 6}
                        fill={color}
                        opacity={0.2}
                        className="animate-pulse"
                      />
                    )}

                    {/* Outer Ring */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeRadius}
                      fill="#0e0e12"
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 2}
                    />

                    {/* Inner fill proportional to threat */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeRadius * 0.55}
                      fill={color}
                      opacity={0.35 + node.threatWeight * 0.45}
                    />

                    {/* Node Text Label */}
                    <text
                      x={node.x}
                      y={node.y + 3.5}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="600"
                      textAnchor="middle"
                      className="pointer-events-none select-none font-sans"
                    >
                      {node.label.length > 9 ? node.label.substring(0, 8) + '…' : node.label}
                    </text>

                    {/* Category indicator pill underneath */}
                    <text
                      x={node.x}
                      y={node.y + nodeRadius + 11}
                      fill="#94a3b8"
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                    >
                      α={node.attentionScore.toFixed(2)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Quick Legend Overlay */}
            <div className="absolute top-2 left-2 flex items-center gap-2 text-[10px] bg-slate-900/90 px-2.5 py-1 rounded border border-slate-800/80 font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Urgency
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Action
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span> URL
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Normal
              </span>
            </div>
          </div>

          {/* Node Inspector Card */}
          {selectedNode ? (
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: getNodeColor(selectedNode.category, selectedNode.threatWeight) }}
                />
                <div>
                  <span className="text-white font-bold font-mono">"{selectedNode.label}"</span>
                  <span className="text-slate-400 ml-2">Category: <strong className="text-slate-200 capitalize">{selectedNode.category}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400">GAT Attention: </span>
                  <span className="text-emerald-400 font-bold">{(selectedNode.attentionScore * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-slate-400">Threat Weight: </span>
                  <span className={selectedNode.threatWeight > 0.5 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                    {(selectedNode.threatWeight * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Vector Dim: </span>
                  <span className="text-slate-300">768-D</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 text-center py-1 font-mono">
              Hover or click any token node to inspect GAT multi-head attention weights and 768-D DistilBERT vector features.
            </div>
          )}
        </>
      )}

      {activeLayer === 'embeddings' && (
        <div className="p-4 bg-[#0A0A0D] rounded-lg border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">DistilBERT Contextual Feature Extraction (Section III-C)</span>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] rounded">
              768 Dimensions / Token
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            As formulated in Section III-C of the paper, each raw token sequence is processed through a pre-trained DistilBERT model. 
            Mean-pooling produces a high-dimensional 768-D embedding matrix that encapsulates both global semantics and subtle adversarial intent.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {nodes.slice(0, 8).map((n) => (
              <div key={n.id} className="p-2 bg-slate-900/60 border border-slate-800 rounded text-left">
                <div className="text-[11px] font-bold text-white font-mono truncate">{n.label}</div>
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>Norm:</span>
                  <span className="text-emerald-400 font-mono">14.{(n.index * 7 + 12) % 99}</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded"
                    style={{ width: `${(n.attentionScore * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeLayer === 'layers' && (
        <div className="p-4 bg-[#0A0A0D] rounded-lg border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-white">PhishSense AI Neural Graph Architecture</div>
          
          <div className="flex flex-col gap-2 font-mono text-xs">
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded flex items-center justify-between">
              <span className="text-slate-300">1. Input Graph Tensor</span>
              <span className="text-emerald-400">Node Dim: 768 (DistilBERT)</span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded flex items-center justify-between">
              <span className="text-slate-300">2. GATConv Layer 1</span>
              <span className="text-emerald-400">768 → 256 hidden channels (Attention α_ij)</span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded flex items-center justify-between">
              <span className="text-slate-300">3. Non-Linearity</span>
              <span className="text-emerald-400">ReLU Activation</span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded flex items-center justify-between">
              <span className="text-slate-300">4. GATConv Layer 2</span>
              <span className="text-emerald-400">256 → 2 binary output classes</span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded flex items-center justify-between">
              <span className="text-slate-300">5. Readout & Classification</span>
              <span className="text-emerald-400">Global Mean Pooling + Log-Softmax</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
