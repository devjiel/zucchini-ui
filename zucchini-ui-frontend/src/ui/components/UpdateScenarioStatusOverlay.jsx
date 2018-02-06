import PropTypes from 'prop-types';
import React from 'react';
import Button from '../../ui/components/Button';
import Overlay from 'react-bootstrap/lib/Overlay';
import Popover from 'react-bootstrap/lib/Popover';
import UpdateScenarioStateDialog from '../../scenario/components/UpdateScenarioStateDialog';

export default class UpdateScenarioStatusOverlay extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      show: false,
      showUpdateStateDialog: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.show !== nextProps.show 
        && this.state.show !== nextProps.show) {
      this.setState({show : nextProps.show});
    }
  }

  onUpdateScenario = ({scenarioId, newState, comment}) => {
    this.props.onUpdateScenario({
      scenarioId,
      newState,
      comment,
    });
  }

  showPopUp = () => {
    this.setState({ show: true });   
  }

  hidePopUp = () => {
    this.setState({ show: false });  
  }

  onUpdateStateClick = () => {
    this.hidePopUp();
    this.showUpdateStateDialog();
  };

  showUpdateStateDialog = () => {
    this.setState({
      showUpdateStateDialog: true,
    });
  }

  hideUpdateStateDialog = () => {
    this.setState({
      showUpdateStateDialog: false,
    });
  }

  render() {
    const { placement, target, scenario } = this.props;

    return (
      <React.Fragment>
        <Overlay
          show={this.state.show}
          target={target}
          placement={placement}>
          <Popover id="popover-trigger-hover-focus" onMouseOver={this.showPopUp} onMouseOut={this.hidePopUp}>
            <Button glyph="flag" onClick={this.onUpdateStateClick}>
              Modifier le statut&hellip;
            </Button>
          </Popover>
        </Overlay>
        <UpdateScenarioStateDialog
          scenario={scenario}
          show={this.state.showUpdateStateDialog}
          onClose={this.hideUpdateStateDialog}
          onUpdateState={this.onUpdateScenario} />
      </React.Fragment>
    );
  }

}

UpdateScenarioStatusOverlay.propTypes = {
  show: PropTypes.bool.isRequired,
  placement: PropTypes.string.isRequired,
  target: PropTypes.object.isRequired,
  scenario: PropTypes.object.isRequired,
  onUpdateScenario: PropTypes.func.isRequired,
};