import { useContext, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';

import GeneralContext from '../../context/GeneralContext';
import UserContext from '../../context/UserContext';

import styles from '../../styles/Modal/CropImage.module.css';

import { ChecklistIcon, CrossIcon } from '../../utils/icons';
import { getCroppedImg } from '../../utils/getCroppedImg';

export default function CropImage({ user, imageUrl }) {
  const [size, setSize] = useState(null);
  const [dimension, setDimension] = useState({});
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [area, setArea] = useState(null);

  const {
    modal: { hideModal },
    asyncWaiter,
  } = useContext(GeneralContext);
  const { getUser, changeUserAvatar, deleteUserAvatar } = useContext(UserContext);

  const saveResult = () =>
    asyncWaiter(
      async () => {
        const result = await getCroppedImg(imageUrl, area, rotation);
        const currentFile = user.avatar;

        await changeUserAvatar(result);

        if (currentFile) {
          await deleteUserAvatar(currentFile);
        }
        await getUser();

        hideModal();
      },
      true,
      'Profile updated successfully'
    );

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;

    const getImageSize = () => {
      const imgContainer = document.querySelector(`.${styles.cropImage}`);
      const width = parseFloat(getComputedStyle(imgContainer.parentElement).width) - 40;

      setSize(width);
      setDimension({ width: image.width, height: image.height });
    };

    getImageSize();
    image.onload = () => getImageSize();
    window.addEventListener('resize', getImageSize);

    return () => window.removeEventListener('resize', getImageSize);
  }, [imageUrl]);

  return (
    <>
      <style jsx global>
        {`
          .${styles.cropImage} {
            width: ${size}px;
            height: ${size}px;
          }
        `}
      </style>

      <div className={styles.modalBody} onMouseDown={(event) => event.stopPropagation()}>
        <div className={styles.cropImage}>
          {size && dimension.width && dimension.height ? (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              cropShape="round"
              showGrid={false}
              restrictPosition={true}
              style={{
                mediaStyle: {
                  width: dimension.width >= dimension.height ? '100%' : 'auto',
                  height: dimension.width >= dimension.height ? 'auto' : '100%',
                },
              }}
              onCropComplete={(croppedArea, croppedAreaPixels) => {
                setArea(croppedAreaPixels);
              }}
            />
          ) : (
            <img src="/icons/loading.svg" alt="loading..." className="loading" />
          )}
        </div>

        <div>
          <button type="button" className="btn btn-danger" onClick={hideModal}>
            <span className="inline-icon">
              <CrossIcon />
            </span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={saveResult}
            disabled={!size || !dimension.width || !dimension.height}
          >
            <span className="inline-icon">
              <ChecklistIcon />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
