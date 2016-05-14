"use strict";

import React                                    from "react";
import {FormattedMessage}                       from 'react-intl';

import Actions                                  from "src/actions/actions";
import Store                                    from "src/stores/store";
import {Composition}                            from "src/stores/model/composition";
import Menu                                     from "src/views/menu";
import genUUID                                  from "src/utils/genUUID";


export default React.createClass({

  menuContent: (composition) => [
    {
      name: <FormattedMessage id="views.timeline.summary.create_gif"
                              defaultMessage="Create GIF" />,
      onClick: () => {
        Actions.updateExpandingMenuId(null);
        Actions.renderGIF(composition);
      },
    },
  ],

  menuId: genUUID(),

  propTypes() {
    return {
      composition: React.PropTypes.instanceOf(Composition).isRequired,
      currentFrame: React.PropTypes.number.isRequired,
      onClick: React.PropTypes.func,
    }
  },

  render() {
    const comp = this.props.composition;
    const expandingMenuId = Store.get("expandingMenuId");

    return <div className="timeline__summary"
                onClick={this._onClick}>
      <div className="timeline__summary__info">
        <span className="timeline__summary__badge">{this.props.currentFrame + 1}</span>
        <span>f</span>
        <span className="timeline__summary__badge">{comp.fps}</span>
        <span>fps</span>
      </div>
      <div className="timeline__summary__menu">
        <button className="lsf-icon"
                title="etc"
                onClick={this._onMenuButtonClick}>
        </button>
        <Menu content={this.menuContent(comp)}
              expand={expandingMenuId === this.menuId} />
      </div>
    </div>;
  },

  _onClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  },

  _onMenuButtonClick(e) {
    e.stopPropagation();
    const expandingMenuId = Store.get("expandingMenuId");
    Actions.updateExpandingMenuId(
      (expandingMenuId === this.menuId)? null : this.menuId
    );
  },
});
