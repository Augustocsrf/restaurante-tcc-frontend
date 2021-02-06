import React, { Component } from "react";
import EditCategoryView from "../Views/EditCategoryView";
import EditCategoryGateway from "../Models/EditCategoryGateway";
import { Context } from "../Context/Context";
import { Redirect } from "react-router-dom";

export default class EditCategory extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.id = this.props.match.params.id;

    this.updateCategory = this.updateCategory.bind(this);
  }

  async updateCategory(updateCategoryData) {
    const gateway = new EditCategoryGateway();
    await gateway.updateCategory(updateCategoryData);
  }

  render() {
    const { user } = this.context;

    //Verificar se o usuário tem a permissão para entrar nessa página, se não, retornar ele para a tela de login de funcionário
    if (!user.isUserAdmin()) {
      return <Redirect to="/funcionario/login" />;
    }

    return (
      <EditCategoryView id={this.id} updateCategory={this.updateCategory} />
    );
  }
}
