<template>
  <el-card class="base-card">
    <el-col :span="14" :offset="2">
      <el-tabs :tab-position="tabPosition" type="card"
               style="height: 100%; margin-top: 10px" v-model="activeName">
        <el-tab-pane label="Account Information" name="accountInfo">
          <div style="font-size: 30px; font-weight:bold; margin-left: 20px">
            Account Information
            <el-divider></el-divider>
          </div>
          <el-container style="margin-left: 20px;">
            <el-form ref="form" label-width="140px">
              <el-form-item v-for="info in formInfoList" :key="info.label"
                            v-bind:label="info.label" class="form-item-height">
                {{ info.value }}
              </el-form-item>
            </el-form>
          </el-container>
        </el-tab-pane>

        <el-tab-pane label="Personal Information" name="personalInfo">
          <div style="font-size: 30px; font-weight:bold; margin-left: 20px">
            Personal Information
            <el-divider></el-divider>
          </div>

          <div class="personalInfoTypesetting personalInfoTitle">
            Password
          </div>
          <el-dialog
            title="Change Password"
            :visible.sync="changeDialog"
            width="50%"
            :before-close="handleClose">
            <div class="personalInfoTypesetting" style="width:90%; margin-top: 20px;">
              <el-input v-model="editPassword.oldPassword"
                        placeholder="Input old password..." show-password>
              </el-input>
              <el-input v-model="editPassword.newPassword"
                        placeholder="Input new password..."
                        style="margin-top: 10px;" show-password>
              </el-input>
              <el-input v-model="editPassword.confirmNewPassword"
                        placeholder="Input new password again..."
                        style="margin-top: 10px;" show-password>
              </el-input>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="changeDialog = false">Cancel</el-button>
            <el-button type="primary" @click="handleUpdatePassword">Confirm</el-button>
            </span>
          </el-dialog>
          <div class="personalInfoTypesetting" style="margin-bottom: 20px; margin-top: 30px">
            <el-button type="primary" @click="changeDialog = true" plain>Change Password</el-button>
          </div>

          <div class="personalInfoTypesetting personalInfoTitle"
               style="margin-top: 20px;">
            Email
          </div>
          <div class="personalInfoTypesetting"
               style="width:90%; margin-top: 20px; margin-bottom: 20px">
            <el-input v-model="newEmail"></el-input>
          </div>

          <div class="personalInfoTypesetting personalInfoTitle"
               style="margin-top: 20px;">
            Avatar
          </div>
          <div class="personalInfoTypesetting"
               style="width:90%; margin-top: 20px; margin-bottom: 20px">
            <el-input v-model="newImageUrl"></el-input>
          </div>

          <div v-if="this.roleType==='Student'">
            <div class="personalInfoTitle" style="margin-left: 20px; margin-bottom: 20px;">
              Impression Tags
            </div>
            <div class="personalInfoTypesetting">
              <el-tag :key="tag" v-for="tag in impressionTagList" closable
                      :disable-transitions="false" effect="plain"
                      @close="handleImpTagClose(tag)" class="el-tag">
                {{ tag }}
              </el-tag>
              <el-input class="input-new-tag" v-if="impTagInputVisible" v-model="impTagInputValue" ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleImpTagInputConfirm" @blur="handleImpTagInputConfirm">
              </el-input>
              <el-button v-else class="input-new-tag" size="small" @click="showImpTagInput">+ New Tag</el-button>
            </div>

            <div class="personalInfoTitle personalInfoTypesetting" style="margin-left: 20px; margin-bottom: 20px;">
              Skill Tags
            </div>
            <div class="personalInfoTypesetting">
              <el-tag :key="tag" v-for="tag in skillTagList" closable
                      :disable-transitions="false" effect="plain"
                      @close="handleSkillTagClose(tag)" class="el-tag">
                {{ tag }}
              </el-tag>
              <el-input class="input-new-tag" v-if="skillTagInputVisible" v-model="skillTagInputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleSkillTagInputConfirm" @blur="handleSkillTagInputConfirm">
              </el-input>
              <el-button v-else class="input-new-tag" size="small" @click="showSkillTagInput">+ New Tag</el-button>
            </div>

            <div class="personalInfoTypesetting personalInfoTitle">
              Bio
            </div>
            <el-input type="textarea" :rows="4" placeholder="" v-model="bio"
                      style="margin-left: 20px; margin-top: 20px; width: 90%">
            </el-input>
          </div>

          <div v-else>
            <div class="personalInfoTypesetting personalInfoTitle">
              Job number
            </div>
            <el-input v-model="tchNo" style="margin-left: 20px; margin-top: 20px; width: 90%"></el-input>

            <div class="personalInfoTypesetting personalInfoTitle"
                 style="margin-top: 20px;">
              Name
            </div>
            <el-input v-model="tchName" style="margin-left: 20px; margin-top: 20px; width: 90%"></el-input>
          </div>

          <div class="personalInfoTypesetting" style="margin-bottom: 40px; margin-top: 30px">
            <el-button type="primary" @click="handleUpdate">update</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-col>

    <el-col :span="5" :offset="1">
      <div style="margin-top: 60px; margin-left: 5px; font-weight:bold;">Profile picture</div>
      <div style="margin-top: 5px" align="left">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </el-col>
  </el-card>
