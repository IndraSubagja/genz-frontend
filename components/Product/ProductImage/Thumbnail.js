import { useEffect, useState } from 'react';

import styles from '../../../styles/Product/ProductImages.module.css';

import { ArrowLeftIcon, ArrowRightIcon } from '../../../utils/icons';

export default function Thumbnail({ product, order, setOrder }) {
  const [swipe, setSwipe] = useState([false, 0, 0]);
  const [range, setRange] = useState(null);

  // Thumbnail Swipe Handler
  const swipeEnter = (event) => {
    if (event.button === 2) return;

    const target = event.currentTarget;
    const matrix = getComputedStyle(target).transform;
    const translateX = new WebKitCSSMatrix(matrix).m41;

    setSwipe([true, event.clientX ?? event.touches[0].clientX, translateX]);

    matchMedia('(hover:none)').matches
      ? document.addEventListener('touchend', (event) => swipeLeave(event, target), { once: true, passive: false })
      : document.addEventListener('mouseup', () => swipeLeave(event, target), { once: true });
  };
  const swipeLeave = (event, target) => {
    event.preventDefault();

    const matrix = getComputedStyle(target).transform;
    const translateX = new WebKitCSSMatrix(matrix).m41;

    if (translateX > range[0] || product.images.length < 5) {
      target.style.transform = `translateX(${range[0]}px)`;
      setSwipe([swipe[0], swipe[1], range[0]]);
    } else if (translateX < range[1]) {
      target.style.transform = `translateX(${range[1]}px)`;
      setSwipe([swipe[0], swipe[1], range[1]]);
    } else {
      setSwipe([swipe[0], swipe[1], translateX]);
    }
  };
  const swipeHandler = (event) => {
    if (event.button === 2) return;

    if (swipe[0]) {
      const target = event.currentTarget;

      const swipeDistance = swipe[2] + ((event.clientX ?? event.touches[0].clientX) - swipe[1]);

      target.style.transform = `translateX(${swipeDistance}px)`;
    }
  };

  // Thumbnail Button Handler
  const prevButton = (event) => {
    const target = event.currentTarget.nextElementSibling;
    const width = parseFloat(getComputedStyle(target).width);
    const distance = swipe[2] - (width / product.images.length) * -1;

    if (distance > range[0]) {
      target.style.transform = `translateX(${range[0]}px)`;
      setSwipe([swipe[0], swipe[1], range[0]]);
    } else {
      target.style.transform = `translateX(${distance}px)`;
      setSwipe([swipe[0], swipe[1], distance]);
    }
  };
  const nextButton = (event) => {
    const target = event.currentTarget.previousElementSibling;
    const width = parseFloat(getComputedStyle(target).width);
    const distance = swipe[2] + (width / product.images.length) * -1;

    if (distance < range[1]) {
      target.style.transform = `translateX(${range[1]}px)`;
      setSwipe([swipe[0], swipe[1], range[1]]);
    } else {
      target.style.transform = `translateX(${distance}px)`;
      setSwipe([swipe[0], swipe[1], distance]);
    }
  };

  // Preview Handler
  const changePreview = (event, index) => {
    if (event.button === 2) return;

    const target = event.currentTarget;
    const pos = event.clientX ?? event.touches[0].clientX;

    const tolerance = (event) => {
      event.preventDefault();

      const offset = (event.clientX ?? event.changedTouches[0].clientX) - pos;

      if (offset < 20 && offset > -20) {
        setOrder(index);
      }
    };

    matchMedia('(hover:none)').matches
      ? target.addEventListener('touchend', tolerance, { once: true, passive: false })
      : target.addEventListener('mouseup', tolerance, { once: true });
  };

  useEffect(() => {
    const thumbnail = document.querySelector(`.${styles.thumbnail}`);
    const width = parseFloat(getComputedStyle(thumbnail).width);
    const minSwipe = 0;
    const maxSwipe = Number(((width / product.images.length) * (product.images.length - 5) * -1).toFixed(3));

    if (!range || range[0] !== minSwipe || range[1] !== maxSwipe) {
      setRange([minSwipe, maxSwipe]);
    }
  }, []);

  return (
    <>
      <style jsx>
        {`
          .${styles.thumbnail} {
            width: calc(100% * ${product.images.length} / 5);
          }
          .${styles.thumbnail} > li {
            width: calc(100% / ${product.images.length});
          }
        `}
      </style>

      <div className={styles.imageContainer}>
        <div>
          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            onClick={prevButton}
            disabled={range && swipe[2] >= range[0]}
          >
            <ArrowLeftIcon />
          </button>
          <ul
            className={styles.thumbnail}
            onMouseDown={swipeEnter}
            onTouchStart={swipeEnter}
            onMouseMove={swipeHandler}
            onTouchMove={swipeHandler}
          >
            {product.images.map((image, index) => (
              <li key={image.id}>
                <button
                  type="button"
                  onMouseDown={(event) => changePreview(event, index)}
                  onTouchStart={(event) => changePreview(event, index)}
                  className={order === index ? styles.active : ''}
                >
                  <img src={image.url} alt={image.name} />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={nextButton}
            disabled={range && swipe[2] <= range[1]}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </>
  );
}
