import React, { useState } from 'react';
import Image, { ImageProps, Rect, ArrowImageObject } from './Image';

interface ImageEditorProps {
  props: ImageProps;
  onSave: (newImageProps: ImageProps) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ props, onSave }) => {
  const [cropX, setCropX] = useState(props.crop.x);
  const [cropY, setCropY] = useState(props.crop.y);
  const [cropWidth, setCropWidth] = useState(props.crop.w);
  const [cropHeight, setCropHeight] = useState(props.crop.h);
  const [arrowX, setArrowX] = useState(0);
  const [arrowY, setArrowY] = useState(0);
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
      point: { x: arrowX, y: arrowY },
      comment: "New arrow"
    };
    setObjects([...objects, newArrow]);
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
      <div>
        <label>Arrow X:</label>
        <input type="number" value={arrowX} onChange={(e) => setArrowX(parseInt(e.target.value))} />
      </div>
      <div>
        <label>Arrow Y:</label>
        <input type="number" value={arrowY} onChange={(e) => setArrowY(parseInt(e.target.value))} />
      </div>
      <button onClick={handleAddArrow}>Add Arrow</button>
      <Image props={{ ...props, crop: { x: cropX, y: cropY, w: cropWidth, h: cropHeight }, objects }} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ImageEditor;
