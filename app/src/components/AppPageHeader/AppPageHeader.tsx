import React from 'react';
import './AppPageHeader.css';
import { HomeRounded, ArrowBackIosRounded, SettingsRounded, ChatBubbleRounded, ArrowForwardIosRounded } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

const AppPageHeader = (props: {
  title: string,
  previous: {
    icon: 'home' | 'settings' | 'chat',
    path?: string;
  },
  next?: {
    icon: 'home' | 'settings' | 'chat',
    path: string;
  };
}) => {
  const history = useHistory();

  return (
    <React.Fragment>
      <div className="app-page-header acrylic-transparent">
        <div className="previous" onClick={() => {
          if (!!props.previous.path) history.replace(props.previous.path);
          else history.goBack();
        }}>
          <ArrowBackIosRounded color="inherit" />
          {getIcon(props.previous.icon)}
        </div>
        <h1 className="app-small-header">{props.title}</h1>
        {!props.next ? null : (
          <div className="next" onClick={() => {
            if (!!props.next) history.push(props.next.path);
          }}>
            {getIcon(props.next.icon)}
            <ArrowForwardIosRounded color="inherit" />
          </div>
        )}
      </div>
      <div style={{ height: 50 }}></div>
    </React.Fragment>
  );
};

const getIcon = (code: 'home' | 'settings' | 'chat') => {
  switch (code) {
    case 'home': return <HomeRounded color="inherit" />;
    case 'settings': return <SettingsRounded color="inherit" />;
    case 'chat': return <ChatBubbleRounded color="inherit" />;
    default: return null;
  }
};

export default AppPageHeader;
