import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';

function Canvas({ socket, roomId, isDrawing, gameStatus }) {
  const canvasRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState('pen');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    socket.on('drawing', (data) => {
      drawLine(ctx, data);
    });

    socket.on('canvas-cleared', () => {
      clearCanvas();
    });

    return () => {
      socket.off('drawing');
      socket.off('canvas-cleared');
    };
  }, [socket]);

  useEffect(() => {
    if (gameStatus === 'playing' || gameStatus === 'round-end') {
      clearCanvas();
    }
  }, [gameStatus]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const drawLine = (ctx, data) => {
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.lineWidth;
    ctx.globalCompositeOperation = data.tool === 'eraser' ? 'destination-out' : 'source-over';

    ctx.beginPath();
    ctx.moveTo(data.x0, data.y0);
    ctx.lineTo(data.x1, data.y1);
    ctx.stroke();
  };

  const handleMouseDown = (e) => {
    if (!isDrawing) return;
    setIsMouseDown(true);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    const rect = canvas.getBoundingClientRect();
    const prevX = e.clientX - rect.left - e.movementX;
    const prevY = e.clientY - rect.top - e.movementY;

    const drawData = {
      x0: prevX,
      y0: prevY,
      x1: x,
      y1: y,
      color: tool === 'eraser' ? color : color,
      lineWidth: tool === 'eraser' ? lineWidth * 3 : lineWidth,
      tool
    };

    drawLine(ctx, drawData);
    socket.emit('draw', { roomId, drawData });
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleClear = () => {
    if (!isDrawing) return;
    clearCanvas();
    socket.emit('clear-canvas', { roomId });
  };

  const colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];

  return (
    <div className="canvas-container">
      {isDrawing && (
        <div className="drawing-tools">
          <div className="tool-section">
            <button
              className={tool === 'pen' ? 'active' : ''}
              onClick={() => setTool('pen')}
            >
              ✏️ Pen
            </button>
            <button
              className={tool === 'eraser' ? 'active' : ''}
              onClick={() => setTool('eraser')}
            >
              🧹 Eraser
            </button>
          </div>

          <div className="tool-section">
            <label>Size:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
            />
            <span>{lineWidth}px</span>
          </div>

          <div className="tool-section">
            <label>Color:</label>
            <div className="color-palette">
              {colors.map((c) => (
                <button
                  key={c}
                  className={`color-btn ${color === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <button onClick={handleClear} className="clear-btn">
            Clear Canvas
          </button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`drawing-canvas ${!isDrawing ? 'view-only' : ''}`}
      />
    </div>
  );
}

export default Canvas;
