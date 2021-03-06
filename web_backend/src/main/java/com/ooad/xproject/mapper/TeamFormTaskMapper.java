package com.ooad.xproject.mapper;

import com.ooad.xproject.entity.TeamFormTask;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamFormTaskMapper {
    int deleteByPrimaryKey(Integer tfTaskId);

    int insert(TeamFormTask record);

    int insertSelective(TeamFormTask record);

    TeamFormTask selectByPrimaryKey(Integer tfTaskId);

    int updateByPrimaryKeySelective(TeamFormTask record);

    int updateByPrimaryKey(TeamFormTask record);
}