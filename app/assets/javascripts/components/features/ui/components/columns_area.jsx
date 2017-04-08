import PureRenderMixin from 'react-addons-pure-render-mixin';

const ColumnsArea = React.createClass({

  propTypes: {
    children: React.PropTypes.node
  },

  mixins: [PureRenderMixin],

  render () {
    return (
      <div className='columns-area'>
        {this.props.children}
      </div>
    );
  }

});

export default ColumnsArea;
