package com.scoop.bak.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scoop.bak.classes.server.Server;
import com.scoop.bak.classes.server.ServerDTO;

public interface ServerRepo extends JpaRepository<Server, Long> {

}
