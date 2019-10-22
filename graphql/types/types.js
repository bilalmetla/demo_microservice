const typeDefs = `type Owners {
  _id: ID!
  name: String!
  email: String!
  address: String!
  phone: Float!
  pets: [Pets]
}
type Pets{
  _id: ID!
  name: String!
  colour: String!
  age: Float!
  breed: String!
}
type Query {
  owners: [Owners!]
  pets: [Pets!]
  owner(name: String!): Owners
  updateLevel(level: String!): String
  
}
type Mutation {
  addOwner(name: String!, email: String!, address: String!, phone: Float!): Owners!
  addPet(name: String!, colour: String!, age: Float!, breed: String!, owner: String!): Pets!
  editPet(id: String!, name: String!, colour: String!, age: Float!, breed: String!, owner: String!): Pets!
}
`;

exports.typeDefs = typeDefs;