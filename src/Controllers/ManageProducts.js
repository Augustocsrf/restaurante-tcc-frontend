import { Component } from "react";
import { Redirect } from "react-router-dom";

import { Context } from "../Context/Context";

import ManageProductsGateway from "../Models/ManageProductsGateway";
import ManageProductsView from "../Views/ManageProductsView";

export default class ManageProducts extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página e definir o titulo da página
    window.scrollTo(0, 0);
    document.title = "Gerenciar Produtos";

    this.getAllProducts = this.getAllProducts.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
    this.createItem = this.createItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
  }

  async getAllProducts() {
    const gateway = new ManageProductsGateway();
    const returnData = await gateway.getItems();

    return returnData;
  }

  async getAllCategories() {
    const gateway = new ManageProductsGateway();
    const returnData = await gateway.getCategories();

    return returnData;
  }

  async createItem(itemData) {
    const gateway = new ManageProductsGateway();
    const returnData = await gateway.createItem(itemData);

    return returnData;
  }

  async deleteItem(id) {
    const gateway = new ManageProductsGateway();
    const returnData = await gateway.deleteItem(id);

    return returnData;
  }

  async updateItem(itemData) {
    const gateway = new ManageProductsGateway();
    const returnData = await gateway.updateItem(itemData);

    return returnData;
  }

  render() {
    const { user } = this.context;

    //Apenas permitir acesso a usuário administrador.
    // Se um usuário que não for administrador tentar entrar, redirecionar o usuário para outra página
    if (!user.isUserAdmin()) {
      alert("Você não tem permissão para acessar essa página");
      return <Redirect to="/" />;
    }

    return (
      <ManageProductsView
        getAllProducts={this.getAllProducts}
        getAllCategories={this.getAllCategories}
        createItem={this.createItem}
        deleteItem={this.deleteItem}
        updateItem={this.updateItem}
      />
    );
  }
}
