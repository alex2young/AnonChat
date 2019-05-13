import React from "react";
import { Switch, Route } from "react-router-dom";

import Chatrooms from "./components/Chatrooms";
import Chatroom from "./components/Chatroom";
// import Users from "./components/Users";
import Profile from "./components/Profile";
import Footer from "./components/Footer";

const Routes = () => (
  <div>
    <Switch>
      <Route path="/" exact component={props => <Chatrooms {...props} />} />
      {/* <Route path="/users/" component={Users} /> */}
      <Route path="/profile/" component={Profile} />
      <Route path="/chatroom/:chatroomId/:chatroomName" component={Chatroom} />
      <Route component={() => <p>404 no route found</p>} />
    </Switch>
    <Footer />
  </div>
);

export default Routes;
