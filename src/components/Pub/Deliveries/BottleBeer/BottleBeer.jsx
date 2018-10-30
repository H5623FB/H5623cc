import React, { Component } from "react";
import { toast } from "react-toastify";
import fire from "../../../../fbase";
import Moment from "moment";

import {
  Items,
  PAR,
  Requisitions,
  UpdateRequisitions,
  Delivered
} from "./BottleBeerParts";
import Submit from "../submit";
import AcceptAllButton from "../acceptAllButton";
import "../../../styles.css";

class BottleBeerDel extends Component {
  state = {
    items: [],
    par: [],
    requisitions: [],
    rid: [],
    delivered: [],
    value: ""
  };
  componentDidMount() {
    let itemRef = fire.database().ref("ILEC/Pub/ClosingForm/BottledBeer/Items");
    itemRef.on("value", snapshot => {
      let items = { id: snapshot.key, text: snapshot.val() };
      let itemnames = items.text;
      this.setState({ items: itemnames });
    });
    let currDate = this.calcTime("-2");
    let requisitionsRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BottledBeer/Requisitions/" + currDate);
    requisitionsRef.on("value", snapshot => {
      let requisitions = { id: snapshot.key, text: snapshot.val() };
      let requisitioningqty = requisitions.text;
      if (requisitioningqty !== null) {
        this.setState({ requisitions: requisitioningqty });
      } else {
        let nullRequisitionsRef = fire
          .database()
          .ref("ILEC/Pub/ClosingForm/BottledBeer/Requisitions/00-00-00");
        nullRequisitionsRef.on("value", snapshot => {
          let requisitions = { id: snapshot.key, text: snapshot.val() };
          let requisitionsqty = requisitions.text;
          this.setState({ requisitions: requisitionsqty });
        });
      }
    });

    let ridRef = fire.database().ref("ILEC/Pub/ClosingForm/BottledBeer/rid");
    ridRef.on("value", snapshot => {
      let rid = { id: snapshot.key, text: snapshot.val() };
      let ridqty = rid.text;
      this.setState({ rid: ridqty });
    });
    let deliveredRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BottledBeer/Delivered/" + currDate);
    deliveredRef.on("value", snapshot => {
      let delivered = { id: snapshot.key, text: snapshot.val() };
      let deliveredqty = delivered.text;
      if (deliveredqty !== null) {
        this.setState({ delivered: deliveredqty });
      } else {
        let nulldeliveredRef = fire
          .database()
          .ref("ILEC/Pub/ClosingForm/BottledBeer/Delivered/00-00-00");
        nulldeliveredRef.on("value", snapshot => {
          let delivered = { id: snapshot.key, text: snapshot.val() };
          let deliveredqty = delivered.text;
          this.setState({ delivered: deliveredqty });
        });
      }
    });
    let parRef = fire.database().ref("ILEC/Pub/ClosingForm/BottledBeer/PAR");
    parRef.on("value", snapshot => {
      let par = { id: snapshot.key, text: snapshot.val() };
      let parqty = par.text;
      this.setState({ par: parqty });
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
      .ref("ILEC/Pub/ClosingForm/BottledBeer/Delivered/" + currDate)
      .set(value);
    this.cancelCourse();
  };
  cancelCourse = () => {
    document.getElementById("bbdel").reset();
  };
  acceptAllReq = () => {
    let currDate = this.calcTime("-2");
    let req = { ...this.state.requisitions };
    fire
      .database()
      .ref("ILEC/Pub/ClosingForm/BottledBeer/Delivered/" + currDate)
      .set(req);
  };
  calcTime = offset => {
    let d = new Date();
    let utc = d.getTime() + d.getTimezoneOffset() * 60000;
    let nd = new Date(utc + 3600000 * offset);
    let ddmmyy = Moment(nd.toISOString()).format("DD-MM-YY");
    return ddmmyy;
  };
  render() {
    return (
      <React.Fragment>
        <div className="wrapper">
          <Items items={this.state.items} />
          <PAR par={this.state.par} />
          <Requisitions requisitions={this.state.requisitions} />
          <Delivered delivered={this.state.delivered} />
          <UpdateRequisitions rid={this.state.rid} change={this.handleChange} />
          <Submit submit={this.submitChange} />
        </div>
        <AcceptAllButton requisitions={this.acceptAllReq} />
      </React.Fragment>
    );
  }
}
export default BottleBeerDel;
