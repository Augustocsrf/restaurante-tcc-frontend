import api, { defaultError } from "../Services/api";

export default class MenuGateway {
  async getMenus() {
    var categoryList = [];

    await api
      .get("available-menu")
      .then((response) => {
        const { data } = response;
        categoryList = data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return categoryList;
  }
}
