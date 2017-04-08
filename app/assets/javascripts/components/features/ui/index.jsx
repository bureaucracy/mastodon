import ColumnsArea from './components/columns_area';
import NotificationsContainer from './containers/notifications_container';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import LoadingBarContainer from './containers/loading_bar_container';
import HomeTimeline from '../home_timeline';
import Compose from '../compose';
import TabsBar from './components/tabs_bar';
import ModalContainer from './containers/modal_container';
import Notifications from '../notifications';
import { connect } from 'react-redux';
import { isMobile } from '../../is_mobile';
import { debounce } from 'react-decoration';
import { refreshTimeline } from '../../actions/timelines';
import { refreshNotifications } from '../../actions/notifications';

const UI = React.createClass({

  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    children: React.PropTypes.node
  },

  getInitialState () {
    return {
      draggingOver: false
    };
  },

  mixins: [PureRenderMixin],


  handleDragEnter (e) {
    e.preventDefault();

    if (!this.dragTargets) {
      this.dragTargets = [];
    }

    if (this.dragTargets.indexOf(e.target) === -1) {
      this.dragTargets.push(e.target);
    }

    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      this.setState({ draggingOver: true });
    }
  },


  componentWillMount () {
    this.props.dispatch(refreshTimeline('home'));
    this.props.dispatch(refreshNotifications());
  },

  setRef (c) {
    this.node = c;
  },

  render () {
    const { children } = this.props;

    let mountedColumns;

    mountedColumns = (
      <ColumnsArea>
        {children}
      </ColumnsArea>
    );

    return (
      <div className='ui' ref={this.setRef}>
        <TabsBar />

        {mountedColumns}

        <NotificationsContainer />
        <LoadingBarContainer style={{ backgroundColor: '#2b90d9', left: '0', top: '0' }} />
        <ModalContainer />
      </div>
    );
  }

});

export default connect()(UI);
