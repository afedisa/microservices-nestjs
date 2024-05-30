import { RabbitServiceName } from '@app/rabbit';
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Organization Member Gateway')
@Controller({
  path: '/organization-member',
  version: '1',
})
export class OrganizationMemberGatewayController {
  constructor(
    @Inject(RabbitServiceName.ORGANIZATION) private organizationClient: ClientProxy,
  ) {}

  @Get('/')
  async getMembers() {
    console.log('getMembers');
  }
}
