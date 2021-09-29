import React, { useState, useEffect } from 'react';
import {
  collection, getDocs, doc, onSnapshot, updateDoc, increment,
  query, orderBy, startAfter, limit,
} from 'firebase/firestore';

const plusOne = increment(1);

function App({ db }) {
  const [items, setItems] = useState(null);
  const [id, setId] = useState(null);
  const [like, setLike] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, 'eirei'), orderBy('name'), limit(10));
      const snapshots = await getDocs(q);
      setItems(snapshots.docs);
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
    const addMoreItems = async () => {
      const q = query(
        collection(db, 'eirei'),
        orderBy('name'),
        startAfter(items[items.length - 1]),
        limit(10)
      );
      const snapshots = await getDocs(q);
      setItems([ ...items, ...snapshots.docs ]);
    };

    return (
      <div>
        <ul>
          { items.map(item => (
            <li key={item.id}>
              <button onClick={() => setId(item.id)}>{item.data().name}</button>
            </li>
          )) }
        </ul>
        <p>
          <button onClick={addMoreItems}>More</button>
        </p>
      </div>
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
