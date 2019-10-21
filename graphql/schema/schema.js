

const graphqlTools = require('graphql-tools');
const typeDefs = require('../types/types')
const resolvers = require('../resolvers/resolvers')

// Build the schema with Type Definitions and Resolvers
const schema = graphqlTools.makeExecutableSchema({typeDefs: typeDefs.typeDefs, resolvers: resolvers.resolveFunctions});

exports.schema = schema;
