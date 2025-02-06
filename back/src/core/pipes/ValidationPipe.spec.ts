import { IsNotEmpty } from 'class-validator';
import { ValidationPipe } from './ValidationPipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

class CreateUserDto {
  @IsNotEmpty()
  username: string;
}

describe('ValidationPipe', () => {
  let validationPipe: ValidationPipe;

  beforeEach(() => {
    validationPipe = new ValidationPipe();
  });

  describe('transform', () => {
    it('should return the object if no metatype is provided', async () => {
      const argMetadata: ArgumentMetadata = {
        metatype: null,
        type: 'body'
      };
      expect(await validationPipe.transform('test', argMetadata)).toBe('test');
    });
  });

  describe('transform', () => {
    it('should return the object if the metatype is not a string, boolean, number, array, or object', async () => {
      const argMetadata: ArgumentMetadata = {
        metatype: class Test {},
        type: 'body'
      };
      expect(await validationPipe.transform({}, argMetadata)).toEqual({});
    });
  });

  it('should throw a BadRequestException when validation fails', async () => {
    const argMetadata: ArgumentMetadata = {
      metatype: CreateUserDto,
      type: 'body'
    };
    const invalidUser = {};

    await expect(validationPipe.transform(invalidUser, argMetadata)).rejects.toThrow(BadRequestException);
  });

  describe('toValidate', () => {
    it('should return true if the metatype is not a string, boolean, number, array or object', () => {
      expect(validationPipe['toValidate'](class Test {})).toBe(true);
    });
  });

  describe('toValidate', () => {
    it('should return false if the metatype is a string', () => {
      expect(validationPipe['toValidate'](String)).toBe(false);
    });
  });

  describe('toValidate', () => {
    it('should return false if the metatype is a boolean', () => {
      expect(validationPipe['toValidate'](Boolean)).toBe(false);
    });
  });
});
