<template>
  <el-card type="box-card" class="base-card">
    <div slot="header" class="">
      <span id="title-text">Student View</span>
    </div>

    <div class="table-btm-group">
      <el-button @click="clearFilter" style="margin-right: auto">Clear all filters</el-button>
      <!--      <el-radio-group v-model="teamRadioModel" @change="handleTeamRadioChange" id="teamRadio">-->
      <!--        <el-radio-button label="all">All</el-radio-button>-->
      <!--        <el-radio-button label="haveTeam">Have a team</el-radio-button>-->
      <!--        <el-radio-button label="noTeam">No team</el-radio-button>-->
      <!--      </el-radio-group>-->
      <el-button type="primary" plain icon="el-icon-plus" @click="initAddDrawer()">Add</el-button>
      <el-button type="primary" plain icon="el-icon-minus" @click="delStd()">Delete</el-button>
      <el-button type="primary" plain @click="clearStdTeam">Clear</el-button>
      <el-button icon="el-icon-upload2" @click="uploadDrawer = true">Upload</el-button>
      <el-button type="warning" plain icon="el-icon-edit" @click="manageTeam">Manage</el-button>
    </div>

    <el-card>
      <el-table
        ref="stdTable"
        :data="stdList"
        v-loading="tableLoading"
        empty-text="No Data Found"
        :height="416"
        :default-sort="{prop: 'index', order: 'increasing'}"
        style="width: 100%">
        <el-table-column type="selection"/>
        <el-table-column label="" type="index" width="50px" sortable/>
        <el-table-column label="Student Name" prop="stdName" sortable/>
        <el-table-column label="SID" prop="stdNo" sortable/>
        <el-table-column label="Group Mark" prop="groupMark" sortable/>
        <el-table-column label="Index" prop="projInstId" sortable
                         :filters="teamIndexFList"
                         :filter-method="teamIndexFMethod"/>
        <el-table-column label="Name" prop="teamName" sortable/>
        <el-table-column label="Topic" prop="topicStr" sortable/>
        <el-table-column label="Status" prop="status" sortable
                         :filters="teamStatusFList"
                         :filter-method="teamStatusFMethod"/>
        <el-table-column>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary" plain
              icon="el-icon-document-checked"
              @click="startScoring(scope.row)">Scoring
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--      <div class="block">-->
      <!--        <el-pagination-->
      <!--          @size-change="handleSizeChange"-->
      <!--          @current-change="handleCurrentChange"-->
      <!--          :current-page="page.current"-->
      <!--          :page-size="page.page"-->
      <!--          layout="total, sizes, prev, pager, next, jumper"-->
      <!--          :total="page.total">-->
      <!--        </el-pagination>-->
      <!--      </div>-->

    </el-card>

    <AutoForming :visible.sync="formingVisible"
                 :stu-in="stdSelectedList"
                 @closeManaging="closeManaging(false)"></AutoForming>

    <el-drawer
      title="Add selected students to this project"
      :visible.sync="addDrawerVisible"
      :direction="direction"
      :before-close="closeAddDrawer"
      size="80%">

      <div align="right" style="margin-right: 40px;">
        <el-input placeholder="Group mark here..."
                  v-model="groupMarkOfAdd"
                  style="width: 40%; margin-right: 10px;"></el-input>
        <el-button type="primary" icon="el-icon-plus" @click="addStd">Add</el-button>
        <el-button @click="closeAddDrawer">Cancel</el-button>
      </div>

      <el-card style="margin-top: 20px; margin-left: 1%; margin-right: 1%; min-height: 89%">
        <el-table
          ref="allStdTable"
          :data="allStdList"
          empty-text="No Data Found"
          :default-sort="{prop: 'index', order: 'increasing'}"
          @filter-change="handleFilterChange"
          style="width: 100%">
          <el-table-column type="selection"/>
          <el-table-column label="" type="index" width="50px" sortable/>
          <el-table-column label="Student Name" prop="stdName" sortable/>
          <el-table-column label="SID" prop="stdNo" sortable/>
          <el-table-column label="Username" prop="username" sortable/>
          <el-table-column label="Class" prop="stdClass" sortable column-key="stdClass"
                           :filters="classFList" :filter-method="classFMethod" :filter-multiple="false"/>
          <el-table-column label="Email" prop="email" width="300px" sortable/>
        </el-table>
      </el-card>
    </el-drawer>

    <el-drawer
      :title="drawerTitle"
      :visible.sync="scoringDrawerVisible"
      direction="rtl"
      :before-close="cancelScoring"
      size="80%">

      <div align="right" style="margin-right: 40px;">
        <el-button @click="cancelScoring">Cancel</el-button>
      </div>
      <el-card style="margin-top: 20px; margin-left: 1%; margin-right: 1%; min-height: 89%">
        <el-table
          :data="recordList"
          empty-text="No Data Found"
          row-key="record.rcdId"
          :expand-row-keys="expandRowList"
          :default-sort="{prop: 'index', order: 'increasing'}"
          style="width: 100%;"
          @expand-change="recordExpandChange">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div v-for="inst in recordInstList" :key="inst.stdId" style="margin-bottom: 15px">
                <el-avatar :fit="'fill'" :src="inst.iconUrl"
                           style="vertical-align:middle; margin-right: 10px;"
                ></el-avatar>
                <span style="vertical-align:middle;">{{ inst.stdNo }}</span>
                <span style="vertical-align:middle; margin-left: 3px;">{{ inst.stdName }}</span>

                <span v-if="inst.type==='Point'">
                <el-input v-model="inst.content"
                          style="width: 100px; margin-left: 20px;">
                </el-input>
                / {{ inst.baseContent }}
              </span>

                <span v-else-if="inst.type==='Grade'||inst.type==='PF'">
                <el-select v-model="inst.content" placeholder=""
                           style="width: 60px; margin-left: 20px;">
                 <el-option v-for="grade in gradeSelector" :key="grade.value"
                            :label="grade.label" :value="grade.value">
                  </el-option>
                </el-select>
              </span>

                <el-input v-model="inst.comments"
                          placeholder="Comment here..."
                          style="width: 250px; margin-left: 20px;">
                </el-input>

                <div style="margin-top: 10px; margin-left: 55px;"
                     v-if="inst.modifiedTime==null || inst.tchName==null || inst.email==null">
                  Last Modified: no record
                </div>
                <div style="margin-top: 10px; margin-left: 55px;" v-else>
                  Last Modified: {{ inst.modifiedTime }}, {{ inst.tchName }}, {{ inst.email }}
                </div>

                <div v-if="inst.roleId===scoringStdRoleId && recordInstList.length > 1"
                     style="margin-top: 20px; font-size: 20px; font-weight: bold">
                  Teammates:
                </div>
              </div>

              <div align="right" style="margin-right: 40px;">
                <el-button type="primary"
                           @click="updateScore(props.row)">Scoring
                </el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="" type="index" width="50px"/>
          <el-table-column label="Name" prop="record.rcdName" sortable/>
          <el-table-column label="Type" prop="record.type"/>
          <el-table-column label="Creator" prop="creator.tchName"/>
          <el-table-column label="Created time" prop="record.createdTime"
                           :formatter="dateTimeFormatter" sortable/>
        </el-table>
      </el-card>
    </el-drawer>

    <el-drawer
      title="Add New Resources"
      :visible.sync="uploadDrawer"
      size="60%">

      <el-card id="add-card">
        Upload New Resources:
        <el-upload
          class="upload"
          ref="uploadDrawer"
          :action="'not-matter'"
          multiple
          :auto-upload="false"
          :limit="1"
          :on-exceed="handleExceed"
          :on-change="batchImportChange"
          :file-list="fileList">

          <el-button slot="trigger" type="primary">Choose</el-button>
          <el-button style="margin-left: 10px;" type="success" @click="upload">Submit</el-button>
          <div slot="tip" class="el-upload__tip">Click Choose to select resources which you want to upload.</div>
          <div slot="tip" class="el-upload__tip">Click Submit to upload chosen resources.</div>
        </el-upload>
      </el-card>

    </el-drawer>

  </el-card>
