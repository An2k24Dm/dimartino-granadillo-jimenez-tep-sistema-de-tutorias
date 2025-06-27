import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function EsTelefonoValido(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'esTelefonoValido',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          const regex = /^(0414|0424|0416|0426|0212)-\d{7}$/;
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(): string {
          return 'El teléfono debe tener el formato válido: 0414-XXXXXXX, 0424-XXXXXXX, etc. y no exceder 20 caracteres';
        },
      },
    });
  };
}