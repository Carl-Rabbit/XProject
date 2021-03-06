import Vue from 'vue'
import Router from 'vue-router'
// 导入刚才编写的组件
import TestPage from '@/views/test/TestPage'
import Login from '@/views/visitor/components/Login'
import Register from '@/views/visitor/components/Register'
import MainPage from '@/views/main/MainPage'
import WelcomePage from '@/views/welcome/WelcomePage'
import LRPage from "@/views/visitor/LRPage";
import ProjectList from "@/views/main/project_list/ProjectList";
import HomePage from "@/views/main/home_page/HomePage";
import Account from "@/views/main/account/Account";
import MyTeam from "@/views/main/project/team/MyTeam";
import Forming from "@/views/main/project/team/Forming";
import ProjOverview from "@/views/main/project/overview/ProjOverview";
import ProjPage from "@/views/main/project/ProjPage";
import AnnouncementStu from '@/views/main/project/announcement/AnnouncementStu'
import Gradebook from "@/views/main/project/gradebook/Gradebook";
import TeamManaging from '@/views/main/project/team/TeamManaging'
import StdManage from "@/views/main/project/std-manage/StdManage";
import Roster from "@/views/main/project/roster/Roster";
import AnnouncementTch from "@/views/main/project/announcement/AnnouncementTch";
import StuEvent from "@/views/main/project/event/StuEvent";
import TchEvent from "@/views/main/project/event/TchEvent";
import SubmissionStu from "@/views/main/project/submission/SubmissionStu";
import SubmissionTch from "@/views/main/project/submission/SubmissionTch";
import ResourcesStu from "@/views/main/project/resources/ResourcesStu";
import ResourcesTch from "@/views/main/project/resources/ResourcesTch";
import Page404 from "@/views/other/NotFound";
import PageError from "@/views/other/PageError";
import Role from "@/views/main/admin/Role";
import School from "@/views/main/admin/School";

Vue.use(Router)

// 修改路由重复点击报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/welcome',
    name: 'Welcome',
    component: WelcomePage
  },
  {
    path: '/index',
    name: 'MainPage',
    component: MainPage,
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: 'home-page',
        name: 'HomePage',
        component: HomePage,
        meta: {
          requireAuth: true
        },
      },
      {
        path: 'project-list',
        name: 'ProjectList',
        component: ProjectList,
        meta: {
          requireAuth: true
        },
      },
      {
        path: 'roster',
        name: 'Roster',
        component: Roster,
        meta: {
          requireAuth: true,
          roleType: "Teacher"
        },
      },
      {
        path: 'account',
        name: 'Account',
        component: Account,
        meta: {
          requireAuth: true
        },
      },
      {
        path: 'admin/role',
        name: 'Role',
        component: Role,
        meta: {
          requireAuth: true,
          roleType: "Admin"
        },
      },
      {
        path: 'admin/school',
        name: 'School',
        component: School,
        meta: {
          requireAuth: true,
          roleType: "Admin"
        },
      },
      {
        path: 'project/:proj_id',
        component: ProjPage,
        children: [
          {
            path: 'overview',
            name: 'ProjOverview',
            component: ProjOverview,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'my-team',
            name: 'MyTeam',
            component: MyTeam,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'forming',
            name: 'Forming',
            component: Forming,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'std-manage',
            name: 'StdManage',
            component: StdManage,
            meta: {
              requireAuth: true,
              roleType: "Teacher"
            },
          },
          {
            path: 'announcement-Stu',
            name: 'AnnouncementStu',
            component: AnnouncementStu,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'announcement-tch',
            name: 'AnnouncementTch',
            component: AnnouncementTch,
            meta: {
              requireAuth: true,
              roleType: 'Teacher'
            },
          },
          {
            path: 'event',
            name: 'StuEvent',
            component: StuEvent,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'event-tch',
            name: 'TchEvent',
            component: TchEvent,
            meta: {
              requireAuth: true,
              roleType: 'Teacher'
            },
          },
          {
            path: 'submission',
            name: 'SubmissionStu',
            component: SubmissionStu,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'submission-tch',
            name: 'SubmissionTch',
            component: SubmissionTch,
            meta: {
              requireAuth: true,
              roleType: 'Teacher'
            },
          },
          {
            path: 'resources',
            name: 'ResourcesStu',
            component: ResourcesStu,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'resources-tch',
            name: 'ResourcesTch',
            component: ResourcesTch,
            meta: {
              requireAuth: true,
              roleType: 'Teacher'
            },
          },
          {
            path: 'gradebook',
            name: 'Gradebook',
            component: Gradebook,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'team-managing',
            name: 'TeamManaging',
            component: TeamManaging,
            meta: {
              requireAuth: true
            },
          },
        ]
      }
    ]
  },
  {
    path: '/visitor',
    name: 'Visitor',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      }
    ],
    component: LRPage
  },
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/404',
    name: '404',
    component: PageError
  },
  {
    path: '*',
    redirect: '/404'
  },
  // YZX: 有用的放到这个上面，临时的放到下面
  {
    path: '/test',
    name: 'TestPage',
    component: TeamManaging
    // meta: {
    //   requireAuth: true
    // }
  }
]

export default new Router({
  mode: 'history',
  routes
})
