import React, { Component, createContext } from "react";
import ShoppingCart from "../DataTypes/ShoppingCart";
import User from "../DataTypes/User";
import { retrieveSavedUser, saveCredentials } from "../Services/authentication";

const Context = createContext({
  user: new User(),
  setUser: () => {},
});

const UserProvider = Context.Provider;
const UserConsumer = Context.Consumer;

class UserContext extends Component {
  state = {
    user: retrieveSavedUser(),
    cart: new ShoppingCart(),
  };

  setUser = (userData) => {
    if (userData === undefined) {
      this.setState({ user: new User() });
    } else {
      saveCredentials(userData);
      this.setState({ user: new User(userData) });
    }
  };

  setShoppingCart = (cart) => {
    this.setState({ cart });
  };

  emptyShoppingCart = () => {
    this.setState({ cart: new ShoppingCart() });
  };

  render() {
    const { setUser, setShoppingCart, emptyShoppingCart } = this;

    const contextValues = {
      ...this.state,
      setUser,
      setShoppingCart,
      emptyShoppingCart,
    };

    const children = this.props.children;

    return (
      <Context.Provider value={contextValues}>{children}</Context.Provider>
    );
  }
}

export { Context, UserContext, UserConsumer, UserProvider };
