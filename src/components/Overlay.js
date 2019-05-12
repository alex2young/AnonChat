import React from "react";
import { css } from "glamor";
import { API, graphqlOperation } from "aws-amplify";

import { primary } from "../theme";
import { createConvo, createConvoLink, createRoom } from "../graphql";

class Overlay extends React.Component {
  state = { creatingChatroom: false, chatroomName: "" };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  createChatroom = async () => {
    this.setState({ creatingChatroom: true });
    try {
      const { geohash } = this.props;
      const { chatroomName } = this.state;
      const chat = { name: chatroomName, geohash };
      const chatroom = await API.graphql(graphqlOperation(createRoom, chat));
      const {
        data: {
          createRoom: { id: chatroomId }
        }
      } = chatroom;
      this.props.history.push(`/chatroom/${chatroomId}/${chatroomName}`);
      //   const relation1 = { convoLinkUserId: username, chatroomId };

      //   await API.graphql(graphqlOperation(createConvoLink, relation1));
      //   this.props.history.push(
      //     `/conversation/${chatroomId}/${chatroomName}`
      //   );
    } catch (err) {
      console.log("error creating conversation...", err);
    }
  };
  render() {
    const { latitude, longitude } = this.props.coords;
    const username = "global";
    return (
      <div {...css(styles.container)}>
        <div {...css(styles.content)}>
          <p {...css(styles.greetingTitle)}>New Chatroom</p>
          <p {...css(styles.greeting)}>Create new chatroom ?</p>
          <div {...css(styles.divider)} />
          <p {...css(styles.greeting)}>
            At {latitude}, {longitude}
          </p>
          <div {...css(styles.divider)} />
          <div {...css(styles.chatroomNameContainer)}>
            <input
              {...css(styles.chatroomName)}
              placeholder="Chatroom name"
              name="chatroomName"
              onChange={this.onChange}
              value={this.state.chatroomName}
            />
          </div>
          <div {...css(styles.button)} onClick={this.createChatroom}>
            <p {...css(styles.buttonText)}>Yes</p>
          </div>
          <div
            {...css([styles.button, styles.cancel])}
            onClick={() => this.props.toggleOverlay(false)}
          >
            <p {...css([styles.buttonText])}>Cancel</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Overlay;

const styles = {
  button: {
    backgroundColor: primary,
    padding: 15,
    margin: 10,
    marginTop: 0,
    cursor: "pointer"
  },
  cancel: {
    backgroundColor: "#ededed"
  },
  divider: {
    width: 200,
    margin: "0 auto",
    height: 2,
    backgroundColor: "rgba(0, 0, 0, .15)",
    marginBottom: 17,
    borderRadius: 10
  },
  buttonText: {
    margin: 0,
    textAlign: "center",
    fontWeight: 700
  },
  greetingTitle: {
    fontSize: 24,
    textAlign: "center",
    margin: 0,
    fontWeight: 500
  },
  greeting: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
    color: "rgba(0, 0, 0, .55)"
  },
  container: {
    position: "absolute",
    borderRadius: 25,
    zIndex: 1000,
    left: 20,
    bottom: 180,
    top: 180,
    right: 20,
    backgroundColor: "white",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, .2)"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 360px)",
    flex: 1,
    justifyContent: "center"
  },
  chatroomName: {
    padding: 15,
    margin: 10,
    marginTop: 0,
    height: 45,
    outline: "none",
    border: "2px solid #ededed",
    margin: 5,
    borderRadius: 30,
    padding: "0px 20px",
    fontSize: 18,
    width: "calc(100% - 54px)"
  }
};
