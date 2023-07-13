require('dotenv').config();
const { MongoClient } = require('mongodb');
const PORT = process.env.MONGO_PORT || 27017;

const client = new MongoClient(`mongodb://localhost:${PORT}`, {
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    // Send a ping to confirm a successful connection
    await client.connect();
    const db = client.db('qanda');

    await db.command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