</template>

<script>
import {
  getProjectListBySch,
  getProjStdList,
  postAddStdIntoProj,
  postClearStdTeam,
} from '@/api/std_manage'
import AutoForming from '@/views/main/project/team/AutoForming'
import {getAllRecord, getRecordInstStudent, postNewGrade} from '@/api/grade'
import {getDatetimeStr} from '@/utils/parse-day-time'
import {postDelStdIntoProj} from '@/api/home_page'
import {postProjStdExcel} from '@/api/resources'

export default {
  name: 'StdManage',
  components: {
    AutoForming
  },
  data () {
    return {
      formingVisible: false,
      tableLoading: false,
      stdList: [],
      teamIndexFList: [],
      // page: {
      //   current: 1,
      //   size: 100,
      //   total: 400,
      // },
      teamStatusFList: [
        {text: 'Raw', value: 'Raw'},
        {text: 'Confirm', value: 'Confirm'},
        {text: 'No Team', value: null},
      ],
      stdSelectedList: [],

      addDrawerVisible: false,
      direction: 'rtl',
      allStdList: [],
      classFList: [],
      groupMarkOfAdd: '',

      multipleSelection: [],
      scoringDrawerVisible: false,
      drawerTitle: '',
      scoringTeamMateList: [],
      gradeList: [],
      haveTeam: false,

      teamMemberList: [],
      gradeSelector: [
        {value: 'A', label: 'A'},
        {value: 'B', label: 'B'},
        {value: 'C', label: 'C'},
        {value: 'D', label: 'D'},
        {value: 'E', label: 'E'},
        {value: 'F', label: 'F'},
      ],
      expandRowList: [],
      scoringStdRoleId: '',
      recordInstList: [],
      loading: true,
      recordList: [],

      uploadDrawer: false,
      fileList: []
    }
  },
  mounted () {
    this.initStdManage()
  },
  methods: {

    dateTimeFormatter (row, col) {
      return getDatetimeStr(row.record.createdTime)
    },
    clearFilter () {
      this.$refs.stdTable.clearFilter()
    },
    teamIndexFMethod (value, row, column) {
      return value === row.projInstId
    },
    teamStatusFMethod (value, row, column) {
      return value === row.status
    },
    unique (arr) {
      let result = {}
      let finalResult = []
      for (let i = 0; i < arr.length; i++) {
        result[arr[i].value] = arr[i]
      }
      for (const item in result) {
        finalResult.push(result[item])
      }
      return finalResult
    },
    initStdManage () {
      this.stdList.splice(0, this.stdList.length)   // remove all
      let projId = this.$store.state.proj.projId

      getProjStdList(projId).then(resp => {
        if (resp.data.code !== 200) {
          this.$alert(resp.data.code + '\n' + resp.data.message, 'Tip', {
            confirmButtonText: 'OK'
          })
          return false
        }
        this.stdList.splice(0, this.stdList.length)   // remove all
        this.teamIndexFList.splice(0, this.teamIndexFList.length)   // remove all
        // this.teamStatusFList.splice(0, this.teamStatusFList.length)   // remove all
        let stdListRecv = resp.data.data
        for (let i = 0; i < stdListRecv.length; i++) {
          let record = stdListRecv[i]
          this.stdList.push(record)

          let teamIndex = record.projInstId
          this.teamIndexFList.push({text: teamIndex, value: teamIndex})
          // let status = record.status;
          // this.teamStatusFList.push({text:status, value:status})
        }
        this.teamIndexFList = this.unique(this.teamIndexFList)
        // this.teamStatusFList = this.unique(this.teamStatusFList)
        // console.log(this.stdList)
      }).catch(failResp => {
        console.log('fail in getGradeList. message=' + failResp.message)
      })
    },
    manageTeam () {
      // console.log(this.stdSelectedList)
      this.stdSelectedList = this.$refs.stdTable.selection
      this.formingVisible = true
      //调用组队表单？
    },
    closeManaging (val) {
      this.formingVisible = false
      if (val) {
        this.reLoad()
      }
    },
    clearStdTeam () {
      this.$confirm('Confirm to clear team information of selected students?', 'Tip', {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        let chosenList = this.$refs.stdTable.selection
        let roleIdList = []

        for (let i = 0; i < chosenList.length; ++i) {
          roleIdList.push(chosenList[i].roleId)
        }

        let quitProjParamVO = {
          'projId': this.$store.state.proj.projId,
          'roleIdList': roleIdList
        }

        postClearStdTeam(quitProjParamVO).then(resp => {
          if (resp.data.code === 200) {
            this.initStdManage()

            this.$message.success('Clear success')
          } else if (resp.data.code === 400) {
            this.$message.error(resp.data.message)
          }
        }).catch(failResp => {
          this.$message.error(failResp.message)
        })
      }).catch(() => {
        this.$message.info('Clear canceled')
      })
    },
    reLoad () {
      this.tableLoading = true
      this.initStdManage()
      setTimeout(() => {
        this.tableLoading = false
      }, 1000)
    },

    closeAddDrawer () {
      this.$confirm('Cancel add？')
        .then(_ => {
          this.addDrawerVisible = false
          this.groupMarkOfAdd = ''
          this.$message.info('Add canceled')
        })
    },
    classFMethod (value, row, column) {
      return value === row.stdClass
    },
    handleFilterChange (filters) {
      // console.log('filter value: %o', filters)
    },
    initAddDrawer () {
      this.addDrawerVisible = true

      getProjectListBySch().then(resp => {
        if (resp.data.code !== 200) {
          this.$alert(resp.data.code + '\n' + resp.data.message, 'Tip', {
            confirmButtonText: 'OK'
          })
          return false
        }
        this.allStdList.splice(0, this.allStdList.length)   // remove all
        let stdListRecv = resp.data.data
        for (let i = 0; i < stdListRecv.length; i++) {
          let record = stdListRecv[i]
          record['listIdx'] = i
          this.allStdList.push(record)

          let stdClass = record.stdClass
          this.classFList.push({text: stdClass, value: stdClass})
        }
        this.classFList = this.unique(this.classFList)
      }).catch(failResp => {
        console.log('fail in getGradeList. message=' + failResp.message)
      })
    },
    addStd () {
      this.$confirm('Confirm to add?', 'Tip', {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        let chosenList = this.$refs.allStdTable.selection
        let roleIdList = []

        for (let i = 0; i < chosenList.length; ++i) {
          roleIdList.push(chosenList[i].roleId)
        }

        let pasVO = {
          'groupMark': this.groupMarkOfAdd,
          'projId': this.$store.state.proj.projId,
          'stdRoleIdList': roleIdList
        }

        postAddStdIntoProj(pasVO).then(resp => {
          if (resp.data.code === 200) {
            this.initStdManage()
            this.groupMarkOfAdd = ''
            this.addDrawerVisible = false

            this.$message.success('Add success')
          } else if (resp.data.code === 400) {
            this.$message.error(resp.data.message)
          }
        }).catch(failResp => {
          this.$message.error(failResp.message)
        })
      }).catch(() => {
        this.$message.info('Add canceled')
      })
    },
    delStd () {
      this.$confirm('Confirm to delete selected students?', 'Tip', {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        let chosenList = this.$refs.stdTable.selection
        let roleIdList = []

        for (let i = 0; i < chosenList.length; ++i) {
          roleIdList.push(chosenList[i].roleId)
        }

        let quitProjParamVO = {
          'projId': this.$store.state.proj.projId,
          'roleIdList': roleIdList
        }

        postDelStdIntoProj(quitProjParamVO).then(resp => {
          if (resp.data.code === 200) {
            this.initStdManage()

            this.$message.success('Delete success')
          } else if (resp.data.code === 400) {
            this.$message.error(resp.data.message)
          }
        }).catch(failResp => {
          this.$message.error(failResp.message)
        })
      }).catch(() => {
        this.$message.info('Delete canceled')
      })
    },

    startScoring (std) {
      this.drawerTitle = 'Scoring ' + std.stdName
      this.scoringDrawerVisible = true
      this.scoringStdRoleId = std.roleId

      getAllRecord(this.$store.state.proj.projId).then(resp => {
        if (resp.data.code !== 200) {
          this.$message.error(resp.data.code + '\n' + resp.data.message)
          return false
        }

        this.recordList.splice(0, this.recordList.length)   // remove all
        this.recordList = resp.data.data
        // console.log(this.recordList)
      }).catch(failResp => {
        console.log('fail in getGradeList. message=' + failResp.message)
      })
    },
    updateScore (row) {
      this.$confirm('Confirm to Scoring?', 'Tip', {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        let recordInstUpdateParamVO = {
          'gradeList': [],
          'rcdId': row.record.rcdId
        }

        for (let i = 0; i < this.recordInstList.length; ++i) {
          let grade = {
            'comments': this.recordInstList[i].comments,
            'content': this.recordInstList[i].content,
            'roleId': this.recordInstList[i].roleId
          }
          recordInstUpdateParamVO.gradeList.push(grade)
        }

        postNewGrade(recordInstUpdateParamVO).then(resp => {
          if (resp.data.code === 200) {
            getRecordInstStudent(
              row.record.rcdId, this.scoringStdRoleId
            ).then(resp => {
              if (resp.data.code !== 200) {
                this.$message.error(resp.data.code + '\n' + resp.data.message)
                return false
              }

              this.recordInstList = resp.data.data
              for (let i = 0; i < this.recordInstList.length; ++i) {
                if (this.recordInstList[i].modifiedTime != null) {
                  this.recordInstList[i].modifiedTime
                    = getDatetimeStr(this.recordInstList[i].modifiedTime)
                }
              }
              this.loading = false
              // console.log(this.recordInstList)
            }).catch(failResp => {
              console.log('fail in getGradeList. message=' + failResp.message)
            })

            this.$message.success('Scoring success')
          } else if (resp.data.code === 400) {
            this.$message.error(resp.data.message)
          }
        }).catch(failResp => {
          this.$message.error(failResp.message)
        })
      }).catch(() => {
        this.$message.info('Scoring canceled')
      })
    },
    cancelScoring () {
      this.$confirm('Cancel scoring？')
        .then(_ => {
          this.scoringDrawerVisible = false
          this.expandRowList.splice(0, this.expandRowList.length)
          this.$message.info('Scoring canceled')
        })
    },
    recordExpandChange (row, expandedRows) {
      if (expandedRows.length > 0) {
        // this.loading = true
        this.recordInstList.splice(0, this.recordInstList.length)
        this.expandRowList.splice(0, this.expandRowList.length)
        this.expandRowList.push(row.record.rcdId)

        getRecordInstStudent(
          row.record.rcdId, this.scoringStdRoleId
        ).then(resp => {
          if (resp.data.code !== 200) {
            this.$message.error(resp.data.code + '\n' + resp.data.message)
            return false
          }

          this.recordInstList = resp.data.data
          for (let i = 0; i < this.recordInstList.length; ++i) {
            if (this.recordInstList[i].modifiedTime != null) {
              this.recordInstList[i].modifiedTime
                = getDatetimeStr(this.recordInstList[i].modifiedTime)
            }
          }
          this.loading = false
          // console.log(this.recordInstList)
        }).catch(failResp => {
          console.log('fail in getGradeList. message=' + failResp.message)
        })
      }
    },

    upload () {
      let formData = new window.FormData()
      this.fileList.forEach(file => {
        formData.append('files', file.raw)
      })
      formData.append('projId', this.$store.state.proj.projId)

      postProjStdExcel(formData).then(resp => {
        // console.log(resp)
        if (resp.data.code !== 200) {
          this.$message.error(resp.data.message + 'aaa')
          return false
        }

        this.initStdManage()
        this.uploadDrawer = false
        this.fileList.splice(0, this.fileList.length)
        this.$message.success(resp.data.data + 'records changed')
      }).catch(failResp => {
        this.$message.error(failResp.message)
      })
    },
    batchImportChange (file, fileList) {
      this.fileList = fileList

      this.fileList.forEach(file => {
        if (file.name.substring(file.name.lastIndexOf('.') + 1) !== 'xlsx') {
          this.$message.error('Can only upload .xlsx')
          this.fileList.splice(0, this.fileList.length)
        }
      })
    },
    handleExceed () {
      this.$message.info('Can only upload one excel every time')
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.base-card {
  margin: 15px 10px;
  min-height: 95.2%;
}

#title-text {
  font-size: 20px;
}

.table-btm-group {
  margin: 10px 0 20px 0;
  display: flex;
  align-items: center;
  /*justify-content: flex-end;*/
}

#teamRadio {
  margin-right: 10px;
}

.el-pagination {
  margin: 30px 0 10px 0;
  text-align: center;
}

#title-text {
  font-size: 20px;
}

