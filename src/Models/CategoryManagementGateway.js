//import api from "../Components/api";
import api, { defaultError } from '../Services/api';

export default class CategoryManagementGateway {
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

  async deleteCategory(id) {
    var returnData;

    await api
      //.delete("editMenu/deleteCategory.php", null, { params: { id } })
      .delete('categories/' + id)
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

  async createCategory(categoryData) {
    const requestBody = JSON.stringify(categoryData);
    var returnData;

    await api
      .post("editMenu/createCategory.php", requestBody)
      .then((response) => {
        const { success, message } = response.data;

        returnData = { success, message };
      })
      .catch((e) => {
        returnData = {
          success: false,
          message:
            "Erro ao se conectar com o servidor. Tente novamente mais tarde.",
        };
      });

    return returnData;
  }
}
