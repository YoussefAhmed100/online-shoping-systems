import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
  } from 'class-validator';
  import { parsePhoneNumberFromString } from 'libphonenumber-js';
  
  @ValidatorConstraint({ async: false })
  export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
    validate(phone: any, args: ValidationArguments) {
      try {
        const phoneNumber = parsePhoneNumberFromString(phone);
        return phoneNumber?.isValid() ?? false;
      } catch {
        return false;
      }
    }
  
    defaultMessage(args: ValidationArguments) {
      return 'Invalid phone number. Please provide a valid phone number in international format.';
    }
  }
  
  export function IsPhoneNumber(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsPhoneNumberConstraint,
      });
    };
  }
  