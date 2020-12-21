import Vue from 'vue'

export function getUserHomeInfo () {
  return Vue.prototype.$axios.get('/all/home-page/info')
}

export function getProjList () {
  return Vue.prototype.$axios.get('/all/project/list')
}

export function getProjListBySch () {
  return Vue.prototype.$axios.get('/all/project/by-sch')
}

export function postJoinProj (projId,groupMark) {
  return Vue.prototype.$axios.post('/all/project/join',null, {
    params: {
      projId: projId,
      groupMark: groupMark
    }
  })
}
export function postProjQuit(projId){
  return Vue.prototype.$axios.post('/all/proj/quit',null,{
    params:{projId:parseInt(projId)}
  })
}
