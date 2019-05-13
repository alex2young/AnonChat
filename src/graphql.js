import graphql from "graphql-tag";
import gql from "graphql-tag";

// mutations
const createUser = `
  mutation($username: String!) {
    createUser(input: {
      username: $username
    }) {
      id username createdAt
    }
  }
`;

const createMessage = gql`
  mutation CreateMessage(
    $createdAt: String
    $id: ID
    $authorId: String
    $authorNickname: String
    $content: String!
    $messageChatroomId: ID!
  ) {
    createMessage(
      input: {
        createdAt: $createdAt
        id: $id
        content: $content
        messageChatroomId: $messageChatroomId
        authorId: $authorId
        authorNickname: $authorNickname
      }
    ) {
      id
      content
      authorId
      authorNickname
      messageChatroomId
      createdAt
    }
  }
`;

const createConvo = `mutation CreateConvo($name: String!, $members: [String!]!) {
  createConvo(input: {
    name: $name, members: $members
  }) {
    id
    name
    members
  }
}
`;

const createConvoLink = `mutation CreateConvoLink(
    $convoLinkConversationId: ID!, $convoLinkUserId: ID
  ) {
  createConvoLink(input: {
    convoLinkConversationId: $convoLinkConversationId, convoLinkUserId: $convoLinkUserId
  }) {
    id
    convoLinkUserId
    convoLinkConversationId
    conversation {
      id
      name
    }
  }
}
`;

const getUser = graphql`
  query getUser($id: ID!) {
    getUser(id: $id) {
      id
      username
    }
  }
`;

const getUserAndConversations = gql`
  query getUserAndConversations($id: ID!) {
    getUser(id: $id) {
      id
      username
      conversations(limit: 100) {
        items {
          id
          conversation {
            id
            name
          }
        }
      }
    }
  }
`;

const getConvo = gql`
  query getConvo($id: ID!) {
    getConvo(id: $id) {
      id
      name
      members
      messages(limit: 100) {
        items {
          id
          content
          authorId
          messageConversationId
          createdAt
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const listUsers = graphql`
  query listUsers {
    listUsers {
      items {
        id
        username
        createdAt
      }
    }
  }
`;

const onCreateMessage = gql`
  subscription onCreateMessage($messageChatroomId: ID!) {
    onCreateMessage(messageChatroomId: $messageChatroomId) {
      id
      content
      authorId
      messageChatroomId
      createdAt
    }
  }
`;

const onCreateUser = gql`
  subscription OnCreateUser {
    onCreateUser {
      id
      username
      createdAt
    }
  }
`;

const getChatrooms = gql`
  query GetChatrooms($geohash: String!) {
    getChatrooms(geohash: $geohash) {
      items {
        id
        name
        geohash
        createdAt
        updatedAt
      }
    }
  }
`;

const createRoom = `mutation CreateRoom($name: String!, $geohash: String!) {
	createRoom(input: {
		geohash: $geohash
		name: $name
	}) {
	  id
	  messages {
		nextToken
	  }
	  associated {
		nextToken
	  }
	  name
	  geohash
	  createdAt
	  updatedAt
	}
  }
  `;

const getChatroom = gql`
  query getChatroom($id: ID!) {
    getChatroom(id: $id) {
      id
      name
      messages(limit: 100) {
        items {
          id
          content
          authorId
          authorNickname
          messageChatroomId
          createdAt
        }
      }
      createdAt
      updatedAt
      geohash
    }
  }
`;

const createChatLink = `mutation CreateChatLink(
    $chatLinkChatroomId: ID!, $chatLinkUserId: ID
  ) {
  createChatLink(input: {
    chatroomId: $chatLinkChatroomId, userId: $chatLinkUserId
  }) {
    id
    userId
    chatroomId
  }
}
`;

const deleteChatLink = `mutation deleteChatLink(
    $id: ID, $chatroomId: ID
  ) {
  deleteChatLink(input: {
	id: $id
	chatroomId: $chatroomId
  }) {
    id
  }
}
`;

export {
  createUser,
  createMessage,
  createConvo,
  createConvoLink,
  getConvo,
  getUser,
  getUserAndConversations,
  listUsers,
  onCreateMessage,
  onCreateUser,
  getChatrooms,
  getChatroom,
  createRoom,
  createChatLink,
  deleteChatLink
};
