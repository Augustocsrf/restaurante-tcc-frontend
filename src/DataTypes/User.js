const USER_PERMISSIONS = {
  GUEST: 0,
  CLIENT: 1,
  STAFF: 2,
  ADMIN: 3,
};

export default class User {
  id = 0;
  email = "";
  name = "";
  lastName = "";
  phone = "";
  apiToken = "";
  permission = USER_PERMISSIONS.GUEST;
  confirmed = false;

  constructor(userObject) {
    //Verificar se algo foi enviado, se não, manter os dados vazios (o estado de que nenhum usuário fez login)
    if (userObject !== undefined) {
      this.id = userObject.id;
      this.name = userObject.name;
      this.lastName = userObject.lastName;
      this.email = userObject.email;
      this.phone = userObject.phone;
      this.apiToken = userObject.apiToken;
      this.confirmed = !userObject.email_verified_at ? false : true;

      //Caso alguma permissão tenha sido especificada, atualizar a permissão, se não, manter a permissão de cliente
      if (userObject.permission !== undefined) {
        this.permission = userObject.permission;
      }
    }

    this.isUserGuest = this.isUserGuest.bind(this);
    this.isUserClient = this.isUserClient.bind(this);
    this.isUserStaff = this.isUserStaff.bind(this);
    this.isUserAdmin = this.isUserAdmin.bind(this);
    this.isUserConfirmed = this.isUserConfirmed.bind(this);
  }

  isUserGuest() {
    return this.permission === USER_PERMISSIONS.GUEST;
  }

  isUserClient() {
    return this.permission === USER_PERMISSIONS.CLIENT;
  }

  isUserStaff() {
    return this.permission === USER_PERMISSIONS.STAFF;
  }

  isUserAdmin() {
    return this.permission === USER_PERMISSIONS.ADMIN;
  }

  isUserConfirmed() {
    return this.confirmed;
  }
}

export { USER_PERMISSIONS };
