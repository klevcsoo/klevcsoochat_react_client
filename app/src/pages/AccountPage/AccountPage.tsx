import React, { useEffect, useState } from 'react';
import './AccountPage.css';
import AppPageHeader from '../../components/AppPageHeader/AppPageHeader';
import AppCard from '../../components/AppCard/AppCard';
import { useAuthUser, updateUserProfile, uploadAccountPhoto } from '../../utils/firebase';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useHistory } from 'react-router-dom';
import { routes } from '../../utils/constants';
import AppInput from '../../components/AppInput/AppInput';
import AppBottomAttachedButton from '../../components/AppButton/AppBottomAttachedButton';
import { useAppNotification } from '../../components/AppNotification/AppNotifiaction';
import AppButton from '../../components/AppButton/AppButton';

const AccountPage = () => {
  const history = useHistory();
  const [ user, userLoading ] = useAuthUser();
  const [ UpdatedNotification, showUpdated ] = useAppNotification({
    persistent: false,
    type: 'info'
  });
  const [ UploadErrorNotification, showUploadError ] = useAppNotification({
    persistent: false,
    type: 'error'
  });

  const [ photoURL, setPhotoURL ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState({ old: '', new: '' });
  const [ updatingData, setUpdatingData ] = useState(false);
  const [ uploadingPhoto, setUploadingPhoto ] = useState(false);

  const uploadPhoto = () => {
    const fileUpload = document.createElement('input');
    fileUpload.type = 'file'; fileUpload.style.display = 'none';

    function onFile(this: any) {
      const photo = this.files[ 0 ] as File;
      if (!photo.type.startsWith('image/')) showUploadError('Helytelen fájltípus');

      console.log(photo); setUploadingPhoto(true);
      uploadAccountPhoto(photo).then((url) => {
        setPhotoURL(url); setUploadingPhoto(false);
      }).catch((err) => {
        console.error(err); showUploadError('Hiba történt a feltöltés során');
        setUploadingPhoto(false);
      });
    }

    fileUpload.addEventListener('change', onFile);
    document.body.appendChild(fileUpload);
    fileUpload.click();
  };

  useEffect(() => {
    if (!userLoading && !user) {
      console.log('User not logged in. Redirecting...');
      history.replace(routes.HOME);
      return;
    }

    if (!!user?.photoURL) setPhotoURL(user.photoURL);
    if (!!user?.displayName) setUsername(user.displayName);
  }, [ userLoading, user, history ]);

  return (
    <div className="accountpage-container">
      <UpdatedNotification />
      <UploadErrorNotification />
      <AppPageHeader title="Fiókbeállítások" previous={ { icon: 'home' } } />
      { userLoading ? <LoadingSpinner /> : !user ? null : (
        <React.Fragment>
          <AppCard>
            <div className="account-img-container">
              { !!user.photoURL ? (
                <img src={ photoURL } alt={ user.displayName ? user.displayName : 'account' } />
              ) : null }
            </div>
            <AppInput placeholder="Profilkép link" text={ photoURL } onTextChanged={ (text) => {
              setPhotoURL(text);
            } } />
            <p className="app-small-title" style={ { margin: 10 } }>vagy</p>
            <AppButton type="primary" text="Képfeltöltés" onClick={ () => uploadPhoto() } loading={ uploadingPhoto } />
          </AppCard>
          <AppCard>
            <h1 className="app-small-header">Felhasználónév</h1>
            <AppInput placeholder="Felhasználónév" text={ username } onTextChanged={ (text) => {
              setUsername(text);
            } } />
          </AppCard>
          <AppCard>
            <h1 className="app-small-header">Jelszó módosítása</h1>
            <AppInput placeholder="Jelenlegi jelszó" text={ password.old } onTextChanged={ (text) => {
              setPassword({ old: text, new: password.new });
            } } password />
            <AppInput placeholder="Új jelszó" text={ password.new } onTextChanged={ (text) => {
              setPassword({ old: password.old, new: text });
            } } />
          </AppCard>
          <AppBottomAttachedButton text="Adatok frissítése" onClick={ () => {
            setUpdatingData(true);
            updateUserProfile(photoURL, username, password).then(() => {
              setUpdatingData(false); showUpdated('Adatok frissítve');
            });
          } } loading={ updatingData } />
        </React.Fragment>
      ) }
    </div>
  );
};

export default AccountPage;
