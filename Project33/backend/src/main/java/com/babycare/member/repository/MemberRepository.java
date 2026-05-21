package com.babycare.member.repository;

import com.babycare.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByPhone(String phone);
    Optional<Member> findByMemberNo(String memberNo);
    boolean existsByPhone(String phone);
    boolean existsByMemberNo(String memberNo);
    
    @Query("SELECT m FROM Member m WHERE m.name LIKE %?1% OR m.phone LIKE %?1% OR m.memberNo LIKE %?1%")
    List<Member> search(String keyword);
    
    List<Member> findByStatusTrue();
}