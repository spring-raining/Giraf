"use strict";

import React                      from "react";

import Actions                    from "src/actions/actions";
import {Footage as ModelFootage}  from "src/stores/model/footage";
import {Composition as ModelComp} from "src/stores/model/composition";
import {Layer as ModelLayer}      from "src/stores/model/layer";


export default React.createClass({
  propTypes() {
    return {
      composition: React.PropTypes.instanceOf(ModelComp).isRequired,
      layer: React.PropTypes.instanceOf(ModelLayer).isRequired,
      onClick: React.PropTypes.func.isRequired,
      onDragStart: React.PropTypes.func.isRequired,
      onDragEnter: React.PropTypes.func.isRequired,
      onDragEnd: React.PropTypes.func.isRequired,
      isEdited: React.PropTypes.boolean.isReacted,
    };
  },

  render() {
    const layer = this.props.layer;
    let className = "timeline__layer-header"
                  + (this.props.isEdited? " edited" : "");

    if (layer.entity instanceof ModelFootage) {
      className += " footage"
        + ` ${layer.entity.status.toLowerCase()}`
        + ` ${layer.entity.getFootageKind().toLowerCase()}`;
    }
    else if (layer.entity instanceof ModelComp) {
      className += " composition";
    }

    let visibleButton = (layer.visible)
      ? <button className="timeline__layer-header__visible-button lsf on"
                onClick={this._onCheckboxButtonClick("visible")(true)}>
          eye
        </button>
      : <button className="timeline__layer-header__visible-button lsf"
                onClick={this._onCheckboxButtonClick("visible")(false)}>
          eye
        </button>;
    let soloButton = (layer.solo)
      ? <button className="timeline__layer-header__solo-button on"
                onClick={this._onCheckboxButtonClick("solo")(true)}>
          ●
        </button>
      : <button className="timeline__layer-header__solo-button"
                onClick={this._onCheckboxButtonClick("solo")(false)}>
          ●
        </button>;

    return (
      <div className={className} draggable="true"
           onClick={this._onClick}
           onDragStart={this._onDragStart}
           onDragEnter={this._onDragEnter}
           onDragEnd={this._onDragEnd}>
        <span className="timeline__layer-header__name">{layer.name}</span>
        <div className="timeline__layer-header__buttons">
          {visibleButton}
          {soloButton}
        </div>
      </div>
    );
  },

  _onClick(e) {
    this.props.onClick(this.props.layer)(e);
  },

  _onDragStart(e) {
    e.stopPropagation();
    this.props.onDragStart(this.props.layer, this)(e);
  },

  _onDragEnter(e) {
    e.stopPropagation();
    this.props.onDragEnter(this.props.layer, this)(e);
  },

  _onDragEnd(e) {
    e.stopPropagation();
    this.props.onDragEnd(this.props.layer, this)(e);
  },

  _onCheckboxButtonClick(target) {
    return (status) => (e) => {
      if (target === "visible" && status) {
        this.props.layer.update({
          visible: false,
          solo: false,
        });
      }
      else if (target === "visible" && !status) {
        this.props.layer.update({
          visible: true,
        });
      }
      else if (target === "solo" && status) {
        this.props.layer.update({
          solo: false,
        });
      }
      else if (target === "solo" && !status) {
        this.props.layer.update({
          visible:true,
          solo: true,
        });
      }
    };
  }
});
