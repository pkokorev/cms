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
 * QIpAttemptsEntity is a Querydsl query type for IpAttemptsEntity
 */
@Generated("com.mysema.query.codegen.EntitySerializer")
public class QIpAttemptsEntity extends EntityPathBase<IpAttemptsEntity> {

    private static final long serialVersionUID = 2013934299L;

    public static final QIpAttemptsEntity ipAttemptsEntity = new QIpAttemptsEntity("ipAttemptsEntity");

    public final NumberPath<Integer> attempts = createNumber("attempts", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath ip = createString("ip");

    public final DatePath<java.util.Date> lastModified = createDate("lastModified", java.util.Date.class);

    public QIpAttemptsEntity(String variable) {
        super(IpAttemptsEntity.class, forVariable(variable));
    }

    public QIpAttemptsEntity(Path<? extends IpAttemptsEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QIpAttemptsEntity(PathMetadata<?> metadata) {
        super(IpAttemptsEntity.class, metadata);
    }

}

