import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, UserAuth, Article, Comment, Tag } from './entity/index'
//let connectionReadyPromise: Promise<DataSource> | null = null;

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.SQL_HOST,
  port: (process.env.SQL_PORT as unknown) as number,
  username: process.env.SQL_USER as string,
  password: process.env.SQL_PASSWORD as string,
  database: process.env.SQL_DATABASE as string,
  entities: [User, UserAuth, Article, Comment, Tag],
  synchronize: false,
  logging: true,
})

export const prepareConnenction = () => { 
    const connectionReadyPromise = (async () => {
      try {
        if(!AppDataSource.isInitialized){
          await AppDataSource.initialize();
        }
      } catch (error) {
        console.error("Error during Data Source initialization:", error);
      }

      return AppDataSource
    })();
  

  return connectionReadyPromise
};
