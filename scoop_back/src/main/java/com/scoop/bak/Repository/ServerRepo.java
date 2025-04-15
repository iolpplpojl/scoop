package com.scoop.bak.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scoop.bak.classes.server.Server;
import com.scoop.bak.classes.server.ServerDTO;

@Repository
public interface ServerRepo extends JpaRepository<Server, Long> {
	@Query("select s from Server s where s.serverID in (select sm.serverId from Server_Member sm where sm.memberId = :user)")
	List<Server> findAllByUserId(@Param("user") Long user);


}
	