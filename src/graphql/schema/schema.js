import {GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql';
import {GraphQLDateTime} from 'graphql-custom-types';
import User from '../../lib/users';
import UserProfile from '../../lib/userProfiles';


const UserProfileType = new GraphQLObjectType({
  name: 'UserProfile',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLID)},
    userId: {
      type: new GraphQLList(UserType),
      resolve(parentValue) {
          const query = {_id: parentValue.userId};
          return User.getAll(query)

      }
    },
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    bio: {type: GraphQLString},
    birthday: {type: GraphQLDateTime},
    picture: {type: GraphQLString},
    location: {type: GraphQLString},
    website: {type: GraphQLString},
    gender: {type: GraphQLString},

  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLID)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)},
    isAdmin: {type: GraphQLBoolean, defaultValue: false},
    userProfileId: {
      type: new GraphQLList(UserProfileType),
      resolve(parentValue) {
          const query = {_id: parentValue.userProfileId};
          return UserProfile.getAll(query)
      }
    },
  })
});

/** User Input Type */
const userAddInputType = new GraphQLInputObjectType({
  name: 'UserAddInput',
  fields: {
    email: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)},
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
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
  fields: () => ({
    user: {
      type: UserType,
      args: {
        id: {
          name: 'ID',
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(root, params) {
        return User.getById(params.id);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.list();
      }
    }

  })
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
        return User.create(params.data);

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
        return User.remove(params.id);
      }
    },
    editUser: {
      type: UserType,
      description: 'Edit a user',
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
        return User.update(id, data);
      }
    }
  })
});


export default new GraphQLSchema({
  query: RootQueryType,
  mutation
});

