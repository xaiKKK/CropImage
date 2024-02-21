import React from 'react';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface Point {
  x: number;
  y: number;
}

export interface ImageObject {
  type: unknown;
  point: Point;
  comment?: string;
}

export interface ArrowImageObject extends ImageObject {
  type: "arrow";
  direction?: "lb" | "lt" | "rb" | "rt";
}

export interface ImageProps {
  src: string;
  crop: Rect;
  objects: ImageObject[];
}

const Image: React.FC<{ 
  props: ImageProps; 
  onArrowMove: (index: number, point: Point) => void; 
  renderArrow: (object: ArrowImageObject, index: number) => JSX.Element 
}> = ({ props, onArrowMove, renderArrow }) => {
  const { src, crop, objects } = props;

  const handleArrowMove = (index: number, point: Point) => {
    onArrowMove(index, point);
  };

  return (
    <div style={{ position: 'relative', width: `${crop.w}px`, height: `${crop.h}px`, overflow: 'hidden' }}>
      <img src={src} alt="image" style={{ marginLeft: `-${crop.x}px`, marginTop: `-${crop.y}px` }} />
      {objects.map((object, index) => {
        if (object.type === "arrow") {
          return renderArrow(object as ArrowImageObject, index);
        }
        return null;
      })}
    </div>
  );
};

export default Image;