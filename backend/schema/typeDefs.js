const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, role: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    updateProfile(name: String, email: String, password: String, role: String): User
  }
`);
