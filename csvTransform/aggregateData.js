const { MongoClient } = require('mongodb');
const createProductDocuments = require('./createProductDocuments');

const aggregateDate = async () => {
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  const db = client.db('qanda');

  // Create Products collection if it does not exist
  //   const productsCollectionExist = await db
  //     .listCollections({ name: 'Products' })
  //     .toArray();
  //   if (!productsCollectionExist.length) {
  //     createProductDocuments();
  //     console.log('Successfully created Products collections');
  //   } else {
  //     console.log('Products collections already exists');
  //   }

  // Create variables for collections
  //   const productsCollections = db.collection('Products');
  //   const questionsCollections = db.collection('Questions');
  //   const answersCollections = db.collection('Answers');
  //   const photosCollections = db.collection('Photos');

  //   const fullProductsCollection = db.collection('FullProducts')

  //   const cursor = productsCollections.aggregate([
  //     {
  //         $lookup: {
  //             from: 'Questions'
  //             localField: 'product_id'
  //         }
  //     }
  //   ])

  client.close();
};
aggregateDate();
