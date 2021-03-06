import React, { Component } from "react";
import { toast } from "react-toastify";
import fire from "../../../../fbase";
import Moment from "moment";

import {
  Items,
  Opening,
  Sale,
  Closing,
  Delivered,
  Difference,
  PAR,
  Transfers,
  Wastage,
  UpdateClosing
} from "./Bag in Box CordialParts";
import Submit from "../submit";
import "../../../styles.css";

class BAGinBoxCordial extends Component {
  state = {
    items: [],
    opening: [],
    sale: [],
    closing: [],
    delivered: [],
    comments: [],
    difference: [],
    par: [],
    transfers: [],
    wastage: [],
    rid: [],
    value: ""
  };
  componentDidMount() {
    let itemRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Items");
    itemRef.on("value", snapshot => {
      let items = { id: snapshot.key, text: snapshot.val() };
      let itemnames = items.text;
      this.setState({ items: itemnames });
    });
    let prevDate = this.calcTime("-23");
    let openRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Closing/" + prevDate);

    openRef.on("value", snapshot => {
      let opening = { id: snapshot.key, text: snapshot.val() };
      let openingqty = opening.text;
      if (openingqty !== null) {
        this.setState({ opening: openingqty });
      } else {
        let nullOpeningRef = fire
          .database()
          .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Closing/00-00-00");
        nullOpeningRef.on("value", snapshot => {
          let opening = { id: snapshot.key, text: snapshot.val() };
          let openingqty = opening.text;
          this.setState({ opening: openingqty });
        });
      }
    });
    let currDate = this.calcTime("-2");
    let saleRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Sold/" + currDate);
    saleRef.on("value", snapshot => {
      let sale = { id: snapshot.key, text: snapshot.val() };
      let saleqty = sale.text;
      if (saleqty !== null) {
        this.setState({ sale: saleqty });
      } else {
        let nullSaleRef = fire
          .database()
          .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Sold/00-00-00");
        nullSaleRef.on("value", snapshot => {
          let sale = { id: snapshot.key, text: snapshot.val() };
          let saleqty = sale.text;
          this.setState({ sale: saleqty });
        });
      }
    });

    let closingRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Closing/" + currDate);

    closingRef.on("value", snapshot => {
      let closing = { id: snapshot.key, text: snapshot.val() };
      let closingqty = closing.text;
      if (closingqty !== null) {
        this.setState({ closing: closingqty });
      } else {
        let nullClosingRef = fire
          .database()
          .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Closing/00-00-00");
        nullClosingRef.on("value", snapshot => {
          let closing = { id: snapshot.key, text: snapshot.val() };
          let closingqty = closing.text;
          this.setState({ closing: closingqty });
        });
      }
    });

    let ridRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/rid");
    ridRef.on("value", snapshot => {
      let rid = { id: snapshot.key, text: snapshot.val() };
      let ridqty = rid.text;
      this.setState({ rid: ridqty });
    });
    let commentsRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Comments");
    commentsRef.on("value", snapshot => {
      let comments = { id: snapshot.key, text: snapshot.val() };
      let commentsqty = comments.text;
      this.setState({ comments: commentsqty });
    });
    let deliveredRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Delivered/" + currDate);
    deliveredRef.on("value", snapshot => {
      let delivered = { id: snapshot.key, text: snapshot.val() };
      let deliveredqty = delivered.text;
      if (deliveredqty !== null) {
        this.setState({ delivered: deliveredqty });
      } else {
        let nulldeliveredRef = fire
          .database()
          .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Delivered/00-00-00");
        nulldeliveredRef.on("value", snapshot => {
          let delivered = { id: snapshot.key, text: snapshot.val() };
          let deliveredqty = delivered.text;
          this.setState({ delivered: deliveredqty });
        });
      }
    });

    let differenceRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Difference/" + currDate);
    differenceRef.on("value", snapshot => {
      let difference = { id: snapshot.key, text: snapshot.val() };
      let differenceqty = difference.text;
      if (differenceqty !== null) {
        this.setState({ difference: differenceqty });
      } else {
        let nullDifferenceRef = fire
          .database()
          .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Difference/00-00-00");
        nullDifferenceRef.on("value", snapshot => {
          let difference = { id: snapshot.key, text: snapshot.val() };
          let differenceqty = difference.text;
          this.setState({ difference: differenceqty });
        });
      }
    });

    let parRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/PAR");
    parRef.on("value", snapshot => {
      let par = { id: snapshot.key, text: snapshot.val() };
      let parqty = par.text;
      this.setState({ par: parqty });
    });
    let transfersRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Transfers/" + currDate);
    transfersRef.on("value", snapshot => {
      let transfers = { id: snapshot.key, text: snapshot.val() };
      let transfersqty = transfers.text;
      if (transfersqty !== null) {
        this.setState({ transfers: transfersqty });
      } else {
        let nullTransfersRef = fire
          .database()
          .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Transfers/00-00-00");
        nullTransfersRef.on("value", snapshot => {
          let transfers = { id: snapshot.key, text: snapshot.val() };
          let transfersqty = transfers.text;
          this.setState({ transfers: transfersqty });
        });
      }
    });

    let wastageRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Wastage/" + currDate);
    wastageRef.on("value", snapshot => {
      let wastage = { id: snapshot.key, text: snapshot.val() };
      let wastageqty = wastage.text;
      if (wastageqty !== null) {
        this.setState({ wastage: wastageqty });
      } else {
        let nullWastageRef = fire
          .database()
          .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Wastage/00-00-00");
        nullWastageRef.on("value", snapshot => {
          let wastage = { id: snapshot.key, text: snapshot.val() };
          let wastageqty = wastage.text;
          this.setState({ wastage: wastageqty });
        });
      }
    });
  }
  handleChange = e => {
    const value = { ...this.state.value };
    value[e.currentTarget.id] = e.currentTarget.value;
    this.setState({ value });
  };
  submitChange = e => {
    e.preventDefault();
    let values = this.state.value;
    let valueArr = Object.keys(values).map(i => values[i]);
    let value = valueArr.map(function(item) {
      return parseInt(item, 10);
    });
    let str = [];
    let ridLen = this.state.rid.length;
    const errors = {};

    for (let key in value) {
      str.push(value[key]);
    }
    let strLen = str.length;
    function IsNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    if (strLen === 0) {
      errors.message = "Each field has to be filled!";
      return toast.error(errors.message);
    }

    for (let key in value) {
      str += value[key];

      if (IsNumeric(value[key]) === false) {
        errors.message = "Only numbers accepted! Each field have to be filled";
        return toast.error(errors.message);
      }
      if (strLen !== ridLen) {
        errors.message = "Each field have to be filled!";
        return toast.error(errors.message);
      }
    }
    let currDate = this.calcTime("-2");
    fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Closing/" + currDate)

      .set(value);
    this.cancelCourse();
    this.calcDiff(value, currDate);
  };
  cancelCourse = () => {
    document.getElementById("cordial").reset();
  };
  calcTime = offset => {
    let d = new Date();
    let utc = d.getTime() + d.getTimezoneOffset() * 60000;
    let nd = new Date(utc + 3600000 * offset);
    let ddmmyy = Moment(nd.toISOString()).format("DD-MM-YY");
    return ddmmyy;
  };
  calcDiff = (value, currDate) => {
    let closing = value;
    let opening = this.state.opening;
    let delivered = this.state.delivered;
    let transfers = this.state.transfers;
    let wastage = this.state.wastage;
    let sale = this.state.sale;
    let diffs = opening.map(
      (a, i) =>
        -1 *
        (a + delivered[i] + transfers[i] + wastage[i] + sale[i] - closing[i])
    );
    let diff = diffs.map(e => {
      return Number(e.toFixed(2));
    });
    fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BAG in Box-Cordial/Difference/" + currDate)
      .set(diff);
  };
  render() {
    return (
      <React.Fragment>
        <div className="wrapper">
          <Items items={this.state.items} />
          <PAR par={this.state.par} />
          <Opening opening={this.state.opening} />
          <Delivered delivered={this.state.delivered} />
          <Transfers transfers={this.state.transfers} />
          <Wastage wastage={this.state.wastage} />
          <Sale sale={this.state.sale} />
          <Closing closing={this.state.closing} />
          <Difference difference={this.state.difference} />
          <UpdateClosing rid={this.state.rid} change={this.handleChange} />
          <Submit submit={this.submitChange} />
        </div>
      </React.Fragment>
    );
  }
}
export default BAGinBoxCordial;
