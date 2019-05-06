import React from "react";
import { css } from "glamor";
import { observer } from "mobx-react";
import { graphql, compose } from "react-apollo";
import { FaComments, FaChevronRight, FaCentercode } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaUser, FaPlus } from "react-icons/fa";
import UserStore from "../mobx/UserStore";
import { primary, lightBg } from "../theme";
import { getUserAndChatrooms } from "../graphql";
import Overlay from "./Overlay";

const ChatroomsObserver = observer(
  class Chatrooms extends React.Component {
    state = { showOverlay: false, userForChat: {} };
    toggleOverlay = (visible, userForChat) => {
      this.setState({ showOverlay: visible, userForChat });
    };
    render() {
      const { username } = UserStore;
      let { chatrooms } = this.props;
      chatrooms = chatrooms.map(c => {
        const chat = c.chatroom.name.split("&");
        const name = chat.find(i => i !== username);
        return { ...c, name };
      });
      console.log({ convs: chatrooms });
      return (
        <div {...css(styles.container)}>
          {this.state.showOverlay && (
            <Overlay
              toggleOverlay={this.toggleOverlay}
              username={username}
              history={this.props.history}
            />
          )}
          <p {...css(styles.title)}>Chatrooms</p>
          <div onClick={() => this.toggleOverlay(true)}>
            <div {...css(styles.plusIconContainer)}>
              <FaPlus />
            </div>
          </div>
          {chatrooms.map((item, i) => (
            <Link
              to={`chatroom/${item.chatroom.id}/${item.name}`}
              {...css(styles.link)}
              key={i}
            >
              <div {...css(styles.chatroom)}>
                <FaComments />
                <p {...css(styles.chatroomTitle)}>{item.name}</p>
                <div {...css(styles.chevronContainer)}>
                  <FaChevronRight />
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    }
  }
);

const ChatroomsWithData = compose(
  graphql(getUserAndChatrooms, {
    options: () => {
      return {
        variables: {
          id: UserStore.username
        },
        fetchPolicy: "cache-and-network"
      };
    },
    props: props => {
      return {
        chatrooms: props.data.getUser ? props.data.getUser.chatrooms.items : []
      };
    }
  })
)(ChatroomsObserver);

const styles = {
  plusIconContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "center"
  },
  link: {
    textDecoration: "none",
    color: "black"
  },
  container: {
    padding: 10
  },
  chatroom: {
    marginTop: 10,
    backgroundColor: lightBg,
    padding: "12px 15px",
    borderRadius: 20,
    display: "flex"
  },
  chatroomTitle: {
    margin: 0,
    marginLeft: 12
  },
  chevronContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end"
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    margin: 0,
    borderBottom: `2px solid ${primary}`,
    paddingBottom: 4,
    textAlign: "center"
  }
};

export default observer(ChatroomsWithData);
