import {GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql';
import UserModel from '../../lib/users';


const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLID)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)},
    isAdmin: {type: GraphQLBoolean, defaultValue: false}
  })
});

/** User Input Type */
const userAddInputType = new GraphQLInputObjectType({
  name: 'UserAddInput',
  fields: {
    email: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)},
    isAdmin: {type: GraphQLBoolean, defaultValue: false}
  }
});
const userEditInputType = new GraphQLInputObjectType({
  name: 'UserEditInput',
  fields: {
    password: {type: GraphQLString},
    isAdmin: {type: GraphQLBoolean}
  }
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: {
          name: 'ID',
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(root, params) {
        return UserModel.getById(params.id);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return UserModel.list();
      }
    }

  }
});


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addUser: {
      type: UserType,
      description: 'Create a new user',
      args: {
        data: {
          name: 'data',
          type: new GraphQLNonNull(userAddInputType)
        }
      },
      resolve(root, params) {
        return UserModel.create(params.data);

      }
    },
    deleteUser: {
      type: UserType,
      description: 'Delete an user with id and return the user that was deleted.',
      args: {
        id: {
          name: 'id',
          type: new GraphQLNonNull(GraphQLID),
        }
      },
      async resolve(root, params) {
        return UserModel.remove(params.id);
      }
    },
    editUser: {
      type: UserType,
      description: 'Create a new user',
      args: {
        id: {
          name: 'id',
          type: new GraphQLNonNull(GraphQLID)
        },
        data: {
          name: 'data',
          type: new GraphQLNonNull(userEditInputType)
        }
      },
      resolve(root, {id, data}) {
          return UserModel.update(id, data)
      }
    }
  })
});


export default new GraphQLSchema({
  query: RootQueryType,
  mutation
});

