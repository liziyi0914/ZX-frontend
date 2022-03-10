import {
  Button,
  Card,
  Row,
  Col,
  Space,
  Modal,
  Form,
  Table,
  Tag
} from 'antd';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { request, useModel, history } from 'umi';
import { useEffect, useRef, useState } from 'react';

let stateMap = [
  { name: '待处理', color: 'default' },
  { name: '一面', color: 'processing' },
  { name: '二面', color: 'processing' },
  { name: '已通过', color: 'success' },
  { name: '已拒绝', color: 'error' },
];

export default (props) => {
  const { initialState, loading, error, refresh, setInitialState } = useModel('@@initialState');
  let { BACKEND, isLogin } = initialState;
  const [hToken, setHToken] = useState(null);
  const [ds,setDs] = useState([]);
  const form = Form.useForm();
  let hCaptchaRef = useRef();

  return (
    <div>
      <Row justify='space-around'>
        <Col xs={24} md={18} lg={12}>
          <Card
            style={{ margin: '0.5rem' }}
          >
            <h1 style={{ textAlign: 'center' }}>报名结果查询</h1>
            <ProForm
              formRef={form}
              onFinish={values=>{
                if (hToken===null) {
                  Modal.warning({content:'请完成人机验证'});
                  return;
                }
                request(BACKEND + '/resumeState/'+values.studentId, {
                  method: 'GET',
                  params: {
                    token: hToken
                  },
                  credentials: 'include',
                }).then(data=>{
                  if (data.code===200) {
                    setDs(data?.data);
                  }
                });
                hCaptchaRef.current.resetCaptcha();
              }}
              submitter={{
                render: (props, doms) => {
                  return (
                    <div style={{ textAlign: 'center' }}>
                      <Space>
                        <Button type='primary' onClick={() => props.form?.submit?.()}>
                          提交
                        </Button>
                        <Button type='button' onClick={() => {
                          props.form?.resetFields();
                          hCaptchaRef.current.resetCaptcha();
                        }}>
                          重置
                        </Button>
                      </Space>
                    </div>
                  );
                },
              }}
            >
              <ProFormText
                name='studentId'
                label='学号'
                placeholder='请输入学号'
                rules={[
                  {
                    required: true,
                    message: '请输入学号',
                  },
                ]}
              />
              <div style={{textAlign:'center'}}>
                <HCaptcha
                  sitekey='1ce7e5a4-6d42-43a7-91e1-62e1d8675478'
                  onVerify={(token, ekey) => setHToken(token)}
                  reCaptchaCompat={false}
                  ref={hCaptchaRef}
                />
              </div>
            </ProForm>
            <br/>
            <Table
              pagination={false}
              columns={[
                {
                  title: '姓名',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '部门',
                  dataIndex: 'department',
                  key: 'department',
                },
                {
                  title: '状态',
                  dataIndex: 'state',
                  key: 'state',
                  render: (_,record)=><Tag color={stateMap[record.state].color}>{stateMap[record.state].name}</Tag>
                },
              ]}
              dataSource={ds}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
