import React, { useState } from 'react';
import './HomePage.css';
import { useAuthUser, signUp, login } from '../../utils/firebase';
import { ReactComponent as AppLogo } from '../../assets/app-logo.svg';
import AppInput from '../../components/AppInput/AppInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import AppButton from '../../components/AppButton/AppButton';
import HomePageLoggedIn from './HomePageLoggedIn';
import { useAppNotification } from '../../components/AppNotification/AppNotifiaction';

const HomePage = () => {
  const [ user, userLoading ] = useAuthUser();
  const [ email, setEmail ] = useState('');
  const [ pass, setPass ] = useState('');
  const [ loggingIn, setLoggingIn ] = useState(false);
  const [ LoginFailedNotification, showNotification ] = useAppNotification({
    persistent: false,
    type: "error"
  });

  return (
    <React.Fragment>
      <LoginFailedNotification />
      <div className={`homepage-container${!!user ? ' logged-in' : ''}`}>
        <img src={require('../../assets/home-bg.jpg')} alt="background" />
        <AppLogo />
        <div className="homepage-login-panel">
          {userLoading ? <LoadingSpinner /> : !user ? (
            <React.Fragment>
              <form>
                <AppInput placeholder="E-mail" text={email} onTextChanged={(text) => setEmail(text)} type="email" />
                <AppInput placeholder="Jelszó" text={pass} onTextChanged={(text) => setPass(text)} type="password" />
              </form>
              <AppButton text="Regisztráció" type="primary" onClick={() => {
                setLoggingIn(true);
                signUp(email, pass).then(() => setLoggingIn(false)).catch((err) => {
                  setLoggingIn(false); console.error(err);
                  showNotification(getErrMessage(err.code));
                });
              }} loading={loggingIn} />
              <div className="homepage-login-panel-divider">
                <div></div><div></div>
                <span className="app-small-header">vagy</span>
              </div>
              <AppButton text="Bejelentkezés" type="secondary" onClick={() => {
                setLoggingIn(true);
                login(email, pass).then(() => setLoggingIn(false)).catch((err) => {
                  setLoggingIn(false); console.error(err);
                  showNotification(getErrMessage(err.code));
                });
              }} loading={loggingIn} />
            </React.Fragment>
          ) : null}
        </div>
      </div>
      {!!user ? <HomePageLoggedIn /> : null}
    </React.Fragment>
  );
};

function getErrMessage(code: string) {
  switch (code) {
    case 'auth/user-not-found': return 'Nincs ezzel az e-mail címmel regisztrálva felhasználó';
    case 'auth/invalid-email': return 'Érvénytelen e-mail cím';
    case 'auth/email-already-in-use': return 'Ezzel az e-mail címmel már van regisztrálva felhasználó';
    case 'auth/wrong-password': return 'Hibás jelszó';
    case 'auth/weak-password': return 'Túl gyenge jelszó (min. 6 karakter)';
    default: return 'Hiba történt a bejelentkezés során';
  }
}

export default HomePage;
