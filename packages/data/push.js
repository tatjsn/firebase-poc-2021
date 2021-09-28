const { readFileSync } = require('fs');
const { Firestore } = require('@google-cloud/firestore');

// Create a new client
const firestore = new Firestore();

async function pushEirei() {
  const raw  = readFileSync('out.json', 'utf8');
  const items = JSON.parse(raw);
  const col = firestore.collection('eirei');
  for (const item of items) {
    const doc = await col.add(item);
    console.log(doc.path);
  }
  console.log('Done');
}

async function pushLike() {
  const eireiCol = firestore.collection('eirei');
  const likeCol = firestore.collection('like');
  const docs = await eireiCol.listDocuments();
  for (const doc of docs) {
    const like = likeCol.doc(doc.id);
    await like.set({ like: 0 });
  }
  console.log('Done');
}

pushLike();
