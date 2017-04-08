import DisplayName from '../../../components/display_name';
import ImmutablePropTypes from 'react-immutable-proptypes';

const AutosuggestAccount = ({ account }) => (
  <div style={{ overflow: 'hidden' }} className='autosuggest-account'>
    <div style={{ float: 'left', marginRight: '5px' }}>
      <DisplayName account={account} />
    </div>
  </div>
);

AutosuggestAccount.propTypes = {
  account: ImmutablePropTypes.map.isRequired
};

export default AutosuggestAccount;
