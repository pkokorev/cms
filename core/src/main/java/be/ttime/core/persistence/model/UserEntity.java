package be.ttime.core.persistence.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "user", schema = "cognosco")
@Getter
@Setter
@EqualsAndHashCode(of = {"id", "username", "password"})
public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Access(AccessType.PROPERTY)
    @Column(nullable = false, columnDefinition = "SMALLINT(11) UNSIGNED")
    private long id;
    @Column(nullable = false)
    private String username;
    @Column(nullable = false)
    private String password;
    private String firstName;
    private String lastName;
    private String userTitle;
    private String email;
    private String street;
    private String city;
    private String zip;
    private String state;
    private String countryName;
    private String comment;
    @Temporal(TemporalType.DATE)
    private Date birthday;
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date createdDate;
    @Temporal(TemporalType.DATE)
    private Date passwordModifiedDate;
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('MALE', 'FEMALE')")
    private Gender gender;
    @Column(nullable = false, columnDefinition = "TINYINT(1) default '1'")
    private boolean enabled = true;
    @Column(nullable = false, columnDefinition = "TINYINT(1) default '1'")
    private boolean accountNonExpired = true;
    @Column(nullable = false, columnDefinition = "TINYINT(1) default '1'")
    private boolean accountNonLocked = true;
    @Column(nullable = false, columnDefinition = "TINYINT(1) default '1'")
    private boolean credentialsNonExpired = true;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id") , inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id") )
    private Collection<RoleEntity> roles;


    public enum Gender { MALE, FEMALE }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        return getGrantedAuthorities(getPrivileges(roles));
    }

    private final List<String> getPrivileges(final Collection<RoleEntity> roles) {
        final List<String> privileges = new ArrayList<>();
        final List<PrivilegeEntity> collection = new ArrayList<>();
        for (final RoleEntity role : roles) {
            collection.addAll(role.getPrivileges());
        }
        for (final PrivilegeEntity item : collection) {
            privileges.add(item.getName());
        }
        return privileges;
    }

    private final List<GrantedAuthority> getGrantedAuthorities(final List<String> privileges) {
        final List<GrantedAuthority> authorities = new ArrayList<>();
        for (final String privilege : privileges) {
            authorities.add(new SimpleGrantedAuthority(privilege));
        }
        return authorities;
    }
}