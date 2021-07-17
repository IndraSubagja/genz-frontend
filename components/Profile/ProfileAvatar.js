import { useContext } from 'react';

import CropImage from '../Modal/CropImage';

import GeneralContext from '../../context/GeneralContext';
import UserContext from '../../context/UserContext';

import { CameraIcon, TrashcanIcon } from '../../utils/icons';
import { getImageUrl } from '../../utils/urls';

export default function ProfileAvatar({ user, className }) {
  const {
    modal: { showModal },
    asyncWaiter,
  } = useContext(GeneralContext);
  const { getUser, deleteUserAvatar, updateUserData } = useContext(UserContext);

  const toCropImage = (event) => {
    if (event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      showModal(<CropImage imageUrl={imageUrl} user={user} />, true);
      event.target.value = '';
    }
  };

  const deleteHandler = () =>
    asyncWaiter(
      async () => {
        await updateUserData({ avatar: null });
        await deleteUserAvatar(user.avatar);
        await getUser();
      },
      true,
      'Profile updated successfully'
    );

  return (
    <div className={className}>
      <div>
        {user ? (
          user.avatar ? (
            <img src={getImageUrl(user.avatar.url)} alt="Avatar" />
          ) : (
            <>
              <span>{user.name.split(' ').map((item) => item[0].toUpperCase())}</span>
              <img src="data:image/jpg;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
            </>
          )
        ) : (
          <img src="/icons/loading.svg" alt="loading..." className="loading" />
        )}
      </div>

      {user?.avatar && (
        <button type="button" className="btn-danger" onClick={deleteHandler}>
          <TrashcanIcon />
        </button>
      )}

      <div>
        <label
          htmlFor="camera"
          tabIndex={0}
          onKeyDown={(event) => (event.key === 'Enter' ? event.target.click() : null)}
        >
          <CameraIcon />
        </label>
        <input
          type="file"
          name="camera"
          id="camera"
          accept=".png, .jpg, .jpeg"
          capture="image"
          onChange={toCropImage}
        />
      </div>
    </div>
  );
}
