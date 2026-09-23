import { z, ZodError, ZodType } from 'zod';
import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: any) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          errors: z.treeifyError(error),
          message: 'Validation failed.',
          statusCode: 400,
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
