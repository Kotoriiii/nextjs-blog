import 'reflect-metadata';
import { Connection, getConnection, createConnection } from 'typeorm';
import { User, UserAuth, Article, Comment, Tag } from './entity/index'

let connectionReadyPromise: Promise<Connection> | null = null;

export const prepareConnenction = () => { 
    connectionReadyPromise = (async () => {
      try {
        const staleConnection = getConnection();
        await staleConnection.close();
      } catch (err) {
        console.log(err);
      }

      const connenction = await createConnection({
        type: 'mysql',
        host: process.env.SQL_HOST,
        port: (process.env.SQL_PORT as unknown) as number,
        username: process.env.SQL_USER as string,
        password: process.env.SQL_PASSWORD as string,
        database: process.env.SQL_DATABASE as string,
        entities: [User, UserAuth, Article, Comment, Tag],
        synchronize: false,
        logging: true,
      });

      return connenction;
    })();
  

  return connectionReadyPromise
};
