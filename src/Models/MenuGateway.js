import api from "../Services/api";

export default class MenuGateway {
  async getMenus() {
    var categoryList = [];

    await api
      .get("menu")
      .then((response) => {
        const { data } = response;
        categoryList = data;
      })
      .catch((e) => {
        console.log(e);
        alert(
          "Erro ocorrido com a conexão com o servidor. Tente novamente mais tarde."
        );
      });

    return categoryList;
  }
}
