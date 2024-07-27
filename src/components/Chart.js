import React, { useRef, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Chart = ({ data, zoomState, setZoomState }) => {
  const chartRef = useRef();
  const [zoomedData, setZoomedData] = useState(data);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [rect, setRect] = useState(null);

  useEffect(() => {
    setZoomedData(data);
  }, [data]);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    const rect = chartRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setStartPoint({ x, y });
    setRect({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (event) => {
    if (!isDragging || !startPoint) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const newRect = {
      x: Math.min(x, startPoint.x),
      y: Math.min(y, startPoint.y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
    };
    setRect(newRect);
  };

  const handleMouseUp = () => {
    if (isDragging && startPoint && rect) {
      const xMinIndex = Math.round((rect.x / chartRef.current.clientWidth) * data.length);
      const xMaxIndex = Math.round(((rect.x + rect.width) / chartRef.current.clientWidth) * data.length);

      const newZoomedData = data.slice(xMinIndex, xMaxIndex);
      setZoomedData(newZoomedData);
      setZoomState({ xMinIndex, xMaxIndex });
    }
    setIsDragging(false);
    setStartPoint(null);
    setRect(null);
  };

  return (
    <div
      style={{ position: "relative", width: "100%", height: "500px" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={chartRef}
    >
      {rect && (
        <div
          style={{
            position: "absolute",
            border: "1px solid black",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
            pointerEvents: "none",
          }}
        />
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={zoomedData} margin={{ top: 20, right: 30, bottom: 30, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="steelblue" dot={{ r: 3 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
