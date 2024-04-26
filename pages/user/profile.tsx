import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Input, Button, message } from 'antd';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import { useGetData, usePostData } from 'hooks/useRequest';

interface Info {
  id: number
  nickname: string;
  job: string;
  introduce: string;
}

interface IUser {
  userInfo: Info;
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 10 },
};

const UserProfile = () => {
  const [form] = Form.useForm();
  const { push } = useRouter();
  const [id, setId] = useState(0);

  const { data } = useGetData<IUser>({ url: '/api/user/detail' });
  form.setFieldsValue(data?.userInfo);
  setId(Number(data?.userInfo?.id));

  const { trigger } =usePostData({
    url:'/api/user/update',
    method:"POST"
  },{
    onSuccess(res){
      if (res?.code === 0) {
        message.success('修改成功');
        push(`/user/${id}`);
      } 
    }
  })

  const handleSubmit = (values: any) => {
    trigger({
      ...values
    })
  };

  return (
    <div className="content-layout">
      <div className={styles.userProfile}>
        <h2>个人资料</h2>
        <div>
          <Form
            {...layout}
            form={form}
            className={styles.form}
            onFinish={handleSubmit}
          >
            <Form.Item label="用户名" name="nickname">
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item label="职位" name="job">
              <Input placeholder="请输入职位" />
            </Form.Item>
            <Form.Item label="个人介绍" name="introduce">
              <Input placeholder="请输入个人介绍" />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default observer(UserProfile);
