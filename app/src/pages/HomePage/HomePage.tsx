import React, { useState } from 'react';
import './HomePage.css';
import { useAuthUser, signUp, login } from '../../utils/firebase';
import { ReactComponent as AppLogo } from '../../assets/app-logo.svg';
import AppInput from '../../components/AppInput/AppInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import AppButton from '../../components/AppButton/AppButton';
import HomePageLoggedIn from './HomePageLoggedIn';

const HomePage = () => {
  const [ user, userLoading ] = useAuthUser();
  const [ email, setEmail ] = useState('');
  const [ pass, setPass ] = useState('');
  const [ loggingIn, setLoggingIn ] = useState(false);

  return (
    <React.Fragment>
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
                  console.error(err); setLoggingIn(false);
                });
              }} loading={loggingIn} />
              <div className="homepage-login-panel-divider">
                <div></div><div></div>
                <span className="app-small-header">vagy</span>
              </div>
              <AppButton text="Bejelentkezés" type="secondary" onClick={() => {
                setLoggingIn(true);
                login(email, pass).then(() => setLoggingIn(false)).catch((err) => {
                  console.error(err);
                  setLoggingIn(false);
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

export default HomePage;
