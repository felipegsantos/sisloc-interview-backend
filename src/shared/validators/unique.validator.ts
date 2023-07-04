import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Sequelize } from 'sequelize-typescript';

@ValidatorConstraint()
@Injectable()
export class UniqueOnDatabaseExistConstraint implements ValidatorConstraintInterface {
    constructor(private sequelize: Sequelize) {}
    async validate(value: any, args: ValidationArguments) {
        const entity = args.object[`entity_${args.property}`];
        const isUpdating = args.object[`is_updating_${args.property}`];

        if (!entity) {
            return true;
        }

        if (value) {
            console.log('entity::::', entity);

            const _model = this.sequelize.model(entity);
            const where = {
                [args.property]: value,
            };
            if (isUpdating) {
                Object.assign(where, { id: args.object['id'] });
            }
            const count = await _model.count({
                where,
            });

            return count > 0 ? false : true;
        }
    }
}

export function UniqueOnDatabase(
    entity: any,
    isUpdating?: boolean,
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        validationOptions = {
            ...{
                message: `The value of ${propertyName} already exists in our register`,
            },
            ...validationOptions,
        };
        object[`entity_${propertyName}`] = entity;
        object[`is_updating_${propertyName}`] = isUpdating;

        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UniqueOnDatabaseExistConstraint,
        });
    };
}