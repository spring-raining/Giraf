"use strict";

import React                          from "react";
import ReactDOM                       from "react-dom";
import _Lang                          from "lodash/lang";


/*
 *  Inspired: http://www.alexandre-gomes.com/?p=115
 */
function getNativeScrollBarWidth () {
  var inner = document.createElement('p');
  inner.style.width = "100%";
  inner.style.height = "200px";

  var outer = document.createElement('div');
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild (inner);

  document.body.appendChild (outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;

  document.body.removeChild (outer);

  return (w1 - w2);
}


const ScrollBar = React.createClass({
  propTypes() {
    return {
      axis: React.PropTypes.oneOf(["x", "y"]).isRequired,
      entireRange: React.PropTypes.number.isRequired,
      displayRange: React.PropTypes.number.isRequired,
      position: React.PropTypes.number.isRequired,
    };
  },

  render() {
    const className = "scroll__bar"
      + (this.props.axis === "x"? " scroll__bar-x" : "")
      + (this.props.axis === "y"? " scroll__bar-y" : "");

    const sliderRange = `${this.props.displayRange / this.props.entireRange * 100}%`;
    const sliderPosition = (this.props.position > 0)
      ? `${this.props.position / this.props.entireRange * 100}%`
      : "0";

    const sliderStyle =
      (this.props.axis === "x") ? {
        width: sliderRange,
        left: sliderPosition,
      } : (this.props.axis === "y") ? {
        height: sliderRange,
        top: sliderPosition,
      } : null;

    return (
      <div className={className}>
        <div className="scroll__bar__slider"
             style={sliderStyle}>
        </div>
      </div>
    );
  },
});


const Scroll = React.createClass({
  propTypes() {
    return {
      scrollX: React.PropTypes.bool,
      scrollY: React.PropTypes.bool,
      hideScrollBar: React.PropTypes.bool,
    };
  },

  getInitialState() {
    return {
      nativeBarWidth: getNativeScrollBarWidth(),
      contentWidth: 0,
      contentHeight: 0,
      boxWidth: 0,
      boxHeight: 0,
      scrollLeft: 0,
      scrollTop: 0,
    };
  },

  componentDidMount() {
    this.contentDOM = ReactDOM.findDOMNode(this.refs.content);
    this.contentDOMObserver = new MutationObserver(() => {
      this.updateScrollStatus();
    });
    this.contentDOMObserver.observe(this.contentDOM,
      {attributes: true, childList: true, characterData: true, subtree: true});

    this.updateScrollStatus();
  },

  componentWillUnmount() {
    this.contentDOMObserver.disconnect();
  },

  render() {
    const showScrollBarX = (this.props.scrollX
                         && !this.props.hideScrollBar);
    const showScrollBarY = (this.props.scrollY
                         && !this.props.hideScrollBar);

    const contentAreaClassName = "scroll__content-area"
      + (showScrollBarX? " scroll-x" : "")
      + (showScrollBarY? " scroll-y" : "");

    const bottom = (this.props.scrollX
                 && this.state.nativeBarWidth > 0)
      ? `-${this.state.nativeBarWidth}px`
      : "0";
    const right = (this.props.scrollY
                && this.state.nativeBarWidth > 0)
      ? `-${this.state.nativeBarWidth}px`
      : "0";
    const scrollBarX = (showScrollBarX)
      ? <ScrollBar axis="x"
                   entireRange={this.state.contentWidth}
                   displayRange={this.state.boxWidth}
                   position={this.state.scrollLeft} />
      : null;
    const scrollBarY = (showScrollBarY)
      ? <ScrollBar axis="y"
                   entireRange={this.state.contentHeight}
                   displayRange={this.state.boxHeight}
                   position={this.state.scrollTop} />
      : null;

    return (
      <div className="scroll__box">
        <div className={contentAreaClassName}>
          <div {...this.props}
               ref="content"
               style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  bottom: bottom,
                  right: right,
                  overflowX: (this.props.scrollX)? "scroll" : "hidden",
                  overflowY: (this.props.scrollY)? "scroll" : "hidden",
               }}
               onWheel={this._onWheel}>
            {this.props.children}
          </div>
        </div>
        {scrollBarX}
        {scrollBarY}
      </div>
    );
  },

  getContentDOM() {
    return this.contentDOM;
  },

  updateScrollStatus() {
    this.setState({
      contentWidth: this.contentDOM.scrollWidth,
      contentHeight: this.contentDOM.scrollHeight,
      boxWidth: this.contentDOM.clientWidth,
      boxHeight: this.contentDOM.clientHeight,
      scrollLeft: this.contentDOM.scrollLeft,
      scrollTop: this.contentDOM.scrollTop,
    });
  },

  _onWheel(e) {
    this.updateScrollStatus();
    if (_Lang.isFunction(this.props.onWheel)) {
      this.props.onWheel(e);
    }
  },
});

export default Scroll;
