package com.scoop.bak.Repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mysql.cj.xdevapi.SessionFactory;
import com.scoop.bak.classes.MemberRes;
import com.scoop.bak.classes.chat.Message;
@Repository
public interface MessageRepo extends JpaRepository<Message, Long>{
	List<Message> findByChatroomID(Long ChatRoomID);
}


