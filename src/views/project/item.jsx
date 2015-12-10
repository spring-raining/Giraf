"use strict";

import React from "react";

import Actions              from "src/actions/actions";
import {Footage}            from "src/stores/model/footage";
import {Composition}        from "src/stores/model/composition";
import {cloneCanvas}        from "src/utils/renderUtils";


export default React.createClass({
  propTypes() {
    return {
      item: React.PropTypes.oneOfType([
        React.PropTypes.instanceOf(Footage),
        React.PropTypes.instanceOf(Composition),
      ]).isRequired,
      isSelected: React.PropTypes.boolean.isRequired,
      isEdited: React.PropTypes.boolean.ieRequired,
    }
  },

  getInitialState() {
    return {
      srcThumbnailCanvas: null,
    }
  },

  componentDidUpdate() {
    // insert thumbnail into DOM
    const canvas = this.props.item.getThumbnail();
    const dom = this.refs.thumbnailContainer;
    const flush = () => {
      while (dom.firstChild) {
        dom.removeChild(dom.firstChild);
      }
    };
    if (canvas) {
      if (!dom.firstChild
      ||  this.state.srcThumbnailCanvas !== canvas) {
        cloneCanvas(canvas).then(
          (newCanvas) => {
            flush();
            dom.appendChild(newCanvas);
            this.setState({
              srcThumbnailCanvas: canvas,
            });
          }
        );
      }
    } else {
      flush();
    }
  },

  render() {
    let className = "project__item";
    let description = null;

    if (this.props.item instanceof Footage) {
      className += `
        footage
        ${this.props.item.status.toLowerCase()}
        ${this.props.item.getFootageKind().toLowerCase()}
        ${this.props.item.type}
        ${this.props.isSelected? "selected" : ""}
      `.replace("\s+", " ");

      description = (
        <div className="project__item__description">
          <div style={{flexBasis: "100px"}}>
            {this.props.item.width} x {this.props.item.height}
          </div>
          <div style={{flexBasis: "80px"}}>
            {this.props.item.type}
          </div>
          <div style={{flexGrow: 1}}>
            {this.props.item.getFormattedLength()}
          </div>
        </div>
      );
    }
    else if (this.props.item instanceof Composition) {
      className += `
        composition
        ${this.props.isSelected? "selected" : ""}
        ${this.props.isEdited?   "edited" : ""}
      `.replace("\s+", " ");

      description = (
        <div className="project__item__description">
          <div style={{flexBasis: "100px"}}>
            {this.props.item.width} x {this.props.item.height}
          </div>
          <div style={{flexBasis: "80px"}}>
            {this.props.item.frame} frame
          </div>
          <div style={{flexBasis: "60px"}}>
            {this.props.item.fps} fps
          </div>
        </div>
      );
    }

    return (
      <li className={className} draggable="true"
          onClick={this._onClick}
          onDoubleClick={this._onDoubleClick}
          onDragStart={this._onDragStart}
          onDragEnd={this._onDragEnd}>
        <div className="project__item__thumbnail-container"
             ref="thumbnailContainer">
        </div>
        <div className="project__item__text">
          <span className="project__item__title">{this.props.item.name}</span>
          {description}
        </div>
      </li>
    );
  },

  _onClick() {
    Actions.changeSelectingItem(this.props.item);
  },

  _onDoubleClick() {
    if (this.props.item instanceof Composition) {
      Actions.changeEditingComposition(this.props.item);
    }
    else {
      Actions.changeEditingComposition(null);
    }
  },

  _onDragStart(e) {
    e.stopPropagation();
    e.dataTransfer.setData("text", this.props.item.name);
    Actions.startDrag(this.props.item);
  },

  _onDragEnd() {
    Actions.endDrag();
  },
});
