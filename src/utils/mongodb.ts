import { MongoClient, ServerApiVersion } from 'mongodb'
import 'dotenv/config'

const uri = process.env.DATABASE_URL || ''

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const mongo = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

export const ChatAppDb = mongo.db('chatApp')

// async function run() {
//   try {
//     // Connect the client to the server (optional starting in v4.7)

//     // Send a ping to confirm a successful connection
//     await mongo.db('admin').command({ ping: 1 })
//     console.log('Pinged your deployment. You successfully connected to MongoDB!')
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongo.close()
//   }
// }
// run().catch(console.dir)
