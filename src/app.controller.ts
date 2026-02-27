import { Controller } from '@nestjs/common';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}
  // @Get('/')
  // getHello2(): string {
  //   return this.appService.getHello2();
  // }
  // @Get('/marek/:ksywka')
  // getHello(@Req() request: Request) {
  //   // return this.appService.getHello();
  //   return { wybrano: request.params.ksywka, dodatki: request.query };
  // }
  // @Get('/data')
  // getData(
  //   @Query('page') qPage: string | undefined,
  //   @Query('size') qSize: string | undefined,
  // ) {
  //   const page = Number(qPage) || 0;
  //   const size = Number(qSize) || 5;
  //   return this.appService.getData(page, size);
  // }
}
