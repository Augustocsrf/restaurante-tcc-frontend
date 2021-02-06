import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "../Context/Context";
import CategoryManagementGateway from "../Models/CategoryManagementGateway";
import CategoryManagementView from "../Views/CategoryManagementView";

//Controller da tela de login e registro
export default class CategoryManagement extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.getCategories = this.getCategories.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.createCategory = this.createCategory.bind(this);
  }

  //Método para obter as categorias criadas no momento
  async getCategories() {
    const gateway = new CategoryManagementGateway();
    let categories = await gateway.getCategories();

    return categories;
  }

  async deleteCategory(id) {
    const gateway = new CategoryManagementGateway();

    let response = await gateway.deleteCategory(id);

    if(response.error){
      alert(response.error);
      
    }

    return response;
  }
  
  async createCategory(categoryData, successCallback) {
    const gateway = new CategoryManagementGateway();

    let response = await gateway.createCategory(categoryData);

    alert(response.message);

    //Caso a criação tenha ocorrido com sucesso, retornar para a tela anteriora
    if (response.success) {
      successCallback()
    }
  }

  render() {
    const { user } = this.context;

    if (!user.isUserAdmin()) {
      return <Redirect to="/funcionario/login" />;
    }    
   
    return (
      <CategoryManagementView
        getCategories={this.getCategories}
        deleteCategory={this.deleteCategory}
        createCategory={this.createCategory}
      />
    );
  }
}
