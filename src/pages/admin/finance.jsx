import {
  Button,
  Card,
  Row,
  Col,
  Statistic
} from 'antd';
import { request,useModel,history } from 'umi';
import { useEffect, useState } from 'react';

export default (props)=>{
  const { initialState, loading, error, refresh, setInitialState } = useModel('@@initialState');
  let { BACKEND,isLogin } = initialState;
  const [finance,setFinance] = useState({});

  useEffect(()=>{
    request(BACKEND + '/finance/', {
      method: 'GET',
      credentials: 'include',
    }).then(data=>{
      if (data.code===200) {
        setFinance(data.data);
      }
    });
  },[]);

  return (
    <div>
      <Card
        title="状态"
        style={{margin:'2rem'}}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="短信" value={finance.enableSms?'开启':'关闭'} />
          </Col>
          <Col span={12}>
            <Statistic title="邮件" value={finance.enableEmail?'开启':'关闭'} />
          </Col>
        </Row>
      </Card>
      <Card
        title="剩余额度"
        style={{margin:'2rem'}}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="短信" value={finance.sms} />
          </Col>
          <Col span={12}>
            <Statistic title="邮件" value={finance.email} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};
