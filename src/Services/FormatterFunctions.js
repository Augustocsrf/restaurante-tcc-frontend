import { USER_PERMISSIONS } from "../DataTypes/User";

//Método para formatar telefones
function formatPhone(number) {
  var length = number.length;
  var formattedPhone;

  if (length === 10) {
    formattedPhone =
      "(" +
      number.substring(0, 2) +
      ") " +
      number.substring(2, 6) +
      "-" +
      number.substring(6, 10);
  } else if (length === 11) {
    formattedPhone =
      "(" +
      number.substring(0, 2) +
      ") " +
      number.substring(2, 7) +
      "-" +
      number.substring(7, 11);
  }
  return formattedPhone;
}

//Método para formatar uma data
function formatDate(rawDate) {
  //Criar um objeto data
  const d = new Date(rawDate);
  const date = minTwoDigits(d.getDate());
  const month = minTwoDigits(d.getMonth() + 1);

  const dateString = date + "/" + month + "/" + d.getFullYear();

  return dateString;
}

function formatDateTime(rawDate) {
  //Criar um objeto data
  const d = new Date(rawDate);

  //Formatar informações para que items de um único digito tenham um zero antes
  const date = minTwoDigits(d.getDate());
  const month = minTwoDigits(d.getMonth() + 1);
  const hours = minTwoDigits(d.getHours());
  const minutes = minTwoDigits(d.getMinutes());

  const dateString =
    date +
    "/" +
    month + //(d.getMonth() + 1) +
    "/" +
    d.getFullYear() +
    " às " +
    hours +
    ":" +
    minutes;

  return dateString;
}

function formatOnlyHours(hour) {
  let hourArray = hour.split(":");
  return hourArray[0] + ":" + hourArray[1];
}

function formatPermission(permission) {
  switch (permission) {
    case USER_PERMISSIONS.ADMIN:
      return "Administrador";

    case USER_PERMISSIONS.STAFF:
      return "Funcionário";

    case USER_PERMISSIONS.CLIENT:
      return "Cliente";

    default:
      break;
  }
}

//Função para formatar números para que tenham pelo menos dois digitos com um zero antes
function minTwoDigits(n) {
  return (n < 10 ? "0" : "") + n;
}

export {
  formatPhone,
  formatDate,
  formatDateTime,
  formatOnlyHours,
  formatPermission,
};
