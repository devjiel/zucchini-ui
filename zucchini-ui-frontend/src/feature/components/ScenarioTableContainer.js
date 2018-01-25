import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

import { selectScenarioFilterFunc } from '../../filters/selectors';
import ScenarioTable from '../../ui/components/ScenarioTable';
import { updateScenarioStateAndCommentFromFeature } from '../../feature/redux';


const selectScenarios = createSelector(
  state => state.feature.scenarios,
  selectScenarioFilterFunc,
  (scenarios, scenarioFilterFunc) => {
    return scenarios.filter(scenarioFilterFunc);
  },
);

const selectProps = createStructuredSelector({
  scenarios: selectScenarios,
});


export default connect(
  selectProps,
  {
    onUpdateScenario: updateScenarioStateAndCommentFromFeature,
  },
)(ScenarioTable);
