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
  const [stat,setStat] = useState([]);

  useEffect(()=>{
    request(BACKEND + '/statistics/', {
      method: 'GET',
      credentials: 'include',
    }).then(data=>{
      if (data.code===200) {
        setStat(data.data);
      }
    });
  },[]);

  return (
    <div>
      <Card
        title="统计"
        style={{margin:'2rem'}}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="总计" value={(stat?.[0]??0)+(stat?.[1]??0)+(stat?.[2]??0)+(stat?.[3]??0)+(stat?.[4]??0)} />
          </Col>
          <Col span={8}>
            <Statistic title="未处理" value={stat?.[0]??0} />
          </Col>
          <Col span={8}>
            <Statistic title="一面" value={stat?.[1]??0} />
          </Col>
          <Col span={8}>
            <Statistic title="二面" value={stat?.[2]??0} />
          </Col>
          <Col span={8}>
            <Statistic title="通过" value={stat?.[3]??0} />
          </Col>
          <Col span={8}>
            <Statistic title="拒绝" value={stat?.[4]??0} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};
