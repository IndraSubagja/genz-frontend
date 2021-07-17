import { useEffect, useState } from 'react';
import { useTransition, animated } from 'react-spring';

import styles from '../../../../styles/Product/ProductImages.module.css';

import { getImageUrl } from '../../../../utils/urls';

export default function Preview({ product, order }) {
  const [ratio, setRatio] = useState(null);
  const [width, setWidth] = useState(null);

  const fade = useTransition(order, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
  });

  const zoomHandler = (event) => {
    const target = event.currentTarget;

    const { width, height, top, left } = target.getBoundingClientRect();
    const positionX = Math.round(((event.clientX - left) / width) * 100);
    const positionY = Math.round(((event.clientY - top) / height) * 100);

    target.style.backgroundSize = '200%';
    target.style.backgroundPosition = `${positionX}% ${positionY}%`;
  };

  const zoomOut = (event) => {
    const target = event.currentTarget;

    target.style.backgroundSize = '100%';
    target.style.backgroundPosition = 0;
  };

  useEffect(() => {
    const img = new Image();
    img.src = getImageUrl(product.images[order].url);

    const getImageSize = () => {
      const preview = document.querySelector(`.${styles.preview}`);

      setWidth(parseFloat(getComputedStyle(preview).width));
      setRatio((img.height / img.width) * 100);
    };

    getImageSize();
    img.onload = () => getImageSize();
    window.addEventListener('resize', getImageSize);

    return () => window.removeEventListener('resize', getImageSize);
  }, [product.images, order]);

  return (
    <div className={styles.previewContainer}>
      {fade((transition, item) => (
        <>
          <style jsx global>
            {`
              .${styles.preview}:last-child {
                position: relative;
                background-image: url(${getImageUrl(product.images[item].url)});
                padding-top: ${ratio}%;
              }
              .${styles.preview}):not(:last-child {
                position: absolute;
                width: ${width}px;
              }
            `}
          </style>

          <animated.div
            className={styles.preview}
            style={transition}
            onTouchEnd={(event) => (event.cancelable ? event.preventDefault() : '')}
            onMouseMove={zoomHandler}
            onMouseLeave={zoomOut}
          ></animated.div>
        </>
      ))}
    </div>
  );
}
