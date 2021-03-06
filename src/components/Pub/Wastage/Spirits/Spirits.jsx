import React, { Component } from "react";
import { toast } from "react-toastify";
import fire from "../../../../fbase";
import Moment from "moment";

import { Items, Wastage, UpdateWastage } from "./SpiritsParts";
import Submit from "../submit";
import "../../../styles.css";

class SpiritsWastage extends Component {
  state = {
    items: [],
    wastage: [],
    rid: [],
    value: ""
  };
  componentDidMount() {
    let itemRef = fire.database().ref("ILEC/Pub/ClosingForm/Spirits/Items");
    itemRef.on("value", snapshot => {
      let items = { id: snapshot.key, text: snapshot.val() };
      let itemnames = items.text;
      this.setState({ items: itemnames });
    });
    let currDate = this.calcTime("-2");
    let wastageRef = fire
      .database()
      .ref("ILEC/Pub/ClosingForm/Spirits/Wastage/" + currDate);
    wastageRef.on("value", snapshot => {
      let wastage = { id: snapshot.key, text: snapshot.val() };
      let wastageqty = wastage.text;
      if (wastageqty !== null) {
        this.setState({ wastage: wastageqty });
      } else {
        let nullWastageRef = fire
          .database()
          .ref("ILEC/Pub/ClosingForm/Spirits/Wastage/00-00-00");
        nullWastageRef.on("value", snapshot => {
          let wastage = { id: snapshot.key, text: snapshot.val() };
          let wastageqty = wastage.text;
          this.setState({ wastage: wastageqty });
        });
      }
    });

    let ridRef = fire.database().ref("ILEC/Pub/ClosingForm/Spirits/rid");
    ridRef.on("value", snapshot => {
      let rid = { id: snapshot.key, text: snapshot.val() };
      let ridqty = rid.text;
      this.setState({ rid: ridqty });
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
      .ref("ILEC/Pub/ClosingForm/Spirits/Wastage/" + currDate)

      .set(value);
    this.cancelCourse();
  };
  cancelCourse = () => {
    document.getElementById("spwast").reset();
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
          <Wastage wastage={this.state.wastage} />
          <UpdateWastage rid={this.state.rid} change={this.handleChange} />
          <Submit submit={this.submitChange} />
        </div>
      </React.Fragment>
    );
  }
}
export default SpiritsWastage;
