import api, { defaultError } from "../Services/api";

export default class ManageStaffGateway {
  async getStaff() {
    var returnData = [];

    await api
      .get("staff")
      .then((response) => {
        returnData = response.data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async updateStaff(staffData) {
    var returnData = {error: true};

    await api
      .put("staff/" + staffData.id, staffData)
      .then((response) => {
        returnData = response.data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async deleteStaff(id) {
    var returnData = { error: true };

    await api
      .delete("staff/" + id)
      .then((response) => {
        returnData = { error: false };
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async createStaff(staffData){
    var returnData = { error: true };

    await api
      .post("staff", staffData)
      .then((response) => {
        returnData = response.data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }
}
