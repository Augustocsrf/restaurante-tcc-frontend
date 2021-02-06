import { Component } from "react";
import '../Styles/Modal.css'

//Componente Modal que será usado em múltiplas telas, geralmente para pedir algumas informações
export default class Modal extends Component {
  render() {
    const { show, children } = this.props;
    const showHideClassName = show
      ? "modal display-block"
      : "modal display-none";

    return (
      <div className={showHideClassName}>
        <section className="modal-main">
          {children}
          {/*<button onClick={handleClose}>close</button>*/}
        </section>
      </div>
    );
  }
}
