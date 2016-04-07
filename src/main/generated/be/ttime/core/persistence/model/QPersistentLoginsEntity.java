package be.ttime.core.persistence.model;

import com.mysema.query.types.Path;
import com.mysema.query.types.PathMetadata;
import com.mysema.query.types.path.DatePath;
import com.mysema.query.types.path.EntityPathBase;
import com.mysema.query.types.path.NumberPath;
import com.mysema.query.types.path.StringPath;

import javax.annotation.Generated;

import static com.mysema.query.types.PathMetadataFactory.forVariable;


/**
 * QPersistentLoginsEntity is a Querydsl query type for PersistentLoginsEntity
 */
@Generated("com.mysema.query.codegen.EntitySerializer")
public class QPersistentLoginsEntity extends EntityPathBase<PersistentLoginsEntity> {

    private static final long serialVersionUID = -944264785L;

    public static final QPersistentLoginsEntity persistentLoginsEntity = new QPersistentLoginsEntity("persistentLoginsEntity");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DatePath<java.util.Date> lastUsed = createDate("lastUsed", java.util.Date.class);

    public final StringPath series = createString("series");

    public final StringPath token = createString("token");

    public final StringPath username = createString("username");

    public QPersistentLoginsEntity(String variable) {
        super(PersistentLoginsEntity.class, forVariable(variable));
    }

    public QPersistentLoginsEntity(Path<? extends PersistentLoginsEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPersistentLoginsEntity(PathMetadata<?> metadata) {
        super(PersistentLoginsEntity.class, metadata);
    }

}

