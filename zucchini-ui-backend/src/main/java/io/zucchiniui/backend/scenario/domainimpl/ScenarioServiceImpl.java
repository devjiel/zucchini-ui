package io.zucchiniui.backend.scenario.domainimpl;

import io.zucchiniui.backend.feature.domain.FeatureService;
import io.zucchiniui.backend.scenario.domain.Scenario;
import io.zucchiniui.backend.scenario.domain.ScenarioRepository;
import io.zucchiniui.backend.scenario.domain.ScenarioService;
import io.zucchiniui.backend.scenario.domain.ScenarioStatus;
import io.zucchiniui.backend.scenario.domain.UpdateScenarioParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
class ScenarioServiceImpl implements ScenarioService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ScenarioServiceImpl.class);

    private final ScenarioRepository scenarioRepository;

    private final FeatureService featureService;

    @Inject
    public ScenarioServiceImpl(
        final ScenarioRepository scenarioRepository,
        final FeatureService featureService
    ) {
        this.scenarioRepository = scenarioRepository;
        this.featureService = featureService;
    }

    @Override
    public void updateScenario(final String scenarioId, final UpdateScenarioParams params) {
        final Scenario scenario = scenarioRepository.getById(scenarioId);
        params.getStatus().ifPresent(scenario::setStatus);
        params.isReviewed().ifPresent(scenario::setReviewed);
        scenarioRepository.save(scenario);

        if (params.getStatus().isPresent()) {
            featureService.updateStatusFromScenarii(scenario.getFeatureId());
        }
    }

    @Override
    public void deleteById(final String scenarioId) {
        final Scenario scenario = scenarioRepository.getById(scenarioId);
        scenarioRepository.delete(scenario);

        featureService.updateStatusFromScenarii(scenario.getFeatureId());
    }

    @Override
    public Scenario tryToMergeWithExistingScenario(final Scenario newScenario, boolean mergeOnlyNewPassedScenarii) {
        return scenarioRepository.query(q -> q.withFeatureId(newScenario.getFeatureId()).withScenarioKey(newScenario.getScenarioKey()))
            .tryToFindOne()
            .map(existingScenario -> {
                LOGGER.info("Merging new scenario {} with existing feature {}, merge only passed is {}", newScenario, existingScenario, mergeOnlyNewPassedScenarii);
                if (!mergeOnlyNewPassedScenarii || isNewPassedScenarii(existingScenario, newScenario)) {
                    existingScenario.mergeWith(newScenario);
                }
                return existingScenario;
            })
            .orElse(newScenario);
    }

    /**
     * Define if the new scenarii is passed and the existing is not passed.
     * @param existingScenario
     * @param newScenario
     * @return true if the new scenarii is passed and the existing is not passed.
     */
    private boolean isNewPassedScenarii(Scenario existingScenario, Scenario newScenario) {
        return newScenario.getStatus() == ScenarioStatus.PASSED && existingScenario.getStatus() != ScenarioStatus.PASSED;
    }

}
