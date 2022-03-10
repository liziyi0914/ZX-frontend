import {
  Button,
  Card,
  Modal,
  Space,
  Popconfirm,
  message, Tag,
} from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { request, useModel } from 'umi';
import moment from 'moment';
import ExcelJS from 'exceljs';

export default (props) => {
  const { initialState, loading, error, refresh, setInitialState } = useModel('@@initialState');
  let { BACKEND } = initialState;
  const [tab, setTab] = useState('s0');
  const [visible, setVisible] = useState(-1);
  const [confirmLoading, setConfirmLoading] = useState(-1);
  const [visible2, setVisible2] = useState(-1);
  const [confirmLoading2, setConfirmLoading2] = useState(-1);
  const [resumeData, setResumeData] = useState([]);
  const [exporting, setExporting] = useState(false);
  let actionRef = useRef();

  return (
    <Card
      style={{ width: '100%' }}
      tabList={[
        { key: 's0', tab: '已报名' },
        { key: 's1', tab: '一面' },
        { key: 's2', tab: '二面' },
        { key: 's3', tab: '已录用' },
        { key: 's4', tab: '已拒绝' },
      ]}
      activeTabKey={tab}
      onTabChange={key => {
        setTab(key);
        actionRef.current.reload();
      }}
    >
      <ProTable
        actionRef={actionRef}
        rowKey='id'
        request={async (params, sorter, filter) => {
          let data = await request(BACKEND + '/resume/', {
            method: 'GET',
            params: {
              pageSize: params.pageSize,
              current: params.current - 1,
              state: parseInt(tab[1]),
            },
            credentials: 'include',
          });
          setResumeData(data?.data);
          return Promise.resolve({
            data: data?.data,
            success: data.code === 200,
            total: data?.total,
          });
        }}
        pagination={{
          showQuickJumper: true,
        }}
        search={false}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
            valueType: 'id',
          },
          {
            title: '姓名',
            dataIndex: 'name',
          },
          {
            title: '学号',
            dataIndex: 'studentId',
          },
          {
            title: '学院',
            dataIndex: 'academy',
          },
          {
            title: '班级',
            dataIndex: 'cls',
          },
          {
            title: '手机',
            dataIndex: 'phone',
          },
          {
            title: '邮箱',
            dataIndex: 'email',
          },
          {
            title: '自我介绍',
            dataIndex: 'introduce',
            render: (_, record) => (
              <Button
                type='link'
                onClick={() => Modal.info({
                  content: record.introduce,
                  icon: null,
                  maskClosable: true,
                })}
              >
                详情
              </Button>
            ),
          },
          {
            title:'签到',
            dataIndex: 'checkin',
            render: (_,record)=>(
              (tab === 's1' || tab === 's2')?((record.checkin&(tab==='s1'?1:2))!==0?<Tag color="success">已签到</Tag>:<Tag color="error">未签到</Tag>):'-'
            )
          },
          {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => (
              <Space>
                {(tab === 's0' || tab === 's1') ? <ModalForm
                  title='面试详情'
                  trigger={
                    <Button type='primary'>{tab === 's0' ? '一面' : '二面'}</Button>
                  }
                  initialValues={{ location: initialState.interviewLocation, time: initialState.interviewTime }}
                  onFinish={async (values) => {
                    setInitialState({
                      ...initialState,
                      interviewLocation: values.location,
                      interviewTime: values.time,
                    });
                    let dataA = await request(BACKEND + '/resumeState/' + record.id, {
                      method: 'POST',
                      params: {
                        newState: tab === 's0' ? 1 : 2,
                      },
                      credentials: 'include',
                    });
                    if (dataA.code === 200) {
                      let dataB = await request(BACKEND + '/msg/send', {
                        method: 'POST',
                        data: {
                          location: values.location,
                          time: moment(values.time).format('MM月DD日 H:mm'),
                          resumeId: record.id,
                          type: tab === 's0' ? 1 : 2,
                        },
                        credentials: 'include',
                      });
                    }
                    actionRef.current.reload();
                    return true;
                  }}
                >
                  <ProFormText
                    name='location'
                    label='面试地点'
                    placeholder='请输入面试地点'
                    rules={[
                      {
                        required: true,
                        message: '请输入面试地点',
                      },
                      {
                        max: 12,
                        message: '地点太长了，最多12个字',
                      },
                    ]}
                  />
                  <ProFormDateTimePicker
                    name='time'
                    label='面试时间'
                    showTime={{ format: 'HH:mm' }}
                    format='YYYY-MM-DD HH:mm'
                    rules={[
                      {
                        required: true,
                        message: '请选择面试时间',
                      },
                    ]}
                  />
                </ModalForm> : null}
                {(tab === 's1' || tab === 's2') ? <Popconfirm
                  title='确定录用？'
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  okButtonProps={{ danger: true, loading: confirmLoading === record.id }}
                  visible={visible === record.id}
                  onCancel={() => setVisible(-1)}
                  onConfirm={() => {
                    setConfirmLoading(record.id);
                    request(BACKEND + '/resumeState/' + record.id, {
                      method: 'POST',
                      params: {
                        newState: 3,
                      },
                      credentials: 'include',
                    }).then(data => {
                      if (data.code === 200) {
                        message.info('消息推送中...', 5);
                        request(BACKEND + '/msg/send', {
                          method: 'POST',
                          data: {
                            resumeId: record.id,
                            type: 3,
                          },
                          credentials: 'include',
                        }).then(data => {
                          setConfirmLoading(-1);
                          setVisible(-1);
                          actionRef.current.reload();
                        });
                      }
                    });
                  }}
                >
                  <Button onClick={() => setVisible(record.id)}>录用</Button>
                </Popconfirm> : null}
                {(tab === 's4' || tab === 's3') ? null : <Popconfirm
                  title='确定拒绝？'
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  okButtonProps={{ danger: true, loading: confirmLoading2 === record.id }}
                  visible={visible2 === record.id}
                  onCancel={() => setVisible2(-1)}
                  onConfirm={() => {
                    setConfirmLoading2(record.id);
                    request(BACKEND + '/resumeState/' + record.id, {
                      method: 'POST',
                      params: {
                        newState: 4,
                      },
                      credentials: 'include',
                    }).then(data => {
                      if (data.code === 200) {
                        message.info('消息推送中...', 5);
                        request(BACKEND + '/msg/send', {
                          method: 'POST',
                          data: {
                            resumeId: record.id,
                            type: 4,
                          },
                          credentials: 'include',
                        }).then(data => {
                          setConfirmLoading2(-1);
                          setVisible2(-1);
                          actionRef.current.reload();
                        });
                      }
                    });
                  }}
                >
                  <Button danger onClick={() => setVisible2(record.id)}>拒绝</Button>
                </Popconfirm>}
              </Space>
            ),
          },
        ]}
        toolBarRender={() => (
          <Button
            loading={exporting}
            onClick={async () => {
              setExporting(true);
              let data = await request(BACKEND + '/resume/', {
                method: 'GET',
                params: {
                  pageSize: 0,
                  current: -1,
                  state: parseInt(tab[1]),
                },
                credentials: 'include',
              });
              let map = {
                s0: '已报名',
                s1: '一面',
                s2: '二面',
                s3: '已录用',
                s4: '已拒绝',
              };
              let workbook = new ExcelJS.Workbook();
              let sheet = workbook.addWorksheet(map[tab]);
              sheet.columns = [
                {
                  header: 'ID',
                  key: 'id',
                },
                {
                  header: '姓名',
                  key: 'name',
                },
                {
                  header: '学号',
                  key: 'studentId',
                },
                {
                  header: '学院',
                  key: 'academy',
                },
                {
                  header: '班级',
                  key: 'cls',
                },
                {
                  header: '手机',
                  key: 'phone',
                },
                {
                  header: '邮箱',
                  key: 'email',
                },
                {
                  header: '自我介绍',
                  key: 'introduce',
                },
                {
                  header: '创建时间',
                  key: 'gmt_create',
                },
                {
                  header: '更新时间',
                  key: 'gmt_modified',
                },
              ];
              sheet.addRows(data.data);
              workbook.xlsx.writeBuffer().then((buf) => {
                let blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
                const downloadElement = document.createElement('a');
                let href = window.URL.createObjectURL(blob);
                downloadElement.href = href;
                downloadElement.download = '导出.xlsx';
                document.body.appendChild(downloadElement);
                downloadElement.click();
                document.body.removeChild(downloadElement);
                window.URL.revokeObjectURL(href);
                setExporting(false);
              });
            }}
          >导出</Button>
        )}
      />
    </Card>
  );
};
