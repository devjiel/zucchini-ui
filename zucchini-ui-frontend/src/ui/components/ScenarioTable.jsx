import PropTypes from 'prop-types';
import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import Label from 'react-bootstrap/lib/Label';
import Button from '../../ui/components/Button';
import Overlay from 'react-bootstrap/lib/Overlay';
import Popover from 'react-bootstrap/lib/Popover';
import { Link } from 'react-router'
import Status from '../../ui/components/Status';
import UpdateScenarioStateDialog from '../../scenario/components/UpdateScenarioStateDialog';


export default class ScenarioTable extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      showUpdateStateDialog: false,
    };

  }

  onEditScenario = (activeScenario) => {
    this.setState({
      activeScenario,
    })
    this.showUpdateStateDialog();
  }

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

  onUpdateScenario = ({scenarioId, newState, comment}) => {
    console.info('onUpdateScenario:', {scenarioId, newState, comment})
    this.props.onUpdateScenario({
      scenarioId,
      newState,
      comment,
    });
  };

  render() {
    const { scenarios, selectedScenarioId } = this.props;
    const { activeScenario } = this.state;

    const rows = scenarios.map(scenario => {
      const isActive = (scenario.id === selectedScenarioId);
      return (
        <ScenarioTableRow key={scenario.id} scenario={scenario} isActive={isActive} onEditScenario={this.onEditScenario} />
      )
    });

    return (
      <div>
        <Table bordered striped hover>
          <thead>
            <tr>
              <th className="col-md-10">Scénario</th>
              <th className="col-md-1">Statut</th>
              <th className="col-md-1">Analysé</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        {activeScenario && <UpdateScenarioStateDialog
          scenario={activeScenario}
          show={this.state.showUpdateStateDialog}
          onClose={this.hideUpdateStateDialog}
          onUpdateState={this.onUpdateScenario} /> }
      </div>
    );
  }
}

ScenarioTable.propTypes = {
  scenarios: PropTypes.arrayOf(PropTypes.object),
  selectedScenarioId: PropTypes.string,
  onUpdateScenario: PropTypes.func.isRequired,
};


class ScenarioTableRow extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  showPopUp = () => {
    this.setState({ show: true });   
  }

  hidePopUp = () => {
    this.setState({ show: false });  
  }

  onUpdateStateClick = () => {
    this.props.onEditScenario(this.props.scenario);
  };

  render() {
    const { scenario, isActive } = this.props;
    const className = isActive ? 'info' : null;

    const reviewedProps = {
      bsStyle: scenario.reviewed ? 'success' : 'default',
      text: scenario.reviewed ? 'Oui' : 'Non',
    };

    return (
      <tr className={className} onMouseOver={this.showPopUp} onMouseOut={this.hidePopUp}>
        <td>
          <Link to={{ pathname: `/scenarios/${scenario.id}` }}>
            <b>{scenario.info.keyword}</b> {scenario.info.name}
          </Link>
        </td>
        <td >
          <Status status={scenario.status} />
        </td>
        <td>
          <Label bsStyle={reviewedProps.bsStyle}>{reviewedProps.text}</Label>
        </td>
        <Overlay
          show={this.state.show}
          target={this}
          placement="right">
          <Popover id="popover-trigger-hover-focus" onMouseOver={this.showPopUp} onMouseOut={this.hidePopUp}>
            <Button glyph="flag" onClick={this.onUpdateStateClick}>
              Modifier le statut&hellip;
            </Button>
          </Popover>
        </Overlay>
      </tr>
    );
  }

}

ScenarioTableRow.propTypes = {
  scenario: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  onEditScenario: PropTypes.func.isRequired,
};
