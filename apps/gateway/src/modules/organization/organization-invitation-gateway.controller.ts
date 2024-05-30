import { Auth, CurrentUser } from '@app/authentication';
import { RabbitServiceName } from '@app/rabbit';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrganizationInvitationDto } from 'apps/organization/src/dto/invitation/create-organization-invitation.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';

@ApiTags('Organization Invitation Gateway')
@Controller({
  path: '/organization-invitation',
  version: '1',
})
@Auth()
export class OrganizationInvitationGatewayController {
  constructor(
    @Inject(RabbitServiceName.ORGANIZATION) private organizationClient: ClientProxy,
  ) {}

  // TODO

  @Get('/:id')
  async getInvitationById(@Param('id', ParseUUIDPipe) id: string) {
    console.log('id', id);
  }

  @Get('/code/:code')
  async getInvitationByCode(@Param('code') code: string) {
    console.log('code', code);
  }

  @Post('/')
  async createInvitation(
    @Body() createDto: CreateOrganizationInvitationDto,
    @CurrentUser() user: UserEntity,
  ) {
    console.log('createDto', createDto);
  }

  @Delete('/:id')
  async removeInvitation(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    console.log('id', id);
  }

  @Get('/use/:id')
  async useInvitation(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    console.log('id', id);
  }
}
