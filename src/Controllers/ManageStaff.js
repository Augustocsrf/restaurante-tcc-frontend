import React, { Component } from "react";
import ManageStaffView from "../Views/ManageStaffView";
import ManageStaffGateway from "../Models/ManageStaffGateway";

export default class ManageStaff extends Component {
  constructor(props) {
    super(props);

    //Mandar tela para o topo da página
    window.scrollTo(0, 0);

    this.getStaff = this.getStaff.bind(this);
    this.updateStaff = this.updateStaff.bind(this);
  }

  async getStaff() {
    const gateway = new ManageStaffGateway();
    const staff = await gateway.getStaff();

    return staff;
  }

  async updateStaff(staffData) {
    const gateway = new ManageStaffGateway();
    const response = await gateway.updateStaff(staffData);

    return response;
  }

  async deleteStaff(id) {
    const gateway = new ManageStaffGateway();
    const returnData = await gateway.deleteStaff(id);

    return returnData;
  }

  async createStaff(staffData) {
    const gateway = new ManageStaffGateway();
    const response = await gateway.createStaff(staffData);

    console.log(response);

    return response;
  }

  render() {
    return (
      <ManageStaffView
        getStaff={this.getStaff}
        deleteStaff={this.deleteStaff}
        updateStaff={this.updateStaff}
        createStaff={this.createStaff}
      />
    );
  }
}
