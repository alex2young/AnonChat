import React from "react";
import { css } from "glamor";
import { observer } from "mobx-react";
import { graphql, compose } from "react-apollo";
import { FaComments, FaChevronRight, FaCentercode } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaUser, FaPlus } from "react-icons/fa";
import UserStore from "../mobx/UserStore";
import { primary, lightBg } from "../theme";
import { getChatrooms } from "../graphql";
import Overlay from "./Overlay";
import { getGeohash, GeoContext } from "../geo";

const ChatroomsObserver = observer(
  class Chatrooms extends React.Component {
    state = {
      showOverlay: false,
      userForChat: {}
    };
    toggleOverlay = (visible, userForChat) => {
      this.setState({ showOverlay: visible, userForChat });
    };

    componentDidMount() {
      this.props.refetch({ geohash: this.props.geohash });
      console.log("refetch with geohash = " + this.props.geohash);
    }

    render() {
      const { username } = UserStore;
      let { chatrooms } = this.props;
      chatrooms = chatrooms.map(c => {
        const chat = c.name.split("&");
        const name = chat.find(i => i !== username);
        return { ...c, name };
      });
      //   console.log({ convs: chatrooms });
      //   console.log(this.props);
      return (
        <div {...css(styles.container)}>
          {this.props.showOverlay && (
            <Overlay
              toggleOverlay={this.props.toggleOverlay}
              username={username}
              history={this.props.history}
              coords={this.props.coords}
              geohash={this.props.geohash}
            />
          )}
          <p {...css(styles.title)}>Chatrooms</p>
          <div onClick={() => this.props.toggleOverlay(true)}>
            <div {...css(styles.plusIconContainer)}>
              <FaPlus />
            </div>
          </div>
          {chatrooms.map((item, i) => (
            <Link
              to={`chatroom/${item.id}/${item.name}`}
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
          {/* <button onClick={() => this.props.refetch()}>Refresh!</button> */}
        </div>
      );
    }
  }
);

const ChatroomsWithData = compose(
  graphql(getChatrooms, {
    options: props => {
      return {
        variables: {
          geohash: props.geohash ? props.geohash : "null"
        },
        fetchPolicy: "network"
      };
    },
    props: props => {
      return {
        chatrooms: props.data.getChatrooms ? props.data.getChatrooms.items : [],
        refetch: props.data.refetch
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

const ChatroomsWithDataAndGeo = React.forwardRef((props, ref) => (
  <GeoContext.Consumer>
    {({ coords, geohash, showOverlay, toggleOverlay }) => (
      <ChatroomsWithData
        {...props}
        coords={coords}
        geohash={geohash}
        showOverlay={showOverlay}
        toggleOverlay={toggleOverlay}
        ref={ref}
      />
    )}
  </GeoContext.Consumer>
));

export default observer(ChatroomsWithDataAndGeo);
