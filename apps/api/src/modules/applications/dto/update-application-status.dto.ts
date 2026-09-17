import { IsNotEmpty, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApplicationStatus } from '@2becollab/types';

export class UpdateApplicationStatusDto {
  @IsNotEmpty()
  @IsIn([ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED], {
    message: 'Status must be either ACCEPTED or REJECTED',
  })
  status: ApplicationStatus.ACCEPTED | ApplicationStatus.REJECTED;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reviewNotes?: string;
}
