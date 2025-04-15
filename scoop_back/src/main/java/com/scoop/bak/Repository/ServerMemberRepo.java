package com.scoop.bak.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.scoop.bak.classes.server.Server_Member;
@Repository
public interface ServerMemberRepo extends JpaRepository<Server_Member, Long> {

}
