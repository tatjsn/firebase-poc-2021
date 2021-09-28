const { readFileSync } = require('fs');
const { Firestore } = require('@google-cloud/firestore');

// Create a new client
const firestore = new Firestore();

async function quickstart() {
  const raw  = readFileSync('out.json', 'utf8');
  const items = JSON.parse(raw);
  const col = firestore.collection('eirei');
  for (const item of items) {
    const doc = await col.add(item);
    console.log(doc.path);
  }
  console.log('Done');
}
quickstart();
