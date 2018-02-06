import PropTypes from 'prop-types';
import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import Label from 'react-bootstrap/lib/Label';
import { Link } from 'react-router'
import Status from '../../ui/components/Status';
import UpdateScenarioStatusOverlay from './UpdateScenarioStatusOverlay';

export default class ScenarioTable extends React.PureComponent {

  onUpdateScenario = ({scenarioId, newState, comment}) => {
    this.props.onUpdateScenario({
      scenarioId,
      newState,
      comment,
    });
  };

  render() {
    const { scenarios, selectedScenarioId, isUpdateScenarioActive } = this.props;

    const rows = scenarios.map(scenario => {
      const isActive = (scenario.id === selectedScenarioId);
      return (
        <ScenarioTableRow key={scenario.id} scenario={scenario} isActive={isActive} isUpdateScenarioActive={isUpdateScenarioActive} onUpdateScenario={this.onUpdateScenario} />
      )
    });

    return (
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
    );
  }
}

ScenarioTable.propTypes = {
  scenarios: PropTypes.arrayOf(PropTypes.object),
  selectedScenarioId: PropTypes.string,
  isUpdateScenarioActive: PropTypes.bool,
  onUpdateScenario: PropTypes.func,
};


class ScenarioTableRow extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      showUpdateStatusOverlay: false,
    };
  }

  onUpdateScenario = ({scenarioId, newState, comment}) => {
    this.props.onUpdateScenario({
      scenarioId,
      newState,
      comment,
    });
  };

  showPopUp = () => {
    this.setState({ showUpdateStatusOverlay: true });   
  }

  hidePopUp = () => {
    this.setState({ showUpdateStatusOverlay: false });  
  }

  render() {
    const { scenario, isActive, isUpdateScenarioActive } = this.props;
    const className = isActive ? 'info' : null;

    const reviewedProps = {
      bsStyle: scenario.reviewed ? 'success' : 'default',
      text: scenario.reviewed ? 'Oui' : 'Non',
    };

    return (
      <tr className={className}>
        <td onMouseOver={this.showPopUp} onMouseOut={this.hidePopUp}>
          <Link to={{ pathname: `/scenarios/${scenario.id}` }}>
            <b>{scenario.info.keyword}</b> {scenario.info.name}
          </Link>
        </td>
        <td onMouseOver={this.showPopUp} onMouseOut={this.hidePopUp}>
          <Status status={scenario.status} />
        </td>
        <td onMouseOver={this.showPopUp} onMouseOut={this.hidePopUp}>
          <Label bsStyle={reviewedProps.bsStyle}>{reviewedProps.text}</Label>
        </td>
        <UpdateScenarioStatusOverlay 
          show={this.state.showUpdateStatusOverlay && isUpdateScenarioActive} 
          placement="right"
          target={this} 
          scenario={scenario} 
          onUpdateScenario={this.onUpdateScenario} />
      </tr>
    );
  }

}

ScenarioTableRow.propTypes = {
  scenario: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  isUpdateScenarioActive: PropTypes.bool,
  onUpdateScenario: PropTypes.func.isRequired,
};
