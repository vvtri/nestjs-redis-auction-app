import { boolean } from 'boolean';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Matches,
  Max,
  MaxDate,
  MaxLength,
  Min,
  MinDate,
  MinLength,
  UUIDVersion,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import ValidatorJs from 'validator';
import { isNullOrUndefined } from '../utils';

type I18nMessage = {
  message?: any;
};

type ValidationEnumOptions<E, T> = {
  enum: E;
  required?: boolean;
  default?: T;
} & I18nMessage;
export function IsValidEnum<E extends object, T>(
  opts: ValidationEnumOptions<E, T>,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const { required = true, message = [propertyKey, 'common.word.invalid'] } =
      opts;
    IsEnum(opts.enum, { message: JSON.stringify(message) })(
      target,
      propertyKey,
    );
    if (opts.default)
      Transform(({ value }) =>
        isNullOrUndefined(value) ? opts.default : value,
      )(target, propertyKey);
    if (required)
      IsNotEmpty({ message: JSON.stringify(message) })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate Number is valid
 */
type ValidationDateOptions = {
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
} & I18nMessage;

export function IsValidDate(
  { required = true, maxDate, minDate, message }: ValidationDateOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string): void {
    message = message || ([propertyKey, 'common.word.invalid'] as any);

    Type(() => Date)(target, propertyKey);
    if (minDate)
      MinDate(minDate, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (maxDate)
      MaxDate(maxDate, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (required)
      IsDefined({ message: JSON.stringify(message) })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate Number is valid
 */
type ValidationNumberOptions = {
  required?: boolean;
  min?: number;
  max?: number;
} & I18nMessage;
export function IsValidNumber(
  { required = true, min, max, message }: ValidationNumberOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || ([propertyKey, 'common.word.invalid'] as any);

    IsNumber({}, { message: JSON.stringify(message) })(target, propertyKey);
    Type(() => Number)(target, propertyKey);
    if (typeof min === 'number')
      Min(min, { message: JSON.stringify(message) })(target, propertyKey);
    if (typeof max === 'number')
      Max(max, { message: JSON.stringify(message) })(target, propertyKey);
    if (required)
      IsDefined({ message: JSON.stringify(message) })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate Number string is valid
 */
type ValidationNumberStringOptions = {
  required?: boolean;
  maxLength?: number;
} & I18nMessage;

export function IsValidNumberString(
  { required = true, message, maxLength }: ValidationNumberStringOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || ([propertyKey, 'common.word.invalid'] as any);

    IsNumberString({}, { message: JSON.stringify(message) })(
      target,
      propertyKey,
    );
    if (maxLength)
      MaxLength(maxLength, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (required)
      IsDefined({ message: JSON.stringify(message) })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate text is valid
 */
type ValidationTextOptions = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  matches?: RegExp;
  trim?: boolean;
} & I18nMessage;

export function IsValidText(
  {
    minLength = 1,
    maxLength = 255,
    required = true,
    matches,
    trim = true,
    message,
  }: ValidationTextOptions = {
    required: true,
    minLength: 1,
    maxLength: 255,
    trim: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string): void {
    message =
      message || ([`common.word.${propertyKey}`, 'common.word.invalid'] as any);

    IsString({ message: JSON.stringify(message) })(target, propertyKey);
    MaxLength(maxLength, { message: JSON.stringify(message) })(
      target,
      propertyKey,
    );
    if (trim) {
      Transform(({ value }: { value: string }) => value?.trim())(
        target,
        propertyKey,
      );
    }
    if (matches)
      Matches(matches, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (required) {
      MinLength(minLength, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
      IsNotEmpty({ message: JSON.stringify(message) })(target, propertyKey);
    } else
      IsOptional({ message: JSON.stringify(message) })(target, propertyKey);
  };
}

/**
 * Validate uuid is valid
 */
type ValidationUUIDOptions = {
  required?: boolean;
  version?: UUIDVersion;
} & I18nMessage;

export function IsValidUUID(
  { required = true, version = '4', message }: ValidationUUIDOptions = {
    required: true,
    version: '4',
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || ([propertyKey, 'common.word.invalid'] as any);

    IsUUID(version, { message: JSON.stringify(message) })(target, propertyKey);
    if (required)
      IsNotEmpty({ message: JSON.stringify(message) })(target, propertyKey);
  };
}

/**
 * Validate object is valid
 */
type ValidationObjectOptions = {
  required?: boolean;
  object?: { new (...args: any[]): any };
} & I18nMessage;

export function IsValidObject(
  { object, required = true, message }: ValidationObjectOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || ([propertyKey, 'common.word.invalid'] as any);

    ValidateNested()(target, propertyKey);
    if (typeof object === 'function') Type(() => object)(target, propertyKey);
    if (required)
      IsDefined({ message: JSON.stringify(message) })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Valid array of number
 */
type ValidationArrayOptions<T = any> = {
  required?: boolean;
  minSize?: number;
  maxSize?: number;
  unique?: boolean;
  minValue?: number;
  maxValue?: number;
  defaults?: T[];
} & I18nMessage;

// Don't know why default value min/max size array not work here.
export function IsValidArrayNumber(
  {
    required = true,
    minSize,
    maxSize,
    unique,
    maxValue,
    minValue,
    message,
  }: ValidationArrayOptions = {
    required: true,
    unique: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || ([propertyKey, 'common.word.invalid'] as any);

    IsNumber({}, { each: true, message: JSON.stringify(message) })(
      target,
      propertyKey,
    );
    Transform(({ value }) =>
      Array.isArray(value)
        ? value.map(Number)
        : isNullOrUndefined(value)
        ? []
        : [Number(value)],
    )(target, propertyKey);
    if (typeof minSize === 'number')
      ArrayMinSize(minSize, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (typeof maxSize === 'number')
      ArrayMaxSize(maxSize, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (unique)
      ArrayUnique({ message: JSON.stringify(message) })(target, propertyKey);
    if (typeof minValue === 'number')
      Min(minValue, { each: true, message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (typeof maxValue === 'number')
      Max(maxValue, { each: true, message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (required)
      IsDefined({ message: JSON.stringify(message) })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

export function IsValidArrayString(
  {
    required = true,
    minSize,
    maxSize,
    unique,
    message,
  }: ValidationArrayOptions = {
    required: true,
    unique: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || ([propertyKey, 'common.word.invalid'] as any);

    IsString({ each: true, message: JSON.stringify(message) })(
      target,
      propertyKey,
    );
    Transform(({ value }) =>
      Array.isArray(value) ? value : isNullOrUndefined(value) ? [] : [value],
    )(target, propertyKey);
    if (typeof minSize === 'number')
      ArrayMinSize(minSize, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (typeof maxSize === 'number')
      ArrayMaxSize(maxSize, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (unique)
      ArrayUnique({ message: JSON.stringify(message) })(target, propertyKey);
    if (required)
      IsNotEmpty({ each: true, message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate array of object is valid
 */
export function IsValidArrayObject(
  {
    maxSize,
    minSize,
    required = true,
    message,
    defaults,
  }: ValidationArrayOptions,
  object: { new (...args: any[]): any },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || ([propertyKey, 'common.word.invalid'] as any);

    IsArray({ message: JSON.stringify(message) })(target, propertyKey);
    ValidateNested({ each: true, message: JSON.stringify(message) })(
      target,
      propertyKey,
    );
    if (typeof minSize === 'number')
      ArrayMinSize(minSize, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (typeof maxSize === 'number')
      ArrayMaxSize(maxSize, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (Array.isArray(defaults)) {
      Transform(({ value }) =>
        Array.isArray(value)
          ? value
          : isNullOrUndefined(value)
          ? defaults
          : [value],
      )(target, propertyKey);
    } else {
      Transform(({ value }) =>
        Array.isArray(value) ? value : isNullOrUndefined(value) ? [] : [value],
      )(target, propertyKey);
    }
    Type(() => object)(target, propertyKey);
    if (required)
      IsNotEmpty({ message: JSON.stringify(message) })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

export function IsValidArrayEnum(
  {
    maxSize,
    minSize,
    unique,
    required = true,
    defaults,
    message,
  }: Omit<ValidationArrayOptions, 'minValue' | 'maxValue'>,
  enumObj: object,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || ([propertyKey, 'common.word.invalid'] as any);

    IsArray({ message: JSON.stringify(message) })(target, propertyKey);
    IsEnum(enumObj, { each: true, message: JSON.stringify(message) })(
      target,
      propertyKey,
    );
    if (typeof minSize === 'number')
      ArrayMinSize(minSize, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (typeof maxSize === 'number')
      ArrayMaxSize(maxSize, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (unique) ArrayUnique()(target, propertyKey);
    if (Array.isArray(defaults)) {
      Transform(({ value }) =>
        Array.isArray(value) ? value : value ? [value] : defaults,
      )(target, propertyKey);
    } else {
      Transform(({ value }) =>
        Array.isArray(value) ? value : value ? [value] : [],
      )(target, propertyKey);
    }
    if (required)
      IsNotEmpty({ message: JSON.stringify(message) })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Match two field
 */
export function MatchField(
  property: string,
  validationOptions?: ValidationOptions & I18nMessage,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const message =
            validationOptions?.message ||
            ([propertyName, 'common.word.invalid'] as any);

          return JSON.stringify(message);
        },
      },
    });
  };
}

/**
 * Excllude all field exist
 */
export function ExcludeAllField(
  property: string[],
  validationOptions?: ValidationOptions & I18nMessage,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: {
        validate(value: any, args: ValidationArguments & I18nMessage) {
          const constraints = args.constraints;
          for (const keyField of constraints) {
            const relatedValue = (args.object as any)[keyField];
            if (relatedValue) return false;
          }

          return true;
        },
        defaultMessage(args?: ValidationArguments) {
          const message =
            validationOptions?.message ||
            ([propertyName, 'common.word.invalid'] as any);

          return JSON.stringify(message);
        },
      },
    });
  };
}

/**
 * Require all field exist
 */
export function RequireAllField(
  property: string[],
  validationOptions?: ValidationOptions & I18nMessage,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const constraints = args.constraints;
          for (const keyField of constraints) {
            const relatedValue = (args.object as any)[keyField];
            if (!relatedValue) return false;
          }

          return true;
        },
        defaultMessage() {
          const message =
            validationOptions?.message ||
            ([propertyName, 'common.word.invalid'] as any);

          return JSON.stringify(message);
        },
      },
    });
  };
}

/**
 * Require one of fields exist
 */
export function IsRequireOneOf(
  property: string[],
  validationOptions?: ValidationOptions & I18nMessage,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const constraints = args.constraints;

          for (const keyField of constraints) {
            const relatedValue = (args.object as any)[keyField];
            if (relatedValue) return true;
          }

          return false;
        },

        defaultMessage(args?: ValidationArguments) {
          const message =
            validationOptions?.message ||
            ([propertyName, 'common.word.invalid'] as any);

          return JSON.stringify(message);
        },
      },
    });
  };
}

/**
 * Validate only one field exists, if two field, or no filed exist, this will throw error
 * @param property Fields to check exists
 * @param validationOptions
 */
export function IsOnlyOneFieldExist(
  property: string[],
  validationOptions?: ValidationOptions & I18nMessage,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const constraints = args.constraints;
          let isExisted = false;

          for (const fieldKey of constraints) {
            const fieldValue = (args.object as any)[fieldKey];

            // Two field exists
            if (fieldValue && isExisted) return false;

            if (fieldValue) isExisted = true;
          }

          if ((args.object as any)[args.property] && isExisted) return false;

          return true;
        },

        defaultMessage(args?: ValidationArguments): string {
          const message =
            validationOptions?.message ||
            ([propertyName, 'common.word.invalid'] as any);

          return JSON.stringify(message);
        },
      },
    });
  };
}

type ValidationEnumStringOptions = {
  enum: Record<string, any>;
  required?: boolean;
  default?: string;
};

type ValidationEnumNumberOptions = {
  enum: Record<string, any>;
  required?: boolean;
  default?: number;
} & I18nMessage;

export function IsValidEnumNumber(
  opts: ValidationEnumNumberOptions & I18nMessage,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const message =
      opts?.message || ([propertyKey, 'common.word.invalid'] as any);

    IsEnum(opts.enum, { message: JSON.stringify(message) })(
      target,
      propertyKey,
    );
    if (opts.required)
      IsDefined({ message: JSON.stringify(message) })(target, propertyKey);
    else IsOptional()(target, propertyKey);
    if (opts.default)
      Transform(({ value }) => value || opts.default)(target, propertyKey);
  };
}

export function IsValidEnumString(
  opts: ValidationEnumStringOptions & I18nMessage,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const message =
      opts?.message || ([propertyKey, 'common.word.invalid'] as any);

    IsEnum(opts.enum, { message: JSON.stringify(message) })(
      target,
      propertyKey,
    );
    if (opts.required)
      IsDefined({ message: JSON.stringify(message) })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

type ValidationBooleanOptions = {
  required?: boolean;
  default?: boolean;
} & I18nMessage;

export function IsValidBoolean(
  { message, default: _default, required }: ValidationBooleanOptions = {
    required: true,
  },
) {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || ([propertyKey, 'common.word.invalid'] as any);

    IsBoolean({ message: JSON.stringify(message) })(target, propertyKey);
    Transform(({ value }) => {
      if (isNullOrUndefined(value)) {
        return typeof _default === 'boolean' ? _default : value;
      } else return boolean(value);
    })(target, propertyKey);
    if (required)
      IsDefined({ message: JSON.stringify(message) })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

type ValidationEmailOptions = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  matches?: RegExp;
  trim?: boolean;
} & I18nMessage;

export function IsValidEmail(
  {
    minLength = 1,
    maxLength = 255,
    required = true,
    matches,
    trim = true,
    message,
  }: ValidationEmailOptions = {
    required: true,
    minLength: 1,
    maxLength: 255,
    trim: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || ([propertyKey, 'common.word.invalid'] as any);

    IsEmail({}, { message: JSON.stringify(message) })(target, propertyKey);
    MinLength(minLength, { message: JSON.stringify(message) })(
      target,
      propertyKey,
    );
    MaxLength(maxLength, { message: JSON.stringify(message) })(
      target,
      propertyKey,
    );
    if (trim) {
      Transform(({ value }: { value: string }) => {
        if (value !== null) return value.trim();
        else return value;
      })(target, propertyKey);
    }
    if (matches)
      Matches(matches, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    if (required)
      IsNotEmpty({ message: JSON.stringify(message) })(target, propertyKey);
    else IsOptional({ message: JSON.stringify(message) })(target, propertyKey);
  };
}

/**
 * Validate url
 */
type ValidationUrlOptions = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  trim?: boolean;
  urlOpts?: ValidatorJs.IsURLOptions;
} & I18nMessage;

export function IsValidUrl(
  {
    maxLength = 255,
    required = true,
    trim = true,
    urlOpts = {},
    message,
    minLength,
  }: ValidationUrlOptions = {
    required: true,
    maxLength: 255,
    trim: true,
    urlOpts: {},
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string): void {
    message =
      message || ([`common.word.${propertyKey}`, 'common.word.invalid'] as any);

    IsUrl(urlOpts, { message: JSON.stringify(message) })(target, propertyKey);
    MaxLength(maxLength, { message: JSON.stringify(message) })(
      target,
      propertyKey,
    );
    if (trim) {
      Transform(({ value }: { value: string }) => value?.trim())(
        target,
        propertyKey,
      );
    }
    if (minLength) {
      MinLength(minLength, { message: JSON.stringify(message) })(
        target,
        propertyKey,
      );
    }
    if (required) {
      IsNotEmpty({ message: JSON.stringify(message) })(target, propertyKey);
    } else {
      IsOptional({ message: JSON.stringify(message) })(target, propertyKey);
    }
  };
}
