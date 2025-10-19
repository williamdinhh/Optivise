"use client";

import { useState } from "react";

interface ChartData {
  label: string;
  value: number;
  color: string;
  isWinner?: boolean;
}

interface InteractiveChartProps {
  title: string;
  data: ChartData[];
  unit?: string;
  type?: "bar" | "percentage";
}

export default function InteractiveChart({
  title,
  data,
  unit = "%",
  type = "bar",
}: InteractiveChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "20px",
        border: "2px solid #e0e0e0",
        borderRadius: "10px",
        background: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <h4
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#333",
        }}
      >
        {title}
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const isHovered = hoveredIndex === index;

          return (
            <div key={index} style={{ position: "relative" }}>
              {/* Label and Value */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      fontWeight: item.isWinner ? "bold" : "normal",
                      color: item.isWinner ? "#28a745" : "#333",
                      fontSize: "14px",
                    }}
                  >
                    {item.label}
                  </span>
                  {item.isWinner && (
                    <span style={{ fontSize: "16px" }}>🏆</span>
                  )}
                </div>
                <span
                  style={{
                    fontWeight: "bold",
                    color: item.color,
                    fontSize: isHovered ? "18px" : "16px",
                    transition: "font-size 0.2s",
                  }}
                >
                  {item.value.toFixed(2)}
                  {unit}
                </span>
              </div>

              {/* Interactive Bar */}
              <div
                style={{
                  width: "100%",
                  height: isHovered ? "35px" : "30px",
                  background: "#f0f0f0",
                  borderRadius: "15px",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: isHovered
                    ? `2px solid ${item.color}`
                    : "2px solid transparent",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                    borderRadius: "15px",
                    transition: "width 0.8s ease-out",
                    display: "flex",
                    alignItems: "center",
                    paddingRight: "10px",
                    justifyContent: "flex-end",
                    boxShadow: isHovered
                      ? `0 4px 12px ${item.color}66`
                      : "none",
                    transform: isHovered ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  {isHovered && percentage > 15 && (
                    <span
                      style={{
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "bold",
                        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      }}
                    >
                      {percentage.toFixed(1)}% of max
                    </span>
                  )}
                </div>
              </div>

              {/* Hover Tooltip */}
              {isHovered && (
                <div
                  style={{
                    position: "absolute",
                    top: "-45px",
                    left: `${Math.min(percentage, 80)}%`,
                    transform: "translateX(-50%)",
                    background: item.color,
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    zIndex: 10,
                    animation: "fadeIn 0.2s",
                  }}
                >
                  {item.label}: {item.value.toFixed(2)}
                  {unit}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-6px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderTop: `6px solid ${item.color}`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#f8f9fa",
          borderRadius: "8px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "15px",
          fontSize: "13px",
        }}
      >
        <div>
          <div style={{ color: "#666", marginBottom: "4px" }}>Highest</div>
          <div style={{ fontWeight: "bold", color: "#28a745" }}>
            {maxValue.toFixed(2)}
            {unit}
          </div>
        </div>
        <div>
          <div style={{ color: "#666", marginBottom: "4px" }}>Average</div>
          <div style={{ fontWeight: "bold", color: "#007bff" }}>
            {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(
              2
            )}
            {unit}
          </div>
        </div>
        <div>
          <div style={{ color: "#666", marginBottom: "4px" }}>Variants</div>
          <div style={{ fontWeight: "bold", color: "#6c757d" }}>
            {data.length}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
