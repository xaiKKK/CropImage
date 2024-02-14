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
    const handleMouseDown = (e: React.MouseEvent<SVGElement>) => {
      e.preventDefault();
      
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY + 101 - rect.top;

      const onMouseMove = (e: MouseEvent) => {
        handleArrowMove(index, { x: e.clientX - cropX - offsetX, y: e.clientY - cropY - offsetY });
      };
      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    return (
      <svg
        key={index}
        style={{ position: 'absolute', left: object.point.x, top: object.point.y, cursor: 'move' }}
        onMouseDown={handleMouseDown}
      >
        <line x1="0" y1="0" x2="20" y2="20" stroke="white" strokeWidth="2" />
        <text x="20" y="20">{object.comment}</text>
      </svg>
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
