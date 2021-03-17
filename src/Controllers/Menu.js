import React, { Component } from "react";

import { Context } from "../Context/Context";

import MenuGateway from "../Models/MenuGateway";
import MenuView from "../Views/MenuView";

//Controller da página de cardápio
export default class Menu extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página e definir o titulo da página
    window.scrollTo(0, 0);
    document.title = "Cardápio";

    //Bind funções criadas
    this.getMenu = this.getMenu.bind(this);
  }

  async getMenu() {
    const gateway = new MenuGateway();

    return await gateway.getMenus();
  }

  render() {
    const { user, setShoppingCart } = this.context;

    return (
      <MenuView
        getMenu={this.getMenu}
        user={user}
        setShoppingCart={setShoppingCart}
      />
    );
  }
}
