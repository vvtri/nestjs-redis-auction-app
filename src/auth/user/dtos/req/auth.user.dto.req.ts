import { ApiProperty } from '@nestjs/swagger';
import { IsValidText } from '../../../../common/decorators/custom-validator.decorator';

export class SignUpUserDtoReq {
  @IsValidText()
  @ApiProperty({ type: String })
  username: string;

  @IsValidText()
  @IsValidText()
  password: string;
}

export class SignInUserDtoReq {
  @IsValidText()
  username: string;

  @IsValidText()
  password: string;
}
