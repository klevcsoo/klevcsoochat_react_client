import React, { useEffect, useState } from 'react';
import './AccountPage.css';
import AppPageHeader from '../../components/AppPageHeader/AppPageHeader';
import AppCard from '../../components/AppCard/AppCard';
import { useAuthUser, updateUserProfile } from '../../utils/firebase';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useHistory } from 'react-router-dom';
import { routes } from '../../utils/constants';
import AppInput from '../../components/AppInput/AppInput';
import AppBottomAttachedButton from '../../components/AppButton/AppBottomAttachedButton';
import { useAppNotification } from '../../components/AppNotification/AppNotifiaction';

const AccountPage = () => {
  const history = useHistory();
  const [ user, userLoading ] = useAuthUser();
  const [ UpdatedNotification, showNotification ] = useAppNotification({
    persistent: false,
    text: 'Adatok frissítve',
    type: 'info'
  });

  const [ accountImg, setAccountImg ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState({ old: '', new: '' });
  const [ updatingData, setUpdatingData ] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      console.log('User not logged in. Redirecting...');
      history.replace(routes.HOME);
      return;
    }

    if (!!user?.photoURL) setAccountImg(user.photoURL);
    if (!!user?.displayName) setUsername(user.displayName);
  }, [ userLoading, user, history ]);

  return (
    <div className="accountpage-container">
      <UpdatedNotification />
      <AppPageHeader title="Fiókbeállítások" previous={{ icon: 'home' }} />
      {userLoading ? <LoadingSpinner /> : !user ? null : (
        <React.Fragment>
          <AppCard>
            <div className="account-img-container">
              {!!user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName ? user.displayName : 'account'} />
              ) : null}
            </div>
            <AppInput placeholder="Profilkép link" text={accountImg} onTextChanged={(text) => {
              setAccountImg(text);
            }} />
          </AppCard>
          <AppCard>
            <h1 className="app-small-header">Felhasználónév</h1>
            <AppInput placeholder="Felhasználónév" text={username} onTextChanged={(text) => {
              setUsername(text);
            }} />
          </AppCard>
          <AppCard>
            <h1 className="app-small-header">Jelszó</h1>
            <AppInput placeholder="Jelenlegi jelszó" text={password.old} onTextChanged={(text) => {
              setPassword({ old: text, new: password.new });
            }} password />
            <AppInput placeholder="Új jelszó" text={password.new} onTextChanged={(text) => {
              setPassword({ old: password.old, new: text });
            }} />
          </AppCard>
          <AppBottomAttachedButton text="Adatok frissítése" onClick={() => {
            setUpdatingData(true);
            updateUserProfile({ pass: password, photo: accountImg, username: username }, () => {
              setUpdatingData(false); showNotification();
            });
          }} loading={updatingData} />
        </React.Fragment>
      )}
    </div>
  );
};

export default AccountPage;
