import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService {
  constructor(private sequelize: Sequelize) {}
  // getHello() {
  //   return { message: 'siema eniu', fucks: [] };
  // }
  // getHello2(): string {
  //   return 'Hello world';
  // }
  // getData(page: number, size: number) {
  //   const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  //   const start = page * size;
  //   const end = (page + 1) * size;
  //   return data.slice(start, end);
  // }
}
