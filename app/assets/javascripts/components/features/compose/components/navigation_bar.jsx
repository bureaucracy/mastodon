import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';
import IconButton from '../../../components/icon_button';
import DisplayName from '../../../components/display_name';
import Permalink from '../../../components/permalink';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

const NavigationBar = React.createClass({
  propTypes: {
    account: ImmutablePropTypes.map.isRequired
  },

  mixins: [PureRenderMixin],

  render () {
    return (
      <div className='navigation-bar'>
        <div style={{ flex: '1 1 auto', marginLeft: '8px' }}>
          <Permalink href={this.props.account.get('url')} to={`/accounts/${this.props.account.get('id')}`} style={{ textDecoration: 'none' }}>
          <strong style={{ fontWeight: '500', display: 'block' }}>{this.props.account.get('acct')}</strong></Permalink>
          <a href='/settings/profile' style={{ color: 'inherit', textDecoration: 'none' }}><FormattedMessage id='navigation_bar.edit_profile' defaultMessage='Edit profile' /></a>
        </div>
      </div>
    );
  }

});

export default NavigationBar;
