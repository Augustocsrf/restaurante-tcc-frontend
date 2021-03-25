import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { Context } from "../Context/Context";

import ManageCategoriesGateway from "../Models/ManageCategoriesGateway";
import ManageCategoryView from "../Views/ManageCategoriesView";

//Controller da tela de login e registro
export default class ManageCategories extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página e definir o titulo da página
    window.scrollTo(0, 0);
    document.title = "Gerenciar Categorias";

    this.getCategories = this.getCategories.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
  }

  //Método para obter as categorias criadas no momento
  async getCategories() {
    const gateway = new ManageCategoriesGateway();
    let categories = await gateway.getCategories();

    return categories;
  }

  async deleteCategory(id) {
    const gateway = new ManageCategoriesGateway();
    let response = await gateway.deleteCategory(id);

    return response;
  }

  async updateCategory(category) {
    const gateway = new ManageCategoriesGateway();
    let response = await gateway.updateCategory(category);

    return response;
  }

  async createCategory(categoryData) {
    const gateway = new ManageCategoriesGateway();
    let response = await gateway.createCategory(categoryData);

    return response;
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
      <ManageCategoryView
        getCategories={this.getCategories}
        updateCategory={this.updateCategory}
        deleteCategory={this.deleteCategory}
        createCategory={this.createCategory}
      />
    );
  }
}
