import axios from "axios";

export default axios.create({
  baseURL: "https://augustotcc.com.br/api/api/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const defaultError = (e) => {
  // console.log(e);

  const { status } = e.response;
  const { message } = e.response.data;

  if (status === 409) {
    alert(message);
    return 0;
  }

  if (message) {
    alert(message);
    return 0;
  }

  alert(
    "Erro ocorrido com a conexão com o servidor. Tente novamente mais tarde."
  );
};

export { defaultError };
