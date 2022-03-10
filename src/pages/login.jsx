import {
  Button,
  Card,
  Row,
  Col
} from 'antd';
import { request,useModel,history } from 'umi';

export default (props)=>{
  const { initialState, loading, error, refresh, setInitialState } = useModel('@@initialState');
  let { BACKEND,isLogin } = initialState;

  if (isLogin) {
    history.push('/admin/');
  }

  return (
    <Row justify="space-around">
      <Col xs={24} sm={18} md={12}>
        <Card style={{textAlign:'center',margin:'1rem'}}>
          <h1>登录</h1>
          <Button type="primary" onClick={()=>{
            request(BACKEND+'/auth/oauth/wechatEnterprise/login',{
              method:'GET',
              credentials: 'include',
            }).then(data=>{
              if (data.code===302) {
                location.href = data.data;
              }
            });
          }}>企业微信</Button>
        </Card>
      </Col>
    </Row>
  );
};
