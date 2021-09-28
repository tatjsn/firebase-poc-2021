import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import 'normalize.css';

const firebaseConfig = {
  apiKey: 'AIzaSyByz-wyQdJZPMb6Fo_PaceIx6UeIUdBOag',
  authDomain: 'react-integration-poc.firebaseapp.com',
  projectId: 'react-integration-poc',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const col = collection(db, 'eirei');


function App({ items }) {
  const [id, setId] = useState(null);
  const [like, setLike] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLike(null);
    const unsub = onSnapshot(doc(db, 'like', id), (doc) => {
      setLike(doc.data().like);
    });
    return unsub;
  }, [id]);

  if (!id) {
    return (
      <ul>
        { items.map(item => <li key={item.id}><button onClick={() => setId(item.id)}>{item.data().name}</button></li>) }
      </ul>
    );
  }

  const item = items.find(i => i.id === id);
  const addLike = () => updateDoc(doc(db, 'like', id), { like: like + 1 });

  return (
    <div>
      <p>{item.data().name}</p>
      <p><a href={item.data().url}>Article</a></p>
      <p>Like: {like} <button onClick={addLike}>Add</button></p>
      <p><button onClick={() => setId(null)}>Back</button></p>
    </div>
  );
}

async function run() {
  const docsSnapshot = await getDocs(col);

  ReactDOM.render(
    <React.StrictMode>
      <App items={docsSnapshot.docs} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

run();
