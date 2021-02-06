import { Component } from "react";
import api from "../Components/api";

export default class RegisterStaffGateway extends Component {
  constructor(props) {
    super(props);

    this.handleStaffRegister = this.handleStaffRegister.bind(this);
  }

  async handleStaffRegister(registerData) {
    const requestBody = JSON.stringify(registerData);
    var returnInformation = { success: true };

    await api
      .post("/login/registerStaff.php", requestBody)
      .then((response) => {
        returnInformation = { ...response.data };
      })
      .catch((e) => {
        console.error(e)
        returnInformation = { success: false }
      });

    return returnInformation;
  }
}
