import React, { useState } from 'react';
import Image, { ImageProps, ArrowImageObject, Point } from './Image';
import ResizableBox from './ResizableBox';

interface ImageEditorProps {
  props: ImageProps;
  onSave: (newImageProps: ImageProps) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ props, onSave }) => {
  const [cropX, setCropX] = useState(props.crop.x);
  const [cropY, setCropY] = useState(props.crop.y);
  const [cropWidth, setCropWidth] = useState(props.crop.w);
  const [cropHeight, setCropHeight] = useState(props.crop.h);
  const [objects, setObjects] = useState([...props.objects]);
  const [showResizableBox, setShowResizableBox] = useState(false);

  const handleResize = (width: number, height: number) => {
    setCropWidth(width);
    setCropHeight(height);
  };

  const handleSave = () => {
    const newImageProps: ImageProps = {
      src: props.src,
      crop: { x: cropX, y: cropY, w: cropWidth, h: cropHeight },
      objects: objects
    };
    onSave(newImageProps);
    setShowResizableBox(false); 
  };

  const handleAddArrow = () => {
    const newArrow: ArrowImageObject = {
      type: "arrow",
      point: { x:   0, y:   10 },
    };
    setObjects([...objects, newArrow]);
  };

  const handleArrowMove = (index: number, point: Point) => {
    const updatedObjects = objects.map((obj, i) => (i === index ? { ...obj, point } : obj));
    setObjects(updatedObjects);
  };

  const renderArrow = (object: ArrowImageObject, index: number) => {
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
   
      const container = e.currentTarget.parentElement;
      if (!container) return;   
   
      const containerRect = container.getBoundingClientRect();
      const initialX = object.point.x;   
      const initialY = object.point.y;   
      const offsetX = e.clientX - initialX;   
      const offsetY = e.clientY - initialY;   
   
      const onMouseMove = (e: MouseEvent) => {
        handleArrowMove(index, {   
          x: e.clientX - offsetX - containerRect.left,
          y: e.clientY - offsetY - containerRect.top
        });
      };
      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };
   
    return (
      <div key={index} style={{ position: 'absolute', left: object.point.x, top: object.point.y, cursor: 'move' }} onMouseDown={handleMouseDown}>
        <img src="https://grizly.club/uploads/posts/2023-08/1693269477_grizly-club-p-kartinki-krasnaya-strelka-vpravo-bez-fona-32.png" alt="arrow" style={{ width: '50px', transform: 'rotate(140deg)', filter: 'hue-rotate(0deg) saturate(100%) brightness(100%) contrast(100%)' }} />
        <span>{object.comment}</span>
      </div>
    );
  };

  const showResizableBoxHandler = () => {
    setShowResizableBox(true);
  };

  return (
    <div>
      <Image props={{ ...props, crop: { x: cropX, y: cropY, w: cropWidth, h: cropHeight }, objects }} onArrowMove={handleArrowMove} renderArrow={renderArrow} />
      {showResizableBox && <ResizableBox onResize={handleResize} initialWidth={props.crop.w} initialHeight={props.crop.h} />}
      <button onClick={handleSave}>Save</button>
      <button onClick={handleAddArrow}>Add Arrow</button>
      <button onClick={showResizableBoxHandler}>Show Resizable Box</button>
    </div>
  );
};

export default ImageEditor;