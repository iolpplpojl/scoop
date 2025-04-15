package com.scoop.bak.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.scoop.bak.classes.server.Server;
import com.scoop.bak.classes.server.Server_Role;
@Repository
public interface ServerRoleRepo extends JpaRepository<Server_Role, Long>{

}
