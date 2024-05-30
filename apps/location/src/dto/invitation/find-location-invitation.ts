import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { PaginationDto } from "@app/common";
import { IsOptional, IsUUID } from "class-validator";

export class FindCompaniesInvitationsDto extends IntersectionType(PaginationDto) {
    @ApiProperty({
        description: 'Find By Location',
        required: false
    })
    @IsUUID()
    @IsOptional()
    locationId: string;
}