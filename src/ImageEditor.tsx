import React, { useState } from 'react';
import Image, { ImageProps, ArrowImageObject, Point } from './Image';

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

  const handleCropChange = (field: string, value: number) => {
    switch (field) {
      case "x":
        setCropX(value);
        break;
      case "y":
        setCropY(value);
        break;
      case "width":
        setCropWidth(value);
        break;
      case "height":
        setCropHeight(value);
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    const newImageProps: ImageProps = {
      src: props.src,
      crop: { x: cropX, y: cropY, w: cropWidth, h: cropHeight },
      objects: objects
    };
    onSave(newImageProps);
  };

  const handleAddArrow = () => {
    const newArrow: ArrowImageObject = {
      type: "arrow",
      point: { x: 0, y: 0 },
      comment: "Нажать"
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
      if (!container) return; // Проверка наличия контейнера
  
      const containerRect = container.getBoundingClientRect();
      const initialX = object.point.x; 
      const initialY = object.point.y; 
      const offsetX = e.clientX - initialX; 
      const offsetY = e.clientY - initialY; 
  
      const onMouseMove = (e: MouseEvent) => {
        handleArrowMove(index, { 
          x: e.clientX - offsetX - containerRect.left,
          y: e.clientY - offsetY + 100 - containerRect.top
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
        <img src="https://www.cossco.ru/local/templates/iteraciya/assets/img/icons/arrow-left.svg" alt="arrow" style={{ width: '30px' }} />
        <span>{object.comment}</span>
      </div>
    );
  };

  return (
    <div>
      <div>
        <label>X:</label>
        <input type="number" value={cropX} onChange={(e) => handleCropChange("x", parseInt(e.target.value))} />
      </div>
      <div>
        <label>Y:</label>
        <input type="number" value={cropY} onChange={(e) => handleCropChange("y", parseInt(e.target.value))} />
      </div>
      <div>
        <label>Width:</label>
        <input type="number" value={cropWidth} onChange={(e) => handleCropChange("width", parseInt(e.target.value))} />
      </div>
      <div>
        <label>Height:</label>
        <input type="number" value={cropHeight} onChange={(e) => handleCropChange("height", parseInt(e.target.value))} />
      </div>
      <button onClick={handleAddArrow}>Add Arrow</button>
      <Image props={{ ...props, crop: { x: cropX, y: cropY, w: cropWidth, h: cropHeight }, objects }} onArrowMove={handleArrowMove} renderArrow={renderArrow} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ImageEditor;
