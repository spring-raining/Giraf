"use strict";

import React                          from "react";
import ReactCSSTransitionGroup        from "react-addons-css-transition-group";
import Actions                        from "src/actions/actions";


const APPEARING_TIME = 5000;

class Timer {
  constructor(callback) {
    this.alive = true;
    this.promise = new Promise(() => {
      setTimeout(() => {
        if (this.alive) {
          callback();
        }
      }, APPEARING_TIME);
    });
  }

  abort() {
    this.alive = false;
  }
}

const AlertPopup = React.createClass({
  propTypes() {
    return {
      key: React.PropTypes.string.isRequired,
      onDeleteButtonClick: React.PropTypes.func.isRequired,
    };
  },

  render() {
    return (
      <div className="alert__popup">
        <div className="alert__popup__content">
          {this.props.children}
        </div>
        <button className="alert__popup__delete-button flat sub"
                onClick={this._onDeleteButtonClick}>
          ×
        </button>
      </div>
    );
  },

  _onDeleteButtonClick() {
    this.props.onDeleteButtonClick(this.props.key);
  },
});

const Alert = React.createClass({
  propTypes() {
    return {
      alerts: React.PropTypes.arrayOf(React.PropTypes.node),
    };
  },

  getInitialState() {
    return {
      popups: [],
      popupDeleteTimers: [],
    };
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.alerts.length > prevProps.alerts.length) {
      const newAlerts = this.props.alerts.slice(prevProps.alerts.length);
      const newPopups = newAlerts.map((alert) =>
        <AlertPopup key={alert.id}
                    onDeleteButtonClick={this._onDeleteButtonClick(alert.id)}>
          {alert.content}
        </AlertPopup>
      );
      const newTimers = newAlerts.filter((alert) => alert.autoDelete)
        .map((alert) =>
          new Timer(this._onAutoDelete(alert.id))
        );

      this.setState({
        popups: this.state.popups.concat(newPopups),
        popupDeleteTimers: this.state.popupDeleteTimers.concat(newTimers),
      });
    }

    if (this.props.alerts.length < prevProps.alerts.length) {
      const alertIDs = this.props.alerts.map((e) => e.id);
      const popups = this.state.popups.filter((e) => alertIDs.indexOf(e.key) >= 0);
      this.setState({
        popups: popups,
      });
    }
  },

  render() {
    const popups = [].concat(this.state.popups).reverse();

    return (
      <div className="alert"
           onMouseEnter={this._onMouseEnter}
           onMouseLeave={this._onMouseLeave}>
        <ReactCSSTransitionGroup transitionName="alert-transition"
                                 transitionEnterTimeout={200}
                                 transitionLeaveTimeout={200}>
          {popups}
        </ReactCSSTransitionGroup>
      </div>
    );
  },

  _onDeleteButtonClick(id) {
    return this._onAutoDelete(id);
  },

  _onAutoDelete(id) {
    return () => {
      const alert = this.props.alerts.filter((e) => e.id === id)[0];
      if (alert) {
        Actions.deleteAlert(alert);
      }
    };
  },

  _onMouseEnter() {
    this.state.popupDeleteTimers.forEach((e) => {
      e.abort();
    });
  },

  _onMouseLeave() {
    this.state.popupDeleteTimers.forEach((e) => {
      e.abort();
    });

    const newTimers = this.props.alerts.filter((alert) => alert.autoDelete)
      .map((alert) =>
        new Timer(this._onAutoDelete(alert.id))
      );
    this.setState({
      popupDeleteTimers: newTimers,
    });
  },
});

export default Alert;
