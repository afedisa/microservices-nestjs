import { RabbitServiceName } from '@app/rabbit';
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Location Member Gateway')
@Controller({
  path: '/location-member',
  version: '1',
})
export class LocationMemberGatewayController {
  constructor(
    @Inject(RabbitServiceName.LOCATION) private locationClient: ClientProxy,
  ) {}

  @Get('/')
  async getMembers() {
    console.log('getMembers');
  }
}
