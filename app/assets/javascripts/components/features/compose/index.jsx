import ComposeFormContainer from './containers/compose_form_container';
import UploadFormContainer from './containers/upload_form_container';
import NavigationContainer from './containers/navigation_container';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { mountCompose, unmountCompose } from '../../actions/compose';
import { Link } from 'react-router';
import { injectIntl, defineMessages } from 'react-intl';
import SearchContainer from './containers/search_container';
import { Motion, spring } from 'react-motion';
import SearchResultsContainer from './containers/search_results_container';

const messages = defineMessages({
  start: { id: 'getting_started.heading', defaultMessage: 'Getting started' },
  public: { id: 'navigation_bar.public_timeline', defaultMessage: 'Whole Known Network' },
  community: { id: 'navigation_bar.community_timeline', defaultMessage: 'Local timeline' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' }
});

const mapStateToProps = state => ({
  showSearch: state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden'])
});

const Compose = React.createClass({

  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    withHeader: React.PropTypes.bool,
    showSearch: React.PropTypes.bool,
    intl: React.PropTypes.object.isRequired
  },

  mixins: [PureRenderMixin],

  componentDidMount () {
    this.props.dispatch(mountCompose());
  },

  componentWillUnmount () {
    this.props.dispatch(unmountCompose());
  },

  render () {
    const { withHeader, showSearch, intl } = this.props;

    let header = '';

    if (withHeader) {

    }

    return (
      <div className='drawer'>
        {header}

        <SearchContainer />

        <div className='drawer__pager'>
          <div className='drawer__inner'>
            <NavigationContainer />
            <ComposeFormContainer />
          </div>

          <Motion defaultStyle={{ x: -100 }} style={{ x: spring(showSearch ? 0 : -100, { stiffness: 210, damping: 20 }) }}>
            {({ x }) =>
              <div className='drawer__inner darker' style={{ transform: `translateX(${x}%)`, visibility: x === -100 ? 'hidden' : 'visible' }}>
                <SearchResultsContainer />
              </div>
            }
          </Motion>
        </div>
      </div>
    );
  }

});

export default connect(mapStateToProps)(injectIntl(Compose));
