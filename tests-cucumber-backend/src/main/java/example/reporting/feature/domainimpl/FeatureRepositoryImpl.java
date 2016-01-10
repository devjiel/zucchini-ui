package example.reporting.feature.domainimpl;

import example.reporting.feature.domain.Feature;
import example.reporting.feature.domain.FeatureQuery;
import example.reporting.feature.domain.FeatureRepository;
import example.support.morphiaddd.MorphiaRepository;
import org.mongodb.morphia.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
class FeatureRepositoryImpl extends MorphiaRepository<Feature, String> implements FeatureRepository {

    private final FeatureDAO dao;

    @Autowired
    public FeatureRepositoryImpl(FeatureDAO dao) {
        super(dao);
        this.dao = dao;
    }

    @Override
    public FeatureQuery query() {
        return dao.createTypedQuery();
    }

    @Override
    public void deleteByTestRunId(String testRunId) {
        final Query<Feature> query = dao.prepareTypedQuery(q -> q.withTestRunId(testRunId));
        dao.deleteByQuery(query);
    }

}