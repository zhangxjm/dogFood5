export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/courses/index',
    'pages/enrollment/index',
    'pages/attendance/index',
    'pages/mine/index',
    'pages/course-detail/index',
    'pages/schedule-detail/index',
    'pages/enrollment-confirm/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF7A45',
    navigationBarTitleText: '亲子手工课',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FFF9F5'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#FF7A45',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/courses/index',
        text: '课程'
      },
      {
        pagePath: 'pages/enrollment/index',
        text: '报名'
      },
      {
        pagePath: 'pages/attendance/index',
        text: '考勤'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
