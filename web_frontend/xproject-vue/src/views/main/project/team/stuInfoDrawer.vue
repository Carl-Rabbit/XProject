<template>
  <el-drawer
    :destroy-on-close="true"
    :size="size"
    :with-header="false"
    :visible.sync="stuDrawer"
    :before-close="refresh"
    :append-to-body="true"
  >
    <el-col :span="6" :offset="2">
      <el-avatar :src="iconUrl"
                 :size="270" :fit="'fill'"></el-avatar>

      <div style="margin-top: 60px;margin-bottom:15px;font-size: 20px">{{ this.stuName }}</div>

      <div>
        <el-tag v-for="imp in impressionList" :key="imp"
                class="el-tag" effect="plain">
          {{ imp }}
        </el-tag>
      </div>

      <div style="width: 100%; margin-top: 20px" align="left">
        {{ bio }}
      </div>

      <div style="margin-top: 15px" class="handle-overflow">
        <i class="el-icon-office-building"> {{ this.school }}</i>
      </div>
      <div style="margin-top: 15px" class="handle-overflow">
        <i class="el-icon-location-outline"> {{ this.location }}</i>
      </div>
      <div style="margin-top: 15px" class="handle-overflow">
        <i class="el-icon-message"> {{ this.email }}</i>
      </div>
    </el-col>

    <el-col :span="14" :offset="1">
      <el-tabs :tab-position="tabPosition" type="card" style="height: 100%; margin-top: 20px" v-model="activeName">
        <el-tab-pane label="Overview" name="overview">
          <div style="margin-top: 10px">Recent project</div>

          <div v-if="firstThreeProjList.length===0"
               style="margin-top: 15px;">
            <div style="margin-top: 10px;">
              <el-row>
                <el-col :span="12">
                  <el-card class="box-card" shadow="never" align="center"
                           style="width: 95%; margin-top: 15px; min-height: 100px;">
                    <p></p>
                    <div style="font-size: 18px; color: #585858;">No data</div>
                    <p></p>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>

          <div v-else>
            <el-row>
              <el-col :span="12" v-for="proj in firstThreeProjList" :key="proj.projName">
                <el-card class="box-card" style="width: 95%; margin-top: 15px" shadow="never">
                  <div class="title">{{ proj.projName }}</div>
                  <p></p>
                  <div class="text">{{ proj.courseName }} {{ proj.createTime }}</div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <div>
            <div style="margin-top: 20px">Skill List</div>
            <div v-if="skillList.length!==0">
              <el-tag v-for="skill in skillList" :key="skill"
                      effect="plain" class="el-tag">
                {{ skill }}
              </el-tag>
            </div>
            <div v-else>
              <el-button class="el-tag" size="small">No tag</el-button>
            </div>

            <div style="margin-top: 20px">
              Comment List
            </div>
            <div v-if="commentList != null">
              <el-tag v-for="comments in commentList" :key="comments"
                      effect="plain" class="el-tag">
                {{ comments }}
              </el-tag>
            </div>
            <div v-else>
              <el-button class="el-tag" size="small">No comment</el-button>
            </div>
          </div>


          <!--          <div style="margin-top: 40px">Statistic</div>-->
        </el-tab-pane>

      </el-tabs>
    </el-col>


  </el-drawer>
</template>

<script>
import {getStuInfo} from '@/api/team'
import {getStuProj} from '@/api/team'
import {getComments, getProjList} from '@/api/home_page'
import {getDatetimeStr} from '@/utils/parse-day-time'

export default {
  name: 'stuInfoDrawer',
  data () {
    return {
      //
      stuName: '',
      size: '90%',
      stuDrawer: '',
      iconUrl: '',
      //
      bio: '',
      school: '',
      location: '',
      email: '',

      //tag
      impressionList: [],
      skillList: [],

      //projList
      fullProjList: [],
      firstThreeProjList: [],

      //tab
      tabPosition: 'top',
      activeName: 'overview',

      //project history filter
      projNameFilter: '',
      projNameList: [],
      //year filter
      yearList: [{value: 0, label: 'All'}],
      valueYear: 0,
      //course filter
      courseList: [{value: 0, label: 'All'}],
      valueCourse: 0,

      commentList: null
    }
  },
  methods: {
    refresh () {
      this.$emit('closeDrawerStu', 'msg')
      console.log('stu-closing')
      console.log(this.stuDrawer)
      //清除数据？

    },
    initStu (roleId) {
      getStuInfo(roleId).then(resp => {
        console.log(resp)
        if (resp.data.code === 200) {
          this.iconUrl = resp.data.data.role.iconUrl
          let infoDict = resp.data.data.student

          this.bio = infoDict.bio
          this.stuName = resp.data.data.role.username
          this.school = resp.data.data.school.schName
          this.location = resp.data.data.school.location
          this.email = infoDict.email

          if (infoDict.flags != null) {
            this.impressionList = JSON.parse(infoDict.flags)
          }
          if (infoDict.skills != null) {
            this.skillList = JSON.parse(infoDict.skills)
          }

        } else if (resp.data.code === 400) {
          console.log(resp.data.message)
          this.$alert(resp.data.message, 'Tip', {
            confirmButtonText: 'OK'
          })
        }
      }).catch(failResp => {
        this.$alert('Error: ' + failResp.message, 'Tips', {
          confirmButtonText: 'OK'
        })
      })
      getStuProj(roleId).then(resp => {
        if (resp.data.code !== 200) {
          return false
        }

        let infoDict = resp.data.data
        console.log('==========')
        console.log(infoDict)

        this.firstThreeProjList.splice(0, this.firstThreeProjList.length)
        for (let i = 0; i < infoDict.length; ++i) {
          if (i >= 3) break
          infoDict[i].createTime = getDatetimeStr(infoDict[i].createTime)
          this.firstThreeProjList.push(infoDict[i])
        }

      }).catch(failResp => {
        this.$alert('Error: ' + failResp.message, 'Tips', {
          confirmButtonText: 'OK'
        })
      })
      getComments().then(resp => {
        if (resp.data.code !== 200) {
          this.$message.error(resp.data.message)
          return false
        }
        if (resp.data.data !== '{}') {
          this.commentList = JSON.parse(resp.data.data).comments
        } else {
          this.commentList = null
        }
      }).catch(failResp => {
        this.$message.error(failResp.message)
      })
    }
  },
  created () {
    this.stuDrawer = this.drawer
  },
  watch: {
    drawer (val) {
      this.stuDrawer = val
      console.log('change stuinfo drawer state')
      console.log(this.id)
      // if(this.stuDrawer===true){
      this.initStu(this.id)
      // }
    },
    id (val) {
      console.log(val)
      this.initStu(val)
    }
  },
  props: {
    drawer: {type: Boolean, default: false},
    id: {type: Number, default: -1},
  }
}
</script>

<style scoped>
.text {
  font-size: 15px;
  color: #aaaaaa
}

.title {
  font-size: 20px
}

.small-text {
  font-size: 13px;
  color: #aaaaaa
}

.box-card {
  width: 480px;
}

.el-tag {
  margin-right: 10px;
  margin-top: 15px;
}

.el-select-dropdown .el-scrollbar >>> .el-scrollbar__wrap {
  overflow: scroll;
}

.base-card {
  margin: 15px 10px;
  min-height: 95.2%;
}

.handle-overflow {
  overflow: hidden;
  white-space: nowrap;
  /*text-overflow: ellipsis;*/
  width: 100%;
}
</style>
