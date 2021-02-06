import api from "../Components/api";

//Model da tela de registro
export default class EditCategoryGateway {

  async updateCategory(updateCategoryData) {
    const requestBody = JSON.stringify(updateCategoryData);
    var returnData;

    await api
      .post("editMenu/updateCategory.php", requestBody)
      .then((response) => {
        //Verificar se Login ocorreu com sucesso
        if (response.data.success) {
          //Obter dados do usuário recebido e traduzir eles para os nomes esperados
          const {
            id,
            email,
            nome: name,
            sobrenome: lastName,
            telefone: phone,
          } = response.data.resultSet;
          const user = { id, email, name, lastName, phone, success: true };

          returnData = user;
        } else {
          //Caso as credenciais de login não tenham sido aceitas, retornar a variavel returnUserData como falso
          returnData = {
            success: false,
            message: response.data.message,
          };
        }
      })
      .catch((e) => {
        console.error(e);
        returnData = {
          success: false,
        };
      });

    return returnData;
  }
}
