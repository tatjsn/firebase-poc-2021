import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import 'normalize.css';

import App from './App';

const firebaseConfig = {
  apiKey: 'AIzaSyByz-wyQdJZPMb6Fo_PaceIx6UeIUdBOag',
  authDomain: 'react-integration-poc.firebaseapp.com',
  projectId: 'react-integration-poc',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

ReactDOM.render(
  <React.StrictMode>
    <App db={db} />
  </React.StrictMode>,
  document.getElementById('root')
);
