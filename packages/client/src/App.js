import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';

const plusOne = increment(1);

function App({ db }) {
  const [items, setItems] = useState(null);
  const [id, setId] = useState(null);
  const [like, setLike] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const col = collection(db, 'eirei');
      const docsSnapshot = await getDocs(col);
      setItems(docsSnapshot.docs);
    }
    fetchData();
  }, [db]);

  useEffect(() => {
    if (!id) return null;
    setLike(null);
    const unsub = onSnapshot(doc(db, 'like', id), (doc) => {
      setLike(doc.data().like);
    });
    return unsub;
  }, [db, id]);

  if (!items) {
    return (
      <p>Now loading...</p>
    );
  }

  if (!id) {
    return (
      <ul>
        { items.map(item => (
          <li key={item.id}>
            <button onClick={() => setId(item.id)}>{item.data().name}</button>
          </li>
        )) }
      </ul>
    );
  }

  const item = items.find(i => i.id === id);
  const addLike = () => updateDoc(doc(db, 'like', id), { like: plusOne });

  return (
    <div>
      <p>{item.data().name}</p>
      <p><a href={item.data().url}>Article</a></p>
      <p>Like: {like} <button onClick={addLike}>Add</button></p>
      <p><button onClick={() => setId(null)}>Back</button></p>
    </div>
  );
}

export default App;
