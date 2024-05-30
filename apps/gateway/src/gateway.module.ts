import path from 'path';
import { LanguageModule } from '@app/language';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '@app/authentication';
import { AuthGatewayController } from './modules/auth/auth-gateway.controller';
import { VehicleGatewayController } from './modules/vehicle/vehicle-gateway.controller';
import { PolicyModule } from '@app/policy';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { UserGatewayController } from './modules/user/user-gateway.controller';
import { UserProfileGatewayController } from './modules/user/user-profile-gateway.controller';
import { CompanyGatewayController } from './modules/company/company-gateway.controller';
import { CompanyMemberGatewayController } from './modules/company/company-member-gateway.controller';
import { CompanyInvitationGatewayController } from './modules/company/company-invitation-gateway.controller';
import { OrganizationMemberGatewayController } from './modules/organization/organization-member-gateway.controller';
import { OrganizationGatewayController } from './modules/organization/organization-gateway.controller';
import { OrganizationInvitationGatewayController } from './modules/organization/organization-invitation-gateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './env',
    }),
    LanguageModule.register(path.join(__dirname, '../../../static/i18n')),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    RabbitModule.forClientProxy(RabbitServiceName.USER),
    RabbitModule.forClientProxy(RabbitServiceName.AUTH),
    RabbitModule.forClientProxy(RabbitServiceName.VEHICLE),
    RabbitModule.forClientProxy(RabbitServiceName.STORAGE),
    RabbitModule.forClientProxy(RabbitServiceName.COMPANY),
    RabbitModule.forClientProxy(RabbitServiceName.ORGANIZATION),
    AuthenticationModule.register(),
    PolicyModule,
  ],
  controllers: [
    AuthGatewayController,
    UserGatewayController,
    UserProfileGatewayController,
    VehicleGatewayController,
    CompanyGatewayController,
    CompanyMemberGatewayController,
    CompanyInvitationGatewayController,
    OrganizationGatewayController,
    OrganizationMemberGatewayController,
    OrganizationInvitationGatewayController,
  ],
})
export class GatewayModule {}