> > .el-drawer :focus {
  outline: 0;
}
</style>


<!--      <div class="block">-->
<!--        <el-pagination-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--          :current-page="page.current"-->
<!--          :page-size="page.page"-->
<!--          layout="total, sizes, prev, pager, next, jumper"-->
<!--          :total="page.total">-->
<!--        </el-pagination>-->
<!--      </div>-->

<!--{-->
<!--index: 1,-->
<!--rcdName: 'assignment1',-->
<!--modifiedTime: '12/01/2020 14:00',-->
<!--tchName: 'Dehua Liu',-->
<!--type: 'Point',-->
<!--content: '',-->
<!--baseContent: 100,-->
<!--comment: '1.2 no pic -2; 1.4 no text -2'-->
<!--},-->
<!--{-->
<!--index: 2,-->
<!--rcdName: 'assignment2',-->
<!--modifiedTime: '12/01/2020 14:00',-->
<!--tchName: 'Dehua Liu',-->
<!--type: 'Grade',-->
<!--content: '',-->
<!--baseContent: '',-->
<!--comment: ''-->
<!--},-->
<!--{-->
<!--index: 3,-->
<!--rcdName: 'assignment3',-->
<!--modifiedTime: '12/01/2020 14:00',-->
<!--tchName: 'Dehua Liu',-->
<!--type: 'Comment',-->
<!--content: '',-->
<!--baseContent: '',-->
<!--comment: ''-->
<!--},-->
