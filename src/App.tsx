import React, { useState } from 'react';
import ImageEditor from './ImageEditor';
import { ImageProps, ArrowImageObject } from './Image';

const App: React.FC = () => {
  const [imageProps, setImageProps] = useState<ImageProps>({
    src: "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
    crop: { x: 0, y: 0, w: 1000, h: 666 },
    objects: []
  });
  const handleSave = (newImageProps: ImageProps) => {
    setImageProps(newImageProps);
    const { src, crop, objects } = newImageProps;
    const cropString = `${crop.x},${crop.y}-${crop.x + crop.w},${crop.y + crop.h}`;
    const objectsString = objects.map((obj) => {
      if (obj.type === "arrow") {
        const arrowObj = obj as ArrowImageObject;
        return `${arrowObj.point.x},${arrowObj.point.y}:arrow:${arrowObj.comment || ""}`;
      }
      return "";
    });
    console.log(`{% image src="${src}" crop="${cropString}" objects=[${objectsString.join(", ")}] %}`);
  };
  return (
    <div>
      <ImageEditor props={imageProps} onSave={handleSave} />
    </div>
  );
};

export default App;