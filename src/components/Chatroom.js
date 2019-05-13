import React from "react";

import { compose, graphql } from "react-apollo";
import { observer } from "mobx-react";
import { css } from "glamor";
import uuid from "uuid/v4";
import { API, graphqlOperation } from "aws-amplify";
import UserStore from "../mobx/UserStore";
import { createChatLink, deleteChatLink } from "../graphql";

import {
  getChatroom,
  createMessage as CreateMessage,
  onCreateMessage as OnCreateMessage
} from "../graphql";

class Chatroom extends React.Component {
  state = {
    message: "",
    chatLinkId: null
  };

  addLink = async () => {
    const { username } = UserStore;
    const { chatroomId } = this.props.match.params;
    const link = { chatLinkUserId: username, chatLinkChatroomId: chatroomId };
    let res = await API.graphql(graphqlOperation(createChatLink, link));
    let createdLink = res.data.createChatLink;
    this.setState({ createdLink });
  };

  deleteChatLink = async () => {
    const { createdLink } = this.state;
    await API.graphql(graphqlOperation(deleteChatLink, createdLink));
  };

  componentWillUnmount() {
    console.log("unmount chatroom");
    this.deleteChatLink();
  }

  componentDidMount() {
    this.addLink();
    this.scrollToBottom();
    console.log("subscribe...");
    this.props.subscribeToNewMessages();
  }
  scrollToBottom = () => {
    this.div.scrollIntoView({ behavior: "smooth" });
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  createMessage = e => {
    if (e.key !== "Enter") {
      return;
    }
    if (this.state.message === "") return;
    const { username, nickname } = UserStore;
    const { chatroomId } = this.props.match.params;
    const message = {
      id: uuid(),
      createdAt: Date.now(),
      messageChatroomId: chatroomId,
      content: this.state.message,
      authorId: username,
      authorNickname: nickname
    };
    console.log(message);
    this.props.createMessage(message);
    this.setState({ message: "" });
  };

  render() {
    const { chatroomName } = this.props.match.params;
    const { username } = UserStore;
    let { messages } = this.props;
    messages = messages.sort((a, b) => a.createdAt - b.createdAt);

    return (
      <div>
        <div {...css(styles.chatroomNameContainer)}>
          <p {...css(styles.chatroomName)}>{chatroomName}</p>
        </div>
        <div {...css(styles.messagesContainer)}>
          {messages.map((m, i) => {
            return (
              <div
                key={i}
                {...css(
                  [styles.messageContainer],
                  checkSenderForMessageContainerStyle(username, m)
                )}
              >
                {checkSenderForAuthor(username, m)}
                <div
                  key={i}
                  {...css([
                    styles.message,
                    checkSenderForMessageStyle(username, m)
                  ])}
                >
                  <p
                    {...css([
                      styles.messageText,
                      checkSenderForTextStyle(username, m)
                    ])}
                  >
                    {m.content}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={val => (this.div = val)} {...css(styles.scroller)} />
        </div>
        <div {...css(styles.inputContainer)}>
          <input
            {...css(styles.input)}
            placeholder="Message"
            name="message"
            onChange={this.onChange}
            onKeyPress={this.createMessage}
            value={this.state.message}
          />
        </div>
      </div>
    );
  }
}

function checkSenderForAuthor(username, message, prev_message) {
  if (username === message.authorId) {
    return <div {...css([styles.author, styles.authorMe])}>me</div>;
  } else {
    return (
      <div {...css([styles.author, styles.authorOthers])}>
        {message.authorNickname ? message.authorNickname : "real human"}
      </div>
    );
  }
}

function checkSenderForMessageContainerStyle(username, message) {
  if (username === message.authorId) {
    return { justifyContent: "flex-end" };
  } else {
    return {};
  }
}

function checkSenderForMessageStyle(username, message) {
  if (username === message.authorId) {
    return {
      backgroundColor: "#1b86ff",
      marginRight: 10
    };
  } else {
    return { marginLeft: 10 };
  }
}

function checkSenderForTextStyle(username, message) {
  if (username === message.authorId) {
    return {
      color: "white"
    };
  }
}

const styles = {
  chatroomNameContainer: {
    backgroundColor: "#fafafa",
    padding: 20,
    borderBottom: "1px solid #ddd"
  },
  chatroomName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 500
  },
  scroller: {
    float: "left",
    clear: "both"
  },
  author: {
    display: "inline-block",
    position: "absolute",
    top: 0,
    fontSize: 14,
    color: "#444444"
  },
  authorOthers: {
    left: 15
  },
  authorMe: {
    right: 15
  },
  messagesContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 219px)",
    overflow: "scroll"
  },
  messageContainer: {
    position: "relative",
    display: "flex",
    flexWrap: "wrap"
  },
  message: {
    maxWidth: "60%",
    backgroundColor: "#ededed",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    marginTop: 20,
    marginBottom: 0
  },
  messageText: {
    margin: 0
  },
  input: {
    height: 45,
    outline: "none",
    border: "2px solid #ededed",
    margin: 5,
    borderRadius: 30,
    padding: "0px 20px",
    fontSize: 18,
    width: "calc(100% - 54px)"
  },
  inputContainer: {
    width: "100%",
    position: "absolute",
    bottom: 50,
    left: 0
  }
};

const ChatroomWithData = compose(
  graphql(getChatroom, {
    options: props => {
      const { chatroomId } = props.match.params;
      return {
        variables: {
          id: chatroomId
        },
        fetchPolicy: "cache-and-network"
      };
    },
    props: props => {
      const { chatroomId } = props.ownProps.match.params;
      console.log(props);
      let messages = props.data.getChatroom
        ? props.data.getChatroom.messages
          ? props.data.getChatroom.messages.items
          : []
        : [];

      return {
        messages,
        data: props.data,
        subscribeToNewMessages: params => {
          props.data.subscribeToMore({
            document: OnCreateMessage,
            variables: { messageChatroomId: chatroomId },
            updateQuery: (
              prev,
              {
                subscriptionData: {
                  data: { onCreateMessage }
                }
              }
            ) => {
              let messageArray = prev.getChatroom.messages.items.filter(
                message => message.id !== onCreateMessage.id
              );
              messageArray = [...messageArray, onCreateMessage];

              return {
                ...prev,
                getChatroom: {
                  ...prev.getChatroom,
                  messages: {
                    ...prev.getChatroom.messages,
                    items: messageArray
                  }
                }
              };
            }
          });
        }
      };
    }
  }),
  graphql(CreateMessage, {
    options: props => {
      const { chatroomId } = props.match.params;
      return {
        update: (dataProxy, { data: { createMessage } }) => {
          const query = getChatroom;
          const data = dataProxy.readQuery({
            query,
            variables: { id: chatroomId }
          });

          data.getChatroom.messages.items = data.getChatroom.messages.items.filter(
            m => m.id !== createMessage.id
          );

          data.getChatroom.messages.items.push(createMessage);

          dataProxy.writeQuery({
            query,
            data,
            variables: { id: chatroomId }
          });
        }
      };
    },
    props: props => ({
      createMessage: message => {
        props.mutate({
          variables: message,
          optimisticResponse: {
            createMessage: { ...message, __typename: "Message" }
          }
        });
      }
    })
  })
  // graphqlMutation(createMessage, getChat, 'Message')
)(Chatroom);

export default observer(ChatroomWithData);
