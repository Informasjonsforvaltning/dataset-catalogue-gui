import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './redux/configureStore';
import { getConfig, loadConfig } from './config';
import { configureLocalization } from './lib/localization';
import { App } from './app/app';
import { configureReferenceDataApi } from './api/reference-data-api';
import { configureRegistrationApi } from './api/registration-api';
import { getUserProfileThunk } from './redux/modules/auth';

import './styles';

function AppRoot(store) {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

async function configureServices() {
  const store = configureStore(getConfig().store);
  configureLocalization(getConfig().registrationLanguage);
  configureReferenceDataApi(getConfig().referenceDataApi);
  configureRegistrationApi(getConfig().registrationApi);

  store.dispatch(getUserProfileThunk());

  return { store };
}

function render({ store }) {
  ReactDOM.render(AppRoot(store), document.getElementById('root'));
}

loadConfig()
  .then(configureServices)
  .then(render)
  .catch(console.error);
