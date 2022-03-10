import {
  Spin
} from 'antd';
import { request,useModel,history } from 'umi';
import { useEffect } from 'react';

export default (props)=>{
  const { initialState, loading, error, refresh, setInitialState } = useModel('@@initialState');
  let { BACKEND } = initialState;

  useEffect(()=>{
    let params = props.match.params;
    let query = props.location.query;
    request(BACKEND + '/auth/oauth/' + params.platform + '/login', {
      method: 'get',
      params: query,
      credentials: 'include',
    }).then(data => {
      if (data.code === 302) {
        if (data.data.startsWith('/')) {
          history.push(data.data);
        } else {
          window.location.href = data.data;
        }
      } else if(data.code===200){
        refresh().then(()=>{
          history.push('/admin/');
        });
      } else {
        console.log(data);
      }
    }).catch(error => {
    });
  },[]);

  return (
    <div style={{ textAlign: 'center' }}>
      <Spin tip='认证中...' spinning/>
    </div>
  );
};
