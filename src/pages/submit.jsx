import {
  Button,
  Card,
  Row,
  Col,
  Space,
  Modal,
  Form,
  Cascader,
} from 'antd';
import ProForm, {
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { request, useModel, history } from 'umi';
import { useEffect, useRef, useState } from 'react';

export default (props) => {
  const { initialState, loading, error, refresh, setInitialState } = useModel('@@initialState');
  let { BACKEND, isLogin } = initialState;
  const [hToken, setHToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [departments,setDepartments] = useState([
    {
      value: -1,
      label: '融媒体中心',
      children: [
        {
          value: 4,
          label: '技术组',
        },
        {
          value: 17,
          label: '设计组',
        },
      ],
    },
    {
      value: 6,
      label: '事务部',
    },
    {
      value: 7,
      label: '宣传部',
    },
    {
      value: -3,
      label: '学术科技部',
      children: [
        {
          value: 8,
          label: '活动组',
        },
        {
          value: 18,
          label: '事务组',
        },
        {
          value: 19,
          label: '宣传组',
        },
      ],
    },
    {
      value: 10,
      label: '校园文化部',
    },
    /*{
      value: -2,
      label: '社团管理部',
      children: [
        {
          value: 9,
          label: '人力资源部',
        },
        {
          value: 11,
          label: '调研纪检部',
        },
        {
          value: 12,
          label: '活动企划部',
        },
        {
          value: 13,
          label: '办公室',
        },
        {
          value: 14,
          label: '网络宣传部',
        },
        {
          value: 15,
          label: '体育部',
        },
        {
          value: 16,
          label: '公共关系部',
        },
      ],
    }*/
  ]);

  let form = useRef();
  let hCaptchaRef = useRef();

  useEffect(()=>{
    if (history.location.pathname==='/submitjf') {
      setDepartments([
        {
          value: -4,
          label: '广药计算机学生服务队',
          children: [
            {
              value: 20,
              label: '网络部',
            },
            {
              value: 21,
              label: '技术部',
            },
            {
              value: 22,
              label: '策划部',
            },
          ],
        },]);
    } else if(history.location.pathname==='/submitst') {
      setDepartments([
        {
          value: -5,
          label: '文学社',
          children: [
            {
              value: 24,
              label: '公关部',
            },
            {
              value: 25,
              label: '宣传部',
            },
            {
              value: 26,
              label: '编辑部',
            },
          ],
        },]);
    }
  },[]);

  return (
    <div>
      <Row justify='space-around'>
        <Col xs={24} md={18} lg={12}>
          <Card
            style={{ margin: '0.5rem' }}
          >
            <h1 style={{ textAlign: 'center' }}>报名表</h1>
            <ProForm
              formRef={form}
              onFinish={values => {
                setIsLoading(true);
                if (hToken === null) {
                  setIsLoading(false);
                  Modal.warning({ content: '请完成人机验证' });
                  return;
                }
                let d = values.department;
                let department = d[0] < 0 ? d[1] : d[0];
                values.department = department;
                request(BACKEND + '/resume/', {
                  method: 'POST',
                  data: {
                    ...values,
                    academy: values.cls2[0],
                    cls: values.cls2[2],
                    token: hToken,
                  },
                  credentials: 'include',
                }).then(data => {
                  if (data.code === 200) {
                    Modal.success({ content: '提交成功' });
                    form.current.resetFields();
                  } else if (data.code === 400) {
                    Modal.error({ content: data.data });
                  } else {
                    Modal.error({ content: '提交失败' });
                  }
                }).finally(() => {
                  hCaptchaRef.current.resetCaptcha();
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
                name='studentId'
                label='学号'
                placeholder='请输入学号'
                rules={[
                  {
                    required: true,
                    message: '请输入学号',
                  },
                  {
                    len: 10,
                    message: '错误的学号',
                  },
                ]}
              />
              <Form.Item
                name='cls2'
                label='班级'
                rules={[
                  {
                    required: true,
                    message: '请选择班级',
                  },
                ]}
              >
                <Cascader options={[
                  {
                    value: '药学院',
                    label: '药学院',
                    children: [
                      {
                        value: '药学类',
                        label: '药学类',
                        children: [
                          {
                            value: '药学类21(1)',
                            label: '21(1)',
                          },
                          {
                            value: '药学类21(2)',
                            label: '21(2)',
                          },
                          {
                            value: '药学类21(3)',
                            label: '21(3)',
                          },
                          {
                            value: '药学类21(4)',
                            label: '21(4)',
                          },
                          {
                            value: '药学类21(5)',
                            label: '21(5)',
                          },
                          {
                            value: '药学类21(6)',
                            label: '21(6)',
                          },
                          {
                            value: '药学类21(7)',
                            label: '21(7)',
                          },
                          {
                            value: '药学类21(8)',
                            label: '21(8)',
                          },
                          {
                            value: '药学类21(9)',
                            label: '21(9)',
                          },
                        ],
                      },
                      {
                        value: '制药工程',
                        label: '制药工程',
                        children: [
                          {
                            value: '制药工程21(1)',
                            label: '21(1)',
                          },
                          {
                            value: '制药工程21(2)',
                            label: '21(2)',
                          },
                        ],
                      },
                      {
                        value: '药学（国际班）',
                        label: '药学（国际班）',
                        children: [
                          {
                            value: '药学（国际班）21',
                            label: '21',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    value: '中药学院',
                    label: '中药学院',
                    children: [
                      {
                        value: '中药学类',
                        label: '中药学类',
                        children: [
                          {
                            value: '中药学类21(1)',
                            label: '21(1)',
                          },
                          {
                            value: '中药学类21(2)',
                            label: '21(2)',
                          },
                          {
                            value: '中药学类21(3)',
                            label: '21(3)',
                          },
                          {
                            value: '中药学类21(4)',
                            label: '21(4)',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    value: '临床药学院',
                    label: '临床药学院',
                    children: [
                      {
                        value: '临床药学',
                        label: '临床药学',
                        children: [
                          {
                            value: '临床药学21(1)',
                            label: '21(1)',
                          },
                          {
                            value: '临床药学21(2)',
                            label: '21(2)',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    value: '公共卫生学院',
                    label: '公共卫生学院',
                    children: [
                      {
                        value: '预防医学',
                        label: '预防医学',
                        children: [
                          {
                            value: '预防医学(1)',
                            label: '21(1)',
                          },
                          {
                            value: '预防医学(2)',
                            label: '21(2)',
                          },
                          {
                            value: '预防医学(3)',
                            label: '21(3)',
                          },
                          {
                            value: '预防医学(4)',
                            label: '21(4)',
                          },
                        ],
                      },
                      {
                        value: '卫生检验与检疫',
                        label: '卫生检验与检疫',
                        children: [
                          {
                            value: '卫生检验与检疫21(1)',
                            label: '21(1)',
                          },
                          {
                            value: '卫生检验与检疫21(2)',
                            label: '21(2)',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    value: '临床医学院',
                    label: '临床医学院',
                    children: [
                      {
                        value: '临床医学',
                        label: '临床医学',
                        children: [
                          {
                            value: '临床医学21(1)',
                            label: '21(1)',
                          },
                          {
                            value: '临床医学21(2)',
                            label: '21(2)',
                          },
                          {
                            value: '临床医学21(3)',
                            label: '21(3)',
                          },
                          {
                            value: '临床医学21(4)',
                            label: '21(4)',
                          },
                        ],
                      },
                      {
                        value: '口腔医学',
                        label: '口腔医学',
                        children: [
                          {
                            value: '口腔医学21',
                            label: '21',
                          },
                        ],
                      },
                      {
                        value: '医学检验技术',
                        label: '医学检验技术',
                        children: [
                          {
                            value: '医学检验技术21(1)',
                            label: '21(1)',
                          },
                          {
                            value: '医学检验技术21(2)',
                            label: '21(2)',
                          },
                        ],
                      },
                      {
                        value: '中西医临床医学',
                        label: '中西医临床医学',
                        children: [
                          {
                            value: '中西医临床医学21',
                            label: '21',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    value: '医药信息工程学院',
                    label: '医药信息工程学院',
                    children: [
                      {
                        value: '计算机科学与技术（外包特色班）',
                        label: '计算机科学与技术（外包特色班）',
                        children: [
                          {
                            value: '计算机科学与技术（外包特色班）21',
                            label: '21',
                          },
                        ],
                      },
                      {
                        value: '生物信息学',
                        label: '生物信息学',
                        children: [
                          {
                            value: '生物信息学21(1)',
                            label: '21(1)',
                          },
                          {
                            value: '生物信息学21(2)',
                            label: '21(2)',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    value: '生命科学与生物制药学院',
                    label: '生命科学与生物制药学院',
                    children: [
                      {
                        value: '生物科学类',
                        label: '生物科学类',
                        children: [
                          {
                            value: '生物科学类21(1)',
                            label: '21(1)',
                          },
                          {
                            value: '生物科学类21(2)',
                            label: '21(2)',
                          },
                          {
                            value: '生物科学类21(3)',
                            label: '21(3)',
                          },
                          {
                            value: '生物科学类21(4)',
                            label: '21(4)',
                          },
                        ],
                      },
                      {
                        value: '生物工程类',
                        label: '生物工程类',
                        children: [
                          {
                            value: '生物工程类21(1)',
                            label: '21(1)',
                          },
                          {
                            value: '生物工程类21(2)',
                            label: '21(2)',
                          },
                          {
                            value: '生物工程类21(3)',
                            label: '21(3)',
                          },
                          {
                            value: '生物工程类21(4)',
                            label: '21(4)',
                          },
                        ],
                      },
                      {
                        value: '海洋药学',
                        label: '海洋药学',
                        children: [
                          {
                            value: '海洋药学21',
                            label: '21',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    value: '外国语学院',
                    label: '外国语学院',
                    children: [
                      {
                        value: '英语',
                        label: '英语',
                        children: [
                          {
                            value: '英语21(1)',
                            label: '21(1)',
                          },
                          {
                            value: '英语21(2)',
                            label: '21(2)',
                          },
                          {
                            value: '英语21(3)',
                            label: '21(3)',
                          },
                          {
                            value: '英语21(4)',
                            label: '21(4)',
                          },
                        ],
                      },
                    ],
                  },
                ]} />
              </Form.Item>
              <ProFormText
                name='phone'
                label='手机号'
                placeholder='请输入手机号'
                rules={[
                  {
                    required: true,
                    message: '请输入手机号',
                  },
                  {
                    pattern: /^(1[3-9][0-9])\d{8}$/,
                    message: '错误的手机号',
                  },
                ]}
              />
              <ProFormText
                name='email'
                label='邮箱'
                placeholder='请输入邮箱'
                rules={[
                  {
                    required: true,
                    message: '请输入邮箱',
                  },
                  {
                    type: 'email',
                    message: '错误的邮箱',
                  },
                ]}
              />
              <Form.Item
                name='department'
                label='部门'
                rules={[
                  {
                    required: true,
                    message: '请选择部门',
                  },
                ]}
              >
                <Cascader options={departments} />
              </Form.Item>
              <ProFormTextArea
                name='introduce'
                label='自我介绍'
                placeholder='请输入自我介绍'
                rules={[
                  {
                    required: true,
                    message: '请输入自我介绍',
                  },
                  {
                    max: 500,
                    message: '错误的自我介绍',
                  },
                ]}
              />
              <div style={{ textAlign: 'center' }}>
                <HCaptcha
                  sitekey='1ce7e5a4-6d42-43a7-91e1-62e1d8675478'
                  onVerify={(token, ekey) => setHToken(token)}
                  reCaptchaCompat={false}
                  ref={hCaptchaRef}
                />
              </div>
            </ProForm>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
