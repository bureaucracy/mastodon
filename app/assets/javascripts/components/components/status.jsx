import ImmutablePropTypes from 'react-immutable-proptypes';
import RelativeTimestamp from './relative_timestamp';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DisplayName from './display_name';
import MediaGallery from './media_gallery';
import VideoPlayer from './video_player';
import StatusContent from './status_content';
import StatusActionBar from './status_action_bar';
import { FormattedMessage } from 'react-intl';
import emojify from '../emoji';
import escapeTextContentForBrowser from 'escape-html';

const Status = React.createClass({

  contextTypes: {
    router: React.PropTypes.object
  },

  propTypes: {
    status: ImmutablePropTypes.map,
    wrapped: React.PropTypes.bool,
    onReply: React.PropTypes.func,
    onFavourite: React.PropTypes.func,
    onReblog: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    onOpenMedia: React.PropTypes.func,
    onBlock: React.PropTypes.func,
    me: React.PropTypes.number,
    muted: React.PropTypes.bool
  },

  mixins: [PureRenderMixin],

  handleClick () {
    const { status } = this.props;
    this.context.router.push(`/statuses/${status.getIn(['reblog', 'id'], status.get('id'))}`);
  },

  handleAccountClick (id, e) {
    if (e.button === 0) {
      e.preventDefault();
      this.context.router.push(`/accounts/${id}`);
    }
  },

  render () {
    let media = '';
    const { status, ...other } = this.props;

    if (status === null) {
      return <div />;
    }

    if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
      let displayName = status.getIn(['account', 'display_name']);

      if (displayName.length === 0) {
        displayName = status.getIn(['account', 'username']);
      }

      const displayNameHTML = { __html: emojify(escapeTextContentForBrowser(displayName)) };

      return (
        <div style={{ cursor: 'default' }}>
          <div className='status__prepend'>
            <div style={{ position: 'absolute', 'left': '-26px'}}><i className='fa fa-fw fa-retweet' /></div>
            <FormattedMessage id='status.reblogged_by' defaultMessage='{name} reblogged' values={{ name: <a onClick={this.handleAccountClick.bind(this, status.getIn(['account', 'id']))} href={status.getIn(['account', 'url'])} className='status__display-name muted'><strong dangerouslySetInnerHTML={displayNameHTML} /></a> }} />
          </div>

          <Status {...other} wrapped={true} status={status.get('reblog')} />
        </div>
      );
    }

    return (
      <div className={this.props.muted ? 'status muted' : 'status'}>
        <div style={{ fontSize: '15px' }}>
          <div style={{ float: 'right', fontSize: '14px' }}>
            <a href={status.get('url')} className='status__relative-time' target='_blank' rel='noopener'><RelativeTimestamp timestamp={status.get('created_at')} /></a>
          </div>

          <a onClick={this.handleAccountClick.bind(this, status.getIn(['account', 'id']))} href={status.getIn(['account', 'url'])} className='status__display-name' style={{ display: 'block', maxWidth: '100%', paddingRight: '25px' }}>
            <DisplayName account={status.get('account')} />
          </a>
        </div>

        <StatusContent status={status} onClick={this.handleClick} />

        {media}

        <StatusActionBar {...this.props} />
      </div>
    );
  }

});

export default Status;
