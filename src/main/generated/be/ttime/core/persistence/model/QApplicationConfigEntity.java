package be.ttime.core.persistence.model;

import com.mysema.query.types.Path;
import com.mysema.query.types.PathMetadata;
import com.mysema.query.types.path.BooleanPath;
import com.mysema.query.types.path.EntityPathBase;
import com.mysema.query.types.path.NumberPath;
import com.mysema.query.types.path.PathInits;

import javax.annotation.Generated;

import static com.mysema.query.types.PathMetadataFactory.forVariable;


/**
 * QApplicationConfigEntity is a Querydsl query type for ApplicationConfigEntity
 */
@Generated("com.mysema.query.codegen.EntitySerializer")
public class QApplicationConfigEntity extends EntityPathBase<ApplicationConfigEntity> {

    private static final long serialVersionUID = -847533622L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QApplicationConfigEntity applicationConfigEntity = new QApplicationConfigEntity("applicationConfigEntity");

    public final QApplicationLanguageEntity defaultLang;

    public final BooleanPath forcedLangInUrl = createBoolean("forcedLangInUrl");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isoTwoLetter = createBoolean("isoTwoLetter");

    public QApplicationConfigEntity(String variable) {
        this(ApplicationConfigEntity.class, forVariable(variable), INITS);
    }

    public QApplicationConfigEntity(Path<? extends ApplicationConfigEntity> path) {
        this(path.getType(), path.getMetadata(), path.getMetadata().isRoot() ? INITS : PathInits.DEFAULT);
    }

    public QApplicationConfigEntity(PathMetadata<?> metadata) {
        this(metadata, metadata.isRoot() ? INITS : PathInits.DEFAULT);
    }

    public QApplicationConfigEntity(PathMetadata<?> metadata, PathInits inits) {
        this(ApplicationConfigEntity.class, metadata, inits);
    }

    public QApplicationConfigEntity(Class<? extends ApplicationConfigEntity> type, PathMetadata<?> metadata, PathInits inits) {
        super(type, metadata, inits);
        this.defaultLang = inits.isInitialized("defaultLang") ? new QApplicationLanguageEntity(forProperty("defaultLang")) : null;
    }

}

