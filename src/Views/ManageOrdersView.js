import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import LoadingIcon from "../Components/LoadingIcon";
import { formatDateTime, formatMoney } from "../Services/FormatterFunctions";

//#region Importação de Material-UI
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
//#endregion

export default class ManageOrdersView extends Component {
  state = {
    loading: false,

    orders: [],
    ordersStatus: [],
  };

  constructor(props) {
    super(props);

    this.getOpenOrders = this.getOpenOrders.bind(this);
    this.getOrderStatus = this.getOrderStatus.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
  }

  componentDidMount() {
    this.getOpenOrders();
    this.getOrderStatus();
  }

  //Método para obter os pedidos em aberto
  async getOpenOrders() {
    this.setState({ loading: true });

    const orders = await this.props.getOpenOrders();

    this.setState({ orders });
  }

  //Método para obter os status dos pedidos
  async getOrderStatus() {
    const ordersStatus = await this.props.getOrdersStatuses();
    this.setState({ ordersStatus, loading: false });
  }

  //Método para atualizar os pedidos
  async updateOrder(order, newStatus, index) {
    const { orders } = this.state;

    let orderData = {
      id: order.id,
      status: newStatus.id,
    };

    //Caso o usuário esteja finalizando pedido, pedir confirmação antes de prosseguir
    if (newStatus.final) {
      const confirmation = window.confirm(
        "Você tem certeza que quer finalizar este pedido com o estado '" +
          newStatus.name +
          "'?"
      );

      if (confirmation) {
        orders[index].loading = true;
        this.setState({ orders });

        await this.props.updateOrder(orderData);

        orders.splice(index, 1);

        this.setState({ orders });
      }
    } else {
      //Caso a alteração não finalize o pedido, simplesmente prosseguir com a alteração
      orders[index].order_status_id = order.order_status_id;
      orders[index].loading = true;
      this.setState({ orders });

      await this.props.updateOrder(orderData);

      orders[index].loading = false;
      this.setState({ orders });
    }
  }

  render() {
    const { orders, ordersStatus, loading } = this.state;
    const { user } = this.props;

    //Componente que forma o select com os status recebidos
    const selectStatus = (order, index) => {
      if (order.loading) {
        return <LoadingIcon />;
      }

      return (
        <select
          className="selectCategoryStatus"
          value={order.order_status_id}
          onChange={(e) => {
            const statusId = e.target.value;
            order.order_status_id = statusId;
            var newStatus;

            // Obter o novo status informado para realizar outras operações baseado no id informado
            ordersStatus.forEach((orderStat) => {
              // eslint-disable-next-line eqeqeq
              if (orderStat.id == statusId) {
                newStatus = orderStat;
              }
            });

            this.updateOrder(order, newStatus, index);
          }}
        >
          {ordersStatus.map((status, sIndex) => {
            return (
              <option value={status.id} key={sIndex}>
                {status.name}
              </option>
            );
          })}
        </select>
      );
    };

    //Componente que forma a tabela com os pedidos
    const CollapsibleTable = (rows) => {
      return (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Nome</TableCell>
                <TableCell>Preço Total (R$)</TableCell>
                <TableCell>Pagamento</TableCell>
                <TableCell>Entrega</TableCell>
                <TableCell>Feito em:</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <Row
                  key={index}
                  row={row}
                  index={index}
                  selectStatus={selectStatus(row, index)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    };

    return (
      <div className="App AppBackground paddedScreen">
        {user.isUserAdmin() ? (
          <div className="buttonsDiv">
            <Link to={"/admin/status-pedido"} className="button">
              Gerenciar Estados de Pedidos
            </Link>
          </div>
        ) : null}
        {CollapsibleTable(orders)}

        <LoadingIcon loading={loading} />
      </div>
    );
  }
}

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Row(props) {
  const { row, index, selectStatus } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const { address, address_id } = row;

  //Caso o endereço não esteja nulo, preparar o texto com a indicação do texto
  let addressText = "";

  if (address_id != null) {
    const { identification, number, street, district } = address;
    addressText =
      identification + " (" + street + ", " + district + ", " + number + ")";
  } else {
    addressText = "Endereço informado foi deletado";
  }

  return (
    <React.Fragment>
      <TableRow
        className={classes.root}
        style={index % 2 ? { background: "#d1d1d1" } : { background: "white" }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell>R$ {formatMoney(row.price)}</TableCell>
        <TableCell>
          {row.payment_method === 1
            ? "Pagar com cartão"
            : "R$ " + row.cash.toFixed(2)}
        </TableCell>
        <TableCell>
          {row.delivery_method === 1 ? addressText : "Cliente pegará no local"}
        </TableCell>
        <TableCell>{formatDateTime(row.created_at)}</TableCell>
        <TableCell>{selectStatus}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Items Pedidos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Comentário</TableCell>
                    <TableCell>Preço Total (R$)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.items.map((item, index) => (
                    <TableRow
                      key={index}
                      style={
                        index % 2
                          ? { background: "#d1d1d1" }
                          : { background: "white" }
                      }
                    >
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.comment}</TableCell>
                      <TableCell>R$ {formatMoney(item.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
};
