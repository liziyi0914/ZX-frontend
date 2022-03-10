import { request, history } from 'umi';
import React from 'react';
import {
  BasicLayoutProps,
  Settings as LayoutSettings,
} from '@ant-design/pro-layout';
import moment from 'moment';

export const layout = ({
                         initialState,
                         loading,
                         error,
                         refresh,
                         setInitialState,
                       }) => {
  return {
    headerTitleRender: initialState => <div>123</div>,
    headerContentRender: () => initialState.isLogin ? <h1>{initialState?.dept ?? ''}</h1> : null,
    footerRender: () => <div style={{ textAlign: 'center' }}>LNightStudio ©2021 Created by liziyi0914 <a
      href='https://beian.miit.gov.cn/'>粤ICP备2021031980号</a></div>,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (location.pathname.startsWith('/admin')) {
        if (!initialState.isLogin) {
          request(initialState.BACKEND + '/user/', {
            method: 'get',
            credentials: 'include',
          }).then(data => {
            if (data.code === 200) {
              setInitialState({
                ...initialState,
                ...data.data,
                isLogin: true
              });
            } else {
              history.push('/login');
            }
          });
        }
      }
    },
    logout: () => {
      request(initialState.BACKEND + '/auth/logout', {
        method: 'get',
        credentials: 'include',
      }).then(data => {
        refresh();
      });
    },
  };
};

export async function getInitialState() {
  let BACKEND = 'https://zxapi.liziyi0914.com';
  return {
    isLogin: false,
    BACKEND: BACKEND,
    interviewLocation: '',
    interviewTime: moment().toString(),
  };
}
