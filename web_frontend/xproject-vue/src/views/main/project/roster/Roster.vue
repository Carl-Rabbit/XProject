<template>
  <el-card id="base-card">
    <div slot="header" class="">
      <span id="title-text">Student Roster</span>
    </div>

    <div class="table-btm-group">
      <el-button type="primary" plain @click="createDialogVisible = true">Create</el-button>
      <el-button type="primary" plain @click="importDialogVisible = true">Import</el-button>
      <el-button type="danger" plain @click="deleteDialogVisible = true">Delete</el-button>
    </div>

    <el-dialog
      title="Create student account"
      :visible.sync="createDialogVisible"
      width="30%"
      @open="handleDialogOpen">

      <el-form class="reg-container" label-position="right" :model="stdForm"
               label-width="150px" status-icon ref="registerForm">
        <el-form-item label="Student Name" prop="stdName">
          <el-input type="text" v-model="stdForm.stdName"
                    auto-complete="off"
                    placeholder="Please input student name"></el-input>
        </el-form-item>
        <el-form-item label="Student No" prop="stdNo">
          <el-input type="text" v-model="stdForm.stdNo"
                    auto-complete="off"
                    placeholder="Please input student number"></el-input>
        </el-form-item>
        <el-form-item label="Student class" prop="stdClass">
          <el-input type="text" v-model="stdForm.stdClass"
                    auto-complete="off"
                    placeholder="Please input student class"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="stdClass">
          <el-input type="text" v-model="stdForm.email"
                    auto-complete="off"
                    placeholder="Please input email"></el-input>
        </el-form-item>

        <el-form-item label="Username" prop="username">
          <el-input type="text" v-model="stdForm.username"
                    prefix-icon="el-icon-user" auto-complete="off"
                    placeholder="Please input username"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="stdForm.password"
                    prefix-icon="el-icon-lock" auto-complete="off"
                    placeholder="Please input password" show-password></el-input>
        </el-form-item>
        <el-form-item label="Password again" prop="passwordRepeat">
          <el-input type="password" v-model="stdForm.passwordRepeat"
                    prefix-icon="el-icon-lock" auto-complete="off"
                    placeholder="Please input password again" show-password></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="createDialogVisible = false; createStd()">Create</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Tip"
      :visible.sync="deleteDialogVisible"
      width="30%"
      @open="handleDialogOpen">

      <span v-if="dialogSltList.length">Delete selected {{ dialogSltList.length }} student(s) ?</span>
      <span v-else>Please select students</span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false" v-if="dialogSltList.length">Cancel</el-button>
        <el-button type="primary" @click="deleteDialogVisible = false; deleteStd()">OK</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Import"
      :visible.sync="importDialogVisible"
      width="30%">

      <el-upload
        class="upload-demo"
        ref="excelUpload"
        drag
        :action="'not-matter'"
        :auto-upload="false"
        :http-request="uploadExcel"
        :multiple="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Drag the file here, or<em> click to upload</em></div>
        <div class="el-upload__tip" slot="tip">Only excel files can be uploaded</div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelExcel">Cancel</el-button>
        <el-button type="primary" @click="uploadExcelCaller">Upload</el-button>
      </span>
    </el-dialog>

    <el-card>
      <el-table
        ref="stdTable"
        :data="stdList"
        :height="418"
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
        <el-table-column label="Operation" width="100px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">Edit
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

    <el-dialog title="Edit Student Information" :visible.sync="editDialogVisible" width="32%">
      <el-form :model="form">
        <el-form-item label="Student Name" :label-width="formLabelWidth">
          <el-input v-model="form.stdName" autocomplete="off" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="SID" :label-width="formLabelWidth">
          <el-input v-model="form.stdNo" autocomplete="off" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="Class" :label-width="formLabelWidth">
          <el-input v-model="form.stdClass" autocomplete="off" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="Email" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateStdData">Confirm</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
import {getGradeList} from '@/api/grade'
import {getDatetimeStr} from '@/utils/parse-day-time'
import {getProjectListBySch, getProjStdList, postImportFromExcel, postUpdateStudentInfo} from '@/api/std_manage'
import {postProjStdExcel} from '@/api/resources'
import {postEventCreation} from '@/api/event'

