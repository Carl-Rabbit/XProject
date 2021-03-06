import Vue from 'vue'

export function getTeamInfoList (projId) {
  return Vue.prototype.$axios.get('/all/team/list', {
    params: {projId: projId}
  })
}

export function getTeamDetail (teamId) {
  return Vue.prototype.$axios.get('/all/team/info/detail', {
    params: {teamId: teamId}
  })
}

export function postApply (msg, teamId) {
  return Vue.prototype.$axios.post('/student/team/apply', {
    message: msg,
    projInstId: parseInt(teamId),
  })
}

export function postTeamCreation (form) {
  return Vue.prototype.$axios.post('/all/team/creation', {
    description: form.desc,
    generateNum: form.cnt === '' ? 1 : form.cnt,
    idealSize: form.member,
    projId: form.projId,
    teamName: form.name,
    topic: form.topic,
    useIncrNum: form.withRank,
  })
}

export function postTeamDeletion (teams) {
  return Vue.prototype.$axios.post('/teacher/team/deletion', {
    projInstIdList: teams
  })
}

export function postTeamConfirmation (force,teamList) {
  return Vue.prototype.$axios.post('/all/team/confirm', {
    force:force,
    projInstIdList:teamList
  })
}
export function postTeamCancel(teams) {
  return Vue.prototype.$axios.post('/teacher/team/cancel', {
    projInstIdList:teams,
    force:true
  })
}

export function getProjectTopics (projId) {
  return Vue.prototype.$axios.get('/all/project/topic', {
    params: {projId: projId}
  })
}

export function getStuInfo (roleId) {
  return Vue.prototype.$axios.get('/all/team/stu-info', {
    params: {roleId: roleId}
  })
}

export function postAutoForming (form) {
  return Vue.prototype.$axios.post('/teacher/team/auto-forming',
    form
  )
}

export function getMyTeamDetail (projId) {
  return Vue.prototype.$axios.get('/student/team/detail', {
    params: {projId: projId}
  })
}

export function getUngroupedStudents (projId) {
  return Vue.prototype.$axios.get('/student/team/ungrouped', {
    params: {projId: projId}
  })
}

export function postInviteStudents (roleIdList, projId) {
  let inviteParamVO = {
    projId: projId,
    stdRoleIdList: roleIdList
  }

  return Vue.prototype.$axios.post('/student/team/invite', inviteParamVO)
}

export function postQuitTeam (projId) {
  return Vue.prototype.$axios.post('/student/team/quit', null, {
    params: {projId: projId}
  })
}

export function postReplyApplication (applyReplyParamVO) {
  return Vue.prototype.$axios.post('/student/team/reply/application', applyReplyParamVO)
}


export function postReplyInvite (applyReplyParamVO) {
  return Vue.prototype.$axios.post('/student/team/reply/invite', applyReplyParamVO)
}

export function getTeamMessage (projInstId) {
  return Vue.prototype.$axios.get('/all/team/message', {
    params: {projInstId: projInstId}
  })
}

export function getPersonalMessage (projId) {
  return Vue.prototype.$axios.get('/all/project/message', {
    params: {projId: projId}
  })
}

export function postEditedTeamInfo (piuVO) {
  return Vue.prototype.$axios.post('/student/team/change/info', piuVO)
}

export function getStuProj (roleId) {
  return Vue.prototype.$axios.get('/all/team/stu-proj', {
    params: {roleId: roleId}
  })
}

export function getTeammatesByRoleId (projId, roleId) {
  return Vue.prototype.$axios.get('/all/teammates/by/id', {
    params: {
      roleId: roleId,
      projId: projId
    }
  })
}

export function getTeamExcel (projId) {
  return Vue.prototype.$axios.get('api/teacher/team/excel', {
    params: {
      projId: projId
    }
  })
}

export function postEditedTeamTchInfo (form) {
  return Vue.prototype.$axios.post('/teacher/team/change', {
    projInstId:form.projInstId,
    targetMemNum:parseInt(form.tarMem),
    teamName:form.name,
    topic:form.topic
  })
}

