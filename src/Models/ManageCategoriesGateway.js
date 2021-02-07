//import api from "../Components/api";
import api, { defaultError } from "../Services/api";

export default class ManageCategoriesGateway {
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

  async updateCategory(category) {
    var returnData;

    await api
      .put("categories/" + category.id, category)
      .then((response) => {
        
        const { data } = response;

        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async deleteCategory(id) {
    var returnData;

    await api
      .delete("categories/" + id)
      .then((response) => {
        const { data } = response;

        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async createCategory(categoryData) {
    const requestBody = JSON.stringify(categoryData);
    var returnData = {
      error: true,
    };

    await api
      .post("categories", requestBody)
      .then((response) => {
        const { data } = response;
        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }
}
