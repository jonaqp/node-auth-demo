import { GraphQLEnumType } from 'graphql';

const PROVIDER = new GraphQLEnumType({
  name: 'PROVIDER',
  description: 'Type of provider.',
  values: {
    FB: {
      value: 'facebook',
      description: 'Login Api Facebook',
    },
    GM: { value: 'gmail',
      description: 'Login Api Gmail'},
  },
});

export default PROVIDER;
