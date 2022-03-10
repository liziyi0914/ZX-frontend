import {
  Button,
  Card,
  Row,
  Col,
  Space,
  Modal,
  Form,
} from 'antd';
import ProForm, {
  ProFormText,
} from '@ant-design/pro-form';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { request, useModel, history } from 'umi';
import { useEffect, useRef, useState } from 'react';

export default (props) => {
  const { initialState, loading, error, refresh, setInitialState } = useModel('@@initialState');
  let { BACKEND, isLogin } = initialState;
  const [isLoading, setIsLoading] = useState(false);
  const [checkInfo,setCheckInfo] = useState({});

  let form = useRef();
  let hCaptchaRef = useRef();

  useEffect(()=>{
    request(BACKEND+'/checkin/',{
      method: 'GET',
      params: {
        accesstoken: props.match.params.accesstoken
      },
      credentials: 'include',
    }).then(data=>{
      if (data.code===200) {
        setCheckInfo(data.data);
      } else {
        Modal.error({ content: data.data });
      }
    });
  },[]);

  return (
    <div>
      <Row justify='space-around'>
        <Col xs={24} md={18} lg={12}>
          <Card
            style={{ margin: '0.5rem' }}
          >
            <h1 style={{ textAlign: 'center' }}>签到</h1>
            <h2 style={{ textAlign: 'center' }}>{checkInfo?.dept??''} - {checkInfo?.step===1?'一面':'二面'}</h2>
            <ProForm
              formRef={form}
              onFinish={values => {
                setIsLoading(true);
                request(BACKEND + '/checkin/', {
                  method: 'POST',
                  params: {
                    ...values,
                    accesstoken: props.match.params.accesstoken,
                  },
                  credentials: 'include',
                }).then(data => {
                  if (data.code === 200) {
                    Modal.success({ content: '签到成功' });
                    form.current.resetFields();
                  } else if (data.code === 400) {
                    Modal.error({ content: data.data });
                  } else {
                    Modal.error({ content: '提交失败' });
                  }
                }).finally(() => {
                  setIsLoading(false);
                });
              }}
              submitter={{
                render: (props, doms) => {
                  return (
                    <div style={{ textAlign: 'center' }}>
                      <Space>
                        <Button type='primary' onClick={() => props.form?.submit?.()} loading={isLoading}>
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
                name='name'
                label='姓名'
                placeholder='请输入姓名'
                rules={[
                  {
                    required: true,
                    message: '请输入姓名',
                  },
                  {
                    min: 2,
                    max: 10,
                    message: '错误的姓名',
                  },
                ]}
              />
              <ProFormText
                name='phone'
                label='手机号后四位'
                placeholder='请输入手机号后四位'
                rules={[
                  {
                    required: true,
                    message: '请输入手机号后四位',
                  },
                  {
                    len: 4,
                    message: '错误的内容',
                  },
                ]}
              />
            </ProForm>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
