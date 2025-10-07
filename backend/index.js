const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const resolvers = require('./schema/resolvers');
const auth = require('./middleware/auth');
const typeDefs = require('./schema/typeDefs'); // only declare once

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mern_graphql')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/graphql', graphqlHTTP(req => ({
  schema: typeDefs,
  rootValue: resolvers,
  graphiql: true,
  context: { user: auth(req) }
})));

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000/graphql'));
