export const CREATE_POST_MUTATION = `mutation CreatePostMutation($input: CreatePostInput!) {
    createPost(input: $input) {
      id
    }
  }
  `
