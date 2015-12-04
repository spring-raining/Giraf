"use strict";

import React                          from "react";


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

var Scroll = React.createClass({
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
    };
  },

  getContentDOM() {
    return this.refs.content;
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
      ? <div className="scroll__bar-x"></div>
      : null;
    const scrollBarY = (showScrollBarY)
      ? <div className="scroll__bar-y"></div>
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
               }}>
            {this.props.children}
          </div>
        </div>
        {scrollBarX}
        {scrollBarY}
      </div>
    );
  },
});

export default Scroll;
