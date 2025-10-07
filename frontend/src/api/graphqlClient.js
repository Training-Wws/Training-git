import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:5000/graphql', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`
  }
});

export default client;
