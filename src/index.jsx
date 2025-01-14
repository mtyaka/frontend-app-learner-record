import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize, mergeConfig, getConfig,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import Header, { messages as headerMessages } from '@edx/frontend-component-header';
import Footer, { messages as footerMessages } from '@edx/frontend-component-footer';

import appMessages from './i18n';
import './index.scss';
import ProgramRecordsList from './components/ProgramRecordsList';
import ProgramRecord from './components/ProgramRecord';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      <Header />
      {getConfig().USE_LR_MFE ? (
        <Router>
          <Switch>
            <Route
              exact
              path="/"
            >
              <ProgramRecordsList />
            </Route>
            <Route
              path="/shared/:programUUID"
            >
              <ProgramRecord
                isPublic
              />
            </Route>
            <Route
              path="/:programUUID"
            >
              <ProgramRecord
                isPublic={false}
              />
            </Route>
          </Switch>
        </Router>
      ) : (
        <ProgramRecordsList />
      )}
      <Footer />
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        SUPPORT_URL_LEARNER_RECORDS: process.env.SUPPORT_URL_LEARNER_RECORDS || '',
        USE_LR_MFE: process.env.USE_LR_MFE || '',
      }, 'LearnerRecordConfig');
    },
  },
  messages: [
    appMessages,
    headerMessages,
    footerMessages,
  ],
});
