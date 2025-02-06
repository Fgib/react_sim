import { ParseIntPipe } from './parse-int.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ParseIntPipe', () => {
  let pipe: ParseIntPipe;

  beforeEach(() => {
    pipe = new ParseIntPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should successfully parse a valid integer string', async () => {
    const result = await pipe.transform('123', { type: 'body', metatype: Number });
    expect(result).toEqual(123);
  });

  it('should throw BadRequestException on invalid integer string', async () => {
    expect.assertions(1);
    try {
      await pipe.transform('abc', { type: 'body', metatype: Number });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('should throw BadRequestException on a string representing zero', async () => {
    const result = await pipe.transform('0', { type: 'body', metatype: Number });
    expect(result).toEqual(0);
  });

  it('should throw BadRequestException on an empty string', async () => {
    expect.assertions(1);
    try {
      await pipe.transform('', { type: 'body', metatype: Number });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });
});
