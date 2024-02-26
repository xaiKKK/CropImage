import React, { useCallback, useState } from "react";

interface ResizableBoxProps {
  onResize: (width: number, height: number) => void;
  initialWidth: number;
  initialHeight: number;
  startPoint: { x: number; y: number }; 
}

const ResizableBox: React.FC<ResizableBoxProps> = ({ onResize, initialWidth, initialHeight, startPoint }) => {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX - startPoint.x; 
        const newHeight = e.clientY - startPoint.y; 
        setSize({ width: newWidth, height: newHeight });
        onResize(newWidth, newHeight);
      }
    },
    [isResizing, onResize, startPoint]
  );

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div
      id="resizable-box"
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        border: "2px solid black",
        position: "absolute",
        top: startPoint.y, 
        left: startPoint.x, 
        zIndex:   1000,
      }}
      onMouseDown={startResizing}
    >
      <div
        style={{
          position: "absolute",
          bottom:   0,
          right:   0,
          cursor: "nwse-resize",
          width: "20px",
          height: "20px",
        }}
        onMouseDown={startResizing}
      />
    </div>
  );
};

export default ResizableBox;
