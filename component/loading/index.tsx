import { Spin } from 'antd';
import styles from './index.module.scss';

const Loading = () => {
  return (
    <div className={styles.spin}>
      <Spin size="large" tip="Loading">
        <div className={styles.content} />
      </Spin>
    </div>
  );
};

export default Loading;
