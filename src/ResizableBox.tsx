import React, { useCallback, useState } from "react";

interface ResizableBoxProps {
  onResize: (width: number, height: number) => void;
  initialWidth: number;
  initialHeight: number;
}

const ResizableBox: React.FC<ResizableBoxProps> = ({ onResize, initialWidth, initialHeight }) => {
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
        const newWidth = e.clientX - document.getElementById("resizable-box")!.offsetLeft;
        const newHeight = e.clientY - document.getElementById("resizable-box")!.offsetTop;
        setSize({ width: newWidth, height: newHeight });
        onResize(newWidth, newHeight);
      }
    },
    [isResizing, onResize]
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
        top:  0,
        left:  0,
        zIndex:  1000,
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom:  0,
          right:  0,
          cursor: "nwse-resize",
          width: "20px",
          height: "20px",
          backgroundColor: "red",
        }}
        onMouseDown={startResizing}
      />
    </div>
  );
};

export default ResizableBox;