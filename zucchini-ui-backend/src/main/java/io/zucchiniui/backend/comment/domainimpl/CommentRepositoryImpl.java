package io.zucchiniui.backend.comment.domainimpl;

import io.zucchiniui.backend.comment.dao.CommentDAO;
import io.zucchiniui.backend.comment.domain.Comment;
import io.zucchiniui.backend.comment.domain.CommentQuery;
import io.zucchiniui.backend.comment.domain.CommentRepository;
import io.zucchiniui.backend.support.ddd.morphia.MorphiaQueriableRepository;

import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
class CommentRepositoryImpl extends MorphiaQueriableRepository<Comment, String, CommentQuery> implements CommentRepository {

    @Inject
    public CommentRepositoryImpl(final CommentDAO dao) {
        super(dao);
    }

}
