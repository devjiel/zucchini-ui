package io.zucchiniui.backend.testrun.dao;

import io.zucchiniui.backend.support.ddd.morphia.MorphiaTypedQueryDAO;
import io.zucchiniui.backend.testrun.domain.TestRun;
import io.zucchiniui.backend.testrun.domain.TestRunQuery;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.query.Query;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.function.Consumer;

@Singleton
public class TestRunDAO extends MorphiaTypedQueryDAO<TestRun, String, TestRunQuery> {

    @Inject
    public TestRunDAO(final Datastore ds) {
        super(ds);
    }

    @Override
    public Query<TestRun> prepareTypedQuery(final Consumer<? super TestRunQuery> preparator) {
        final TestRunQueryImpl typedQuery = new TestRunQueryImpl(createQuery());
        preparator.accept(typedQuery);
        return typedQuery.morphiaQuery();
    }

}
