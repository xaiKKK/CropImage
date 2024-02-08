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

const Image: React.FC<{ props: ImageProps }> = ({ props }) => {
  const { src, crop, objects } = props;

  const renderArrow = (object: ArrowImageObject, index: number) => {
    return (
      <svg key={index} style={{ position: 'absolute', left: object.point.x, top: object.point.y }}>
        <line x1="0" y1="0" x2="20" y2="20" stroke="white" strokeWidth="2" />
        <text x="20" y="20">{object.comment}</text>
      </svg>
    );
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