import { API, graphqlOperation, Auth } from "aws-amplify";
import { getUser as GetUser, createUser } from "../graphql";

import { observable, decorate } from "mobx";
import genRandomName from "../anon/generateName";

class User {
  username = "";
  email = "";
  nickname = "real human";
  async init() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      this.username = user.username;
      this.email = user.signInUserSession.idToken.payload.email;
      this.nickname = genRandomName();
    } catch (err) {
      console.log("error getting user data... ", err);
    }
    console.log("username:", this.username);
    // check if user exists in db, if not then create user
    if (this.username !== "") {
      this.checkIfUserExists(this.username);
    }
  }

  async checkIfUserExists(id) {
    try {
      const user = await API.graphql(graphqlOperation(GetUser, { id }));
      const { getUser } = user.data;
      if (!getUser) {
        console.log("create new");
        this.createUser();
      } else {
        console.log("me:", getUser);
      }
    } catch (err) {
      console.log("error fetching user: ", err);
    }
  }

  async createUser() {
    try {
      await API.graphql(
        graphqlOperation(createUser, { username: this.username })
      );
    } catch (err) {
      console.log("Error creating user! :", err);
    }
  }
}

decorate(User, {
  username: observable,
  email: observable
});

export default new User();