export default {
  name: 'Roster',
  components: {},
  data () {
    return {
      //
      form: {
        stdName: '',
        stdNo:'',
        stdClass:'',
        email:'',
        roleId:'',
      },
      formLabelWidth: '120px',
      //
      editDialogVisible:false,
      createDialogVisible: false,
      importDialogVisible: false,
      deleteDialogVisible: false,
      dialogSltList: [],
      teamRadioModel: 'all',
      stdForm: {
        stdName: null,
        stdNo: null,
        stdClass: null,
        email: null,
        username: null,
        password: null,
        passwordRepeat: null,
      },
      stdList: [
        {
          index: 4,
          stdName: 'Gang Li',
          stdNo: '11816501',
          username: 'sustech11816501',
          stdClass: '1865',
          email: '11816501@mail.sustech.edu.cn',
        },
        {
          index: 5,
          stdName: 'Wushuang Ye',
          stdNo: '11816502',
          username: 'sustech11816502',
          stdClass: '1865',
          email: '11816502@mail.sustech.edu.cn',
        },
        {
          index: 6,
          stdName: 'Xiaohong he',
          stdNo: '11816601',
          username: 'sustech11816601',
          stdClass: '1866',
          email: '11816601@mail.sustech.edu.cn',
        },
      ],
      classFList: [],
      page: {
        current: 1,
        size: 100,
        total: 400,
      },
    }
  },
  mounted () {
    this.initStdManage()
  },
  methods: {
    //
    updateStdData(){
      this.$confirm('Confirm this change?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        console.log(this.form)
        postUpdateStudentInfo(this.form).then(resp=>{
          if(resp.data.code===200){
            this.$message({
              type: 'success',
              message: 'Change student info successfully'
            });
            this.initStdManage()
            this.editDialogVisible = false
          }else {
            this.$message.error(resp.data.message)
          }
        }).catch(failResp => {
          this.$message.error('Back-end no response')
        })
      }).catch(() => {

        this.$message({
          type: 'info',
          message: 'Canceled'
        });
      });

    },
    //
    handleDialogOpen () {
      this.dialogSltList = this.$refs.stdTable.selection
    },
    deleteStd () {
      let sltList = this.$refs.stdTable.selection
      console.log('delete sltList=%o', sltList)
    },
    uploadExcelCaller () {
      this.$refs.excelUpload.submit()
    },
    uploadExcel (param) {
      let file = param.file
      let formData = new window.FormData()
      formData.append('file', file)
      postImportFromExcel(formData).then(resp => {
        console.log('In uploadExcel: %o', resp)
      }).catch(failResp => {
        console.log('fail in uploadExcel: %o', failResp)
      })
      this.importDialogVisible = false
    },
    cancelExcel () {
      this.$refs.excelUpload.clearFiles()
      this.importDialogVisible = false
    },
    handleFilterChange (filters) {
      console.log('filter value: %o', filters)
    },
    handleEdit (index, row) {
      console.log(index, row)
      this.form.roleId = parseInt(row.roleId)
      this.form.stdName = row.stdName
      this.form.stdNo = row.stdNo
      this.form.stdClass = row.stdClass
      this.form.email = row.email


      this.editDialogVisible = true
    },
    classFMethod (value, row, column) {
      return value === row.stdClass
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

      getProjectListBySch().then(resp => {
        if (resp.data.code !== 200) {
          this.$alert(resp.data.code + '\n' + resp.data.message, 'Tip', {
            confirmButtonText: 'OK'
          })
          return false
        }
        this.stdList.splice(0, this.stdList.length)   // remove all
        let stdListRecv = resp.data.data
        for (let i = 0; i < stdListRecv.length; i++) {
          let record = stdListRecv[i]
          record['listIdx'] = i
          console.log(record)
          this.stdList.push(record)

          let stdClass = record.stdClass
          this.classFList.push({text: stdClass, value: stdClass})
        }
        this.classFList = this.unique(this.classFList)
        console.log(this.stdList)
      }).catch(failResp => {
        console.log('fail in getGradeList. message=' + failResp.message)
      })
    },
    createStd () {

    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
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

#base-card {
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
  justify-content: flex-end;
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

.upload-demo {
  text-align: center;
}
</style>
