import React, { useState, useEffect } from 'react';
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

  const [ regUsername, setRegUsername ] = useState('');
  const [ regPass, setRegPass ] = useState('');
  const [ regPass2, setRegPass2 ] = useState('');
  const [ loginUsername, setLoginUsername ] = useState('');
  const [ loginPass, setLoginPass ] = useState('');

  const [ canRegister, setCanRegister ] = useState(false);
  const [ loggingIn, setLoggingIn ] = useState(false);
  const [ LoginFailedNotification, showNotification ] = useAppNotification({
    persistent: false,
    type: "error"
  });

  const registerHandler = () => {
    if (!canRegister) return;
    setLoggingIn(true); signUp(regUsername, regPass).then(() => history.push(routes.DASHBOARD)).catch((err) => {
      setLoggingIn(false); console.error(err);
      showNotification(getErrMessage(err.code));
    });
  };

  const loginHandler = () => {
    setLoggingIn(true); login(loginUsername, loginPass).then(() => history.push(routes.DASHBOARD)).catch((err) => {
      setLoggingIn(false); console.error(err);
      showNotification(getErrMessage(err.code));
    });
  };

  useEffect(() => {
    setCanRegister(regPass === regPass2);
  }, [ regPass, regPass2 ]);

  return (
    <React.Fragment>
      <LoginFailedNotification />
      <div className={ `homepage-container` }>
        <AppLogo />
        <div className="homepage-login-panel">
          <AppCard>
            <div>
              <form>
                <AppInput placeholder="Felhasználónév" text={ regUsername } onTextChanged={ (text) => setRegUsername(text) } />
                <p className="description">Ezt nem tudod megváltoztatni később.</p>
                <AppInput placeholder="Jelszó" text={ regPass } onTextChanged={ (text) => setRegPass(text) }
                  password error={ !canRegister } />
                <AppInput placeholder="Jelszó mégegyszer" text={ regPass2 } onTextChanged={ (text) => setRegPass2(text) }
                  password error={ !canRegister } onSubmit={ registerHandler } />
              </form>
              <AppButton text="Regisztráció" type="primary" onClick={ registerHandler } loading={ loggingIn } />
            </div>
          </AppCard>
          <AppCard>
            <div>
              <form>
                <AppInput placeholder="Felhasználónév" text={ loginUsername } onTextChanged={ (text) => setLoginUsername(text) } />
                <AppInput placeholder="Jelszó" text={ loginPass } onTextChanged={ (text) => setLoginPass(text) }
                  onSubmit={ loginHandler } password />
              </form>
              <AppButton text="Bejelentkezés" type="secondary" onClick={ loginHandler } loading={ loggingIn } />
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
