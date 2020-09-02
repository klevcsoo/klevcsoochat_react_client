import React, { useState } from 'react';
import './HomePage.css';
import { signUp, login } from '../../utils/firebase';
import { ReactComponent as AppLogo } from '../../assets/app-logo.svg';
import AppInput from '../../components/AppInput/AppInput';
import AppButton from '../../components/AppButton/AppButton';
import { useAppNotification } from '../../components/AppNotification/AppNotifiaction';
import AppCard from '../../components/AppCard/AppCard';
import { useHistory } from 'react-router-dom';
import { routes } from '../../utils/constants';

const HomePage = () => {
  const history = useHistory();

  const [ regEmail, setRegEmail ] = useState('');
  const [ regUsername, setRegUsername ] = useState('');
  const [ regPass, setRegPass ] = useState('');
  const [ loginEmail, setLoginEmail ] = useState('');
  const [ loginPass, setLoginPass ] = useState('');
  const [ loggingIn, setLoggingIn ] = useState(false);
  const [ LoginFailedNotification, showNotification ] = useAppNotification({
    persistent: false,
    type: "error"
  });

  return (
    <React.Fragment>
      <LoginFailedNotification />
      <div className={ `homepage-container` }>
        <AppLogo />
        <div className="homepage-login-panel">
          <AppCard>
            <div>
              <form>
                <AppInput placeholder="E-mail" text={ regEmail } onTextChanged={ (text) => setRegEmail(text) } type="email" />
                <AppInput placeholder="Felhasználónév" text={ regUsername } onTextChanged={ (text) => setRegUsername(text) } type="text" />
                <AppInput placeholder="Jelszó" text={ regPass } onTextChanged={ (text) => setRegPass(text) } type="password" />
              </form>
              <AppButton text="Regisztráció" type="primary" onClick={ () => {
                setLoggingIn(true);
                signUp(regEmail, regPass).then(() => setLoggingIn(false)).catch((err) => {
                  setLoggingIn(false); console.error(err);
                  showNotification(getErrMessage(err.code));
                });
              } } loading={ loggingIn } />
            </div>
          </AppCard>
          <AppCard>
            <div>
              <form>
                <AppInput placeholder="E-mail" text={ loginEmail } onTextChanged={ (text) => setLoginEmail(text) } type="email" />
                <AppInput placeholder="Jelszó" text={ loginPass } onTextChanged={ (text) => setLoginPass(text) } type="password" />
              </form>
              <AppButton text="Bejelentkezés" type="secondary" onClick={ () => {
                setLoggingIn(true);
                login(loginEmail, loginPass).then(() => history.push(routes.DASHBOARD)).catch((err) => {
                  setLoggingIn(false); console.error(err);
                  showNotification(getErrMessage(err.code));
                });
              } } loading={ loggingIn } />
            </div>
          </AppCard>
        </div>
      </div>
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
