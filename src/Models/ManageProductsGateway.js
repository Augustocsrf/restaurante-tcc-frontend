import api, { defaultError } from "../Services/api";

//Model da tela de registro
export default class ManageProductsGateway {
  async getItems() {
    var returnData;

    await api
      .get("/items")
      .then((response) => {
        const { data } = response;
        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
        returnData = [];
      });

    return returnData;
  }

  async getItemsPage(page) {
    var returnData;

    await api
      .get("/items/page/" + page)
      .then((response) => {
        const { data } = response;
        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
        returnData = [];
      });

    return returnData;
  }

  async getCategories() {
    var returnData = [];

    await api
      .get("categories")
      .then((response) => {
        const { data } = response;

        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async createItem(itemData) {
    var returnData = { error: true };

    await api
      .post("items", itemData)
      .then((response) => {
        console.log(response);
        const { data } = response;
        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async deleteItem(id) {
    var returnData;

    await api
      .delete("/items/" + id)
      .then((response) => {
        console.log(response);
        //const { data } = response;
        //returnData = data;
        returnData = true;
      })
      .catch((e) => {
        defaultError(e);
        returnData = false;  
      });

    return returnData;
  }

  async updateItem(itemData) {
    var returnData;

    await api
      .put("/items/" + itemData.id, itemData)
      .then((response) => {
        console.log(response);

        const { data } = response;
        
        alert(data.message);

        returnData = data.item;        
      })
      .catch((e) => {
        defaultError(e);
        returnData = false;
      });

    return returnData;
  }
}