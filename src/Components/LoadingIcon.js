import React, { Component } from "react";
import Ring from "react-spinners-css/dist/Ring";
import "./LoadingIcon.css";

export default class LoadingIcon extends Component {
  constructor(props) {
    super(props);

    this.setSize = this.setSize.bind(this);
    this.setColor = this.setColor.bind(this);
  }

  setSize(size) {
    if (size === undefined) {
      size = 50;
    }

    if (size === "small") {
      size = 30;
    }

    return size;
  }

  setColor(color) {
    if (color === undefined) {
      color = "#ee4646";
    }

    return color;
  }

  render() {
    const { fullScreen, confirmButton, cancelButton } = this.props;
    let { loading, size, color } = this.props;

    //Se o usuário informar que esse carregamento é utilizado para substituir um botão de confirmação, automatizar a cor e tamanho
    if (confirmButton) {
      size = "small";
      color = "green";
    }

    //Se o usuário informar que esse carregamento é utilizado para substituir um botão de negação, automatizar a cor e tamanho
    if (cancelButton) {
      size = "small";
      color = "red";
    }

    //Caso não seja especificado se está carregando, assumir que está caregando
    if(loading === undefined){
      loading = true;
    }

    size = this.setSize(size);
    color = this.setColor(color);

    let screenClass = "";
    if (fullScreen === true) {
      screenClass = " fullScreen";
    }

    if (!loading) {
      return null;
    }
    
    return (
      <div className={"loadingRingIcon" + screenClass}>
        <Ring size={size} color={color} />
      </div>
    );
  }
}
