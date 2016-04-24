"use strict";

import React                          from "react";
import ReactDOM                       from "react-dom";
import UAParser                       from "ua-parser-js";
import _Lang                          from "lodash/lang";

import genDummyImg                    from "src/utils/genDummyImg";


const userAgent = new UAParser();

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
      axis:             React.PropTypes.oneOf(["x", "y"]).isRequired,
      entireRange:      React.PropTypes.number.isRequired,
      displayRange:     React.PropTypes.number.isRequired,
      position:         React.PropTypes.number.isRequired,
      onScrollBarMoved: React.PropTypes.func,
    };
  },

  getInitialState() {
    return {
      previousPosition: null,
    };
  },

  render() {
    const className = "scroll__bar"
      + (this.props.axis === "x"? " scroll__bar-x" : "")
      + (this.props.axis === "y"? " scroll__bar-y" : "");

    const percentage = (val) => (val > 0)? `${val * 100}%` : "0";
    const sliderRange = percentage(this.props.displayRange / this.props.entireRange);
    const sliderPosition = percentage(this.props.position / this.props.entireRange);
    const beforePosition = percentage(1 - this.props.position / this.props.entireRange);
    const afterPosition = percentage((this.props.position + this.props.displayRange) / this.props.entireRange);

    const sliderStyle =
      (this.props.axis === "x") ? {
        width: sliderRange,
        left: sliderPosition,
      } : (this.props.axis === "y") ? {
        height: sliderRange,
        top: sliderPosition,
      } : null;
    const beforeStyle =
      (this.props.axis === "x")? {right: beforePosition} :
      (this.props.axis === "y")? {bottom: beforePosition} :
      null;
    const afterStyle =
      (this.props.axis === "x")? {left: afterPosition} :
      (this.props.axis === "y")? {top: afterPosition} :
      null;

    return (
      <div className={className}>
        <div className="scroll__bar__before"
             style={beforeStyle}
             onClick={this._onGutterClick(-1)}>
        </div>
        <div className="scroll__bar__slider"
             style={sliderStyle}
             draggable="true"
             onDragStart={this._onDragStart}
             onDrag={this._onDrag}
             onDragEnd={this._onDragEnd}>
        </div>
        <div className="scroll__bar__after"
             style={afterStyle}
             onClick={this._onGutterClick(1)}>
        </div>
      </div>
    );
  },

  _onGutterClick(direction) {
    return (e) => {
      if (_Lang.isFunction(this.props.onScrollBarMoved)) {
        const result = Math.max(0,
                       Math.min(this.props.entireRange - this.props.displayRange,
                       this.props.position + this.props.displayRange * direction));
        this.props.onScrollBarMoved(result);
      }
    }
  },

  _onDragStart(e) {
    e.stopPropagation();

    // On Firefox, 'onDrag' and 'onDragEnd' won't fire.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=505521
    if (userAgent.getBrowser().name === "Firefox") {
      e.target.setCapture();
      e.target.addEventListener("mousemove", this._onDrag, false);
      e.target.addEventListener("mouseup", this._onDragEnd, false);
    }

    e.dataTransfer.setDragImage(genDummyImg(), 0, 0);
    const previousPosition =
      (this.props.axis === "x")? e.clientX :
      (this.props.axis === "y")? e.clientY :
      null;
    this.setState({
      previousPosition: previousPosition,
    });
  },

  _onDrag(e) {
    e.stopPropagation();
    // HACK: It sometimes fire event e.clientX && e.clientY is zero when mouse up.
    if (e.clientX === 0 || e.clientY === 0) {
      return;
    }

    const position =
      (this.props.axis === "x")? e.clientX :
      (this.props.axis === "y")? e.clientY :
      this.state.previousPosition;
    const diff = position - this.state.previousPosition;
    if (diff !== 0) {
      if (_Lang.isFunction(this.props.onScrollBarMoved)) {
        const dom = ReactDOM.findDOMNode(this);
        const rectRange = (this.props.axis === "x")? dom.offsetWidth : dom.offsetHeight;
        const result = Math.max(0,
                       Math.min(this.props.entireRange - this.props.displayRange,
                       this.props.position + this.props.entireRange * (diff / rectRange)));
        this.setState({
          previousPosition: position,
        });
        this.props.onScrollBarMoved(result);
      }
    }
  },

  _onDragEnd(e) {
    e.stopPropagation();

    if (userAgent.getBrowser().name === "Firefox") {
      this._dragEndOnFirefox = true;
      e.target.removeEventListener("mousemove", this._onDrag, false);
      e.target.removeEventListener("mouseup", this._onDragEnd, false);
    }

    this.setState({
      previousPosition: null,
    });
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
                   position={this.state.scrollLeft}
                   onScrollBarMoved={this._onScrollBarMoved("x")} />
      : null;
    const scrollBarY = (showScrollBarY)
      ? <ScrollBar axis="y"
                   entireRange={this.state.contentHeight}
                   displayRange={this.state.boxHeight}
                   position={this.state.scrollTop}
                   onScrollBarMoved={this._onScrollBarMoved("y")} />
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
               onScroll={this._onScroll}>
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

  _onScroll(e) {
    this.updateScrollStatus();
    if (_Lang.isFunction(this.props.onScroll)) {
      this.props.onScroll(e);
    }
  },

  _onScrollBarMoved(axis) {
    return (e) => {
      if (axis === "x") {
        this.contentDOM.scrollLeft = e;
      }
      else if (axis === "y") {
        this.contentDOM.scrollTop = e;
      }
    };
  },
});

export default Scroll;
