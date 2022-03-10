import {
  Button,
  Card,
  Radio,
  Space,
  Popconfirm,
  message,
} from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { request, useModel } from 'umi';
import moment from 'moment';
import {useInterval} from 'react-use';
import QRCode  from 'qrcode.react';

export default (props) => {
  const { initialState, loading, error, refresh, setInitialState } = useModel('@@initialState');
  let { BACKEND } = initialState;
  const [tab, setTab] = useState('s0');
  const [type, setType] = useState(0);
  const [url,setUrl] = useState('');
  const [update,setUpdate] = useState(0);

  useEffect(()=>{
    request(BACKEND+'/checkin/'+(type===0?'dtoken':'stoken')+'/'+(tab==='s0'?'1':'2'),{
      method: 'GET',
      credentials: 'include',
    }).then(data=>{
      if (data.code===200) {
        console.log('https://zx.liziyi0914.com/checkin/'+data.data)
        setUrl('https://zx.liziyi0914.com/checkin/'+data.data);
      }
    });
  },[tab,type,update]);

  useInterval(()=>{
    setUpdate((update+1)%10);
  },type===0?3*60*1000:null);

  return (
    <Card
      style={{ width: '100%' }}
      tabList={[
        { key: 's0', tab: '一面' },
        { key: 's1', tab: '二面' }
      ]}
      activeTabKey={tab}
      onTabChange={key => {
        setTab(key);
      }}
    >
      <Radio.Group
        options={[
          {
            label: '临时',
            value: 0
          },
          {
            label: '长期',
            value: 1
          }
        ]}
        onChange={e=>setType(e.target.value)}
        value={type}
        optionType="button"
        buttonStyle="solid"
      />
      <br/>
      <br/>
      <QRCode
        value={url}
      />
    </Card>
  );
};
