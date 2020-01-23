/* tslint:disable */
/* eslint-disable */
/**
 * PAY.JP Token API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

// import { exists, mapValues } from '../runtime';

function exists(json: any, key: string) {
    const value = json[key];
    return value !== null && value !== undefined;
}

function mapValues(data: any, fn: (item: any) => any) {
    return Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: fn(data[key]) }), {});
}

/**
 *
 * @export
 * @interface ErrorResponse
 */
export interface ErrorResponse {
    /**
     *
     * @type {Error}
     * @memberof ErrorResponse
     */
    error: Error;
}

export function ErrorResponseFromJSON(json: any): ErrorResponse {
    return ErrorResponseFromJSONTyped(json, false);
}

export function ErrorResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ErrorResponse {
    if (json === undefined || json === null) {
        return json;
    }
    return {
        error: json["error"]
    };
}

export function ErrorResponseToJSON(value?: ErrorResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        error: value.error
    };
}
