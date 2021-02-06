import { Component } from "react";
import ManageProductsGateway from "../Models/ManageProductsGateway";
import ManageProductsView from "../Views/ManageProductsView";

export default class ManageProducts extends Component {
  constructor(props) {
    super(props);
    this.getAllProducts = this.getAllProducts.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
    this.createItem = this.createItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.getProductPage = this.getProductPage.bind(this);
  }

  async getAllProducts() {
    const gateway = new ManageProductsGateway();
    const returnData = gateway.getItems();

    return returnData;
  }

  async getProductPage(page){
    const gateway = new ManageProductsGateway();
    const returnData = gateway.getItemsPage(page);

    return returnData;
  }

  async getAllCategories() {
    const gateway = new ManageProductsGateway();
    const returnData = gateway.getCategories();

    return returnData;
  }

  async createItem(itemData) {
    const gateway = new ManageProductsGateway();
    const returnData = gateway.createItem(itemData);

    return returnData;
  }

  async deleteItem(id) {
    const gateway = new ManageProductsGateway();
    const returnData = gateway.deleteItem(id);

    return returnData;
  }

  async updateItem(itemData){
    const gateway = new ManageProductsGateway();
    const returnData = gateway.updateItem(itemData);

    return returnData;
  }

  render() {
    return (
      <ManageProductsView
        getAllProducts={this.getAllProducts}
        getAllCategories={this.getAllCategories}
        createItem={this.createItem}
        deleteItem={this.deleteItem}
        updateItem={this.updateItem}
        getProductPage={this.getProductPage}
      />
    );
  }
}