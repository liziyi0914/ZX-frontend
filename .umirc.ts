import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  layout:{
    name: '招新平台'
  },
  dynamicImport: {
    loading: '@/Loading',
  },
  headScripts: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-KBFDECLT9B',
      async: true
    },
    {
      content: `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-KBFDECLT9B');
                var _hmt = _hmt || [];
                (function() {
                  var hm = document.createElement("script");
                  hm.src = "https://hm.baidu.com/hm.js?cb966d778f1df6f3f5280c93bf137764";
                  var s = document.getElementsByTagName("script")[0];
                  s.parentNode.insertBefore(hm, s);
                })();`
    }
  ],
  routes: [
    {
      path: '/login',
      component: '@/pages/login',
      menuRender: false
    },
    {
      path: '/submit',
      component: '@/pages/submit',
      menuRender: false,
      headerRender: false,
    },
    {
      path: '/submitjf',
      component: '@/pages/submit',
      menuRender: false,
      headerRender: false,
    },
    {
      path: '/submitst',
      component: '@/pages/submit',
      menuRender: false,
      headerRender: false,
    },
    {
      path: '/search',
      component: '@/pages/search',
      menuRender: false,
      headerRender: false,
    },
    {
      path: '/auth/:platform',
      component: '@/pages/auth',
      menuRender: false
    },
    {
      path: '/admin/',
      component: '@/pages/admin/index',
      name: '统计',
      icon: 'Stock',
      access: 'isLogin'
    },
    {
      path: '/admin/resume',
      component: '@/pages/admin/resume',
      name: '报名详情',
      icon: 'Bars',
      access: 'isLogin'
    },
    {
      path: '/admin/checkin',
      component: '@/pages/admin/checkin',
      name: '签到',
      icon: 'Qrcode',
      access: 'isLogin'
    },
    {
      path: '/admin/finance',
      component: '@/pages/admin/finance',
      name: '额度',
      icon: 'PayCircle',
      access: 'isLogin'
    },
    {
      path: '/checkin/:accesstoken',
      component: '@/pages/checkin',
      menuRender: false,
      headerRender: false,
    },
  ],
  fastRefresh: {},
});