</template>

<script>
import {getUserHomeInfo} from '@/api/home_page'
import {getAccountInfo, postChangePassword, postStdPersonalInfo, postTchPersonalInfo} from '@/api/account'
import {isStudent, isTeacher} from '@/utils/role'
import {validPassword} from '@/utils/validate'

export default {
  name: 'Account',
  mounted () {
    this.init()
  },
  data () {
    return {
      // tab
      tabPosition: 'left',
      activeName: 'accountInfo',

      roleType: '',

      // el-form
      formInfoList: [
        {label: 'ID', value: ''},
        {label: 'Name', value: ''},
        {label: 'Email', value: ''},
        {label: 'Type', value: ''},
        {label: 'Status', value: ''},
        {label: 'Register Time', value: ''}
      ],
      newEmail: '',
      changeDialog: false,

      // avatar uploader
      imageUrl: '',
      newImageUrl: '',

      // impression tag list
      impressionTagList: [],
      impTagInputVisible: false,
      impTagInputValue: '',

      // skill tag list
      skillTagList: [],
      skillTagInputVisible: false,
      skillTagInputValue: '',

      // textarea
      bio: '',

      editPassword: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      tchNo: '',
      tchName: '',
    }
  },
  methods: {
    init () {
      console.log('init account page')

      this.roleType = this.$store.state.role.roleType

      getAccountInfo().then(resp => {
        if (resp.data.code === 200) {
          let roleDict = resp.data.data.role

          this.formInfoList[3].value = roleDict.roleType
          this.formInfoList[4].value = roleDict.status
          this.formInfoList[5].value = roleDict.registerTime.substring(0, roleDict.registerTime.indexOf('T'))

          if (isStudent()) {
            let infoDict = resp.data.data.student

            this.bio = infoDict.bio

            this.formInfoList[0].value = infoDict.stdNo
            this.formInfoList[1].value = infoDict.stdName
            this.formInfoList[2].value = infoDict.email
            this.newEmail = infoDict.email

            if (infoDict.flags != null) {
              this.impressionTagList = JSON.parse(infoDict.flags)
            }
            if (infoDict.skills != null) {
              this.skillTagList = JSON.parse(infoDict.skills)
            }
          } else if (isTeacher()) {
            let infoDict = resp.data.data.teacher

            console.log(resp.data.data)

            this.bio = infoDict.bio

            this.formInfoList[0].value = infoDict.tchNo
            this.formInfoList[1].value = infoDict.tchName
            this.formInfoList[2].value = infoDict.email
            this.newEmail = infoDict.email
            this.tchName = infoDict.tchName
            this.tchNo = infoDict.tchNo
          }

          this.imageUrl = resp.data.data.role.iconUrl
          this.newImageUrl = resp.data.data.role.iconUrl
        } else if (resp.data.code === 400) {
          this.$message.error(resp.data.message)
        }
      }).catch(failResp => {
        this.$message.error(failResp.message)
      })
    },
    handleClose (done) {
      this.$confirm('Are you sure to close？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    // avatar uploader
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('Can only upload .jpg')
      }
      if (!isLt2M) {
        this.$message.error('Size of picture can not exceed 2MB')
      }
      return isJPG && isLt2M
    },

    // impression tag list
    handleImpTagClose (tag) {
      this.impressionTagList.splice(this.impressionTagList.indexOf(tag), 1)
    },
    showImpTagInput () {
      this.impTagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleImpTagInputConfirm () {
      let inputValue = this.impTagInputValue
      if (inputValue) {
        this.impressionTagList.push(inputValue)
      }
      this.impTagInputVisible = false
      this.impTagInputValue = ''
    },

    // skill tag list
    handleSkillTagClose (tag) {
      this.skillTagList.splice(this.skillTagList.indexOf(tag), 1)
    },
    showSkillTagInput () {
      this.skillTagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleSkillTagInputConfirm () {
      let inputValue = this.skillTagInputValue
      if (inputValue) {
        this.skillTagList.push(inputValue)
      }
      this.skillTagInputVisible = false
      this.skillTagInputValue = ''
    },

    // update personal information
    handleUpdate () {
      this.$confirm('Confirm to update?', 'Tip', {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        if (isTeacher()) {
          let acInfoStdUpdateVO = {
            'email': this.newEmail,
            'iconUrl': this.newImageUrl,
            'tchName': this.tchName,
            'tchNo': this.tchNo
          }

          postTchPersonalInfo(
            acInfoStdUpdateVO
          ).then(resp => {
            console.log('get response : ' + resp)
            if (resp.data.code === 200) {
              this.init()

              this.$message.success('Update success')
            } else if (resp.data.code === 400) {
              this.$message.error(resp.data.message)
            }
          }).catch(failResp => {
            this.$message.error(failResp.message)
          })
        } else if (isStudent()) {
          let acInfoStdUpdateVO = {
            'bio': this.bio,
            'flags': this.impressionTagList,
            'skills': this.skillTagList,
            'email': this.newEmail,
            'iconUrl': this.newImageUrl
          }

          postStdPersonalInfo(
            acInfoStdUpdateVO
          ).then(resp => {
            console.log('get response : ' + resp)
            if (resp.data.code === 200) {
              this.init()

              this.$message.success('Update success')
            } else if (resp.data.code === 400) {
              this.$message.error(resp.data.message)
            }
          }).catch(failResp => {
            this.$message.error(failResp.message)
          })
        }
      }).catch(() => {
        this.$message.info('Update canceled')
      })
    },
    isStudent () {
      return isStudent()
    },
    isTeacher () {
      return isTeacher
    },
    handleUpdatePassword () {
      // alert(validPassword(this.editPassword.oldPassword))
      // alert(validPassword(this.editPassword.newPassword))
      // alert(validPassword(this.editPassword.confirmNewPassword))
      this.$confirm('Confirm to update?', 'Tip', {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        let validOld = validPassword(this.editPassword.oldPassword)
        let validNew = validPassword(this.editPassword.newPassword)
        let validConfirm = validPassword(this.editPassword.confirmNewPassword)
        if (!validOld) {
          this.$alert('Invalid old password!Please check again!')
          return false
        }
        if (!validNew) {
          this.$alert('Invalid new password!Please check again!')
          return false
        }
        if (!validConfirm || this.editPassword.newPassword !== this.editPassword.confirmNewPassword) {
          this.$alert('Invalid repeated password!Please check again!')
          return false
        }
        postChangePassword(this.editPassword).then(resp => {
          if (resp.data.code === 200) {
            this.editPassword = {
              oldPassword: '',
              newPassword: '',
              confirmNewPassword: ''
            }
            this.$message.success('Update success')
            this.changeDialog = false
          } else if (resp.data.code === 400) {
            this.$message.error(resp.data.message)
          }
        }).catch(failResp => {
          this.$message.error(failResp.message)
        })
      }).catch(() => {
        this.$message.info('Update canceled')
      })
    }
  }
}
</script>

<style scoped>
.personalInfoTypesetting {
  margin-left: 20px;
}

.personalInfoTitle {
  font-size: 22px;
  font-weight: bold;
}

/*el-form*/
.form-item-height >>> .el-form-item__label {
  height: 20px;
  font-weight: bold;
  text-align: left;
}

.form-item-height >>> .el-form-item__content {
  height: 20px;
}

/*avatar uploader*/
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 270px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader >>> .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 270px;
  height: 270px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 270px;
  height: 270px;
  display: block;
}

/*dynamic tags*/
.el-tag {
  margin-right: 10px;
  /*margin-top: 20px;*/
  margin-bottom: 20px;
}

.input-new-tag {
  width: 90px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  vertical-align: bottom;
  margin-bottom: 20px;
}

.base-card {
  margin: 15px 10px;
  min-height: 95.2%;
}
</style>
