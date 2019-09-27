// tslint:disable
/**
 * PAY.JP API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime";
/**
 *
 * @export
 * @interface Card
 */
export interface Card {
    /**
     *
     * @type {string}
     * @memberof Card
     */
    id: string;
    /**
     *
     * @type {string}
     * @memberof Card
     */
    object?: string;
    /**
     *
     * @type {number}
     * @memberof Card
     */
    created?: number;
    /**
     *
     * @type {string}
     * @memberof Card
     */
    name?: string;
    /**
     *
     * @type {string}
     * @memberof Card
     */
    last4?: string;
    /**
     *
     * @type {number}
     * @memberof Card
     */
    expMonth?: number;
    /**
     *
     * @type {number}
     * @memberof Card
     */
    expYear?: number;
    /**
     *
     * @type {string}
     * @memberof Card
     */
    brand?: string;
    /**
     *
     * @type {string}
     * @memberof Card
     */
    cvcCheck?: string;
    /**
     *
     * @type {string}
     * @memberof Card
     */
    fingerprint?: string;
    /**
     *
     * @type {string}
     * @memberof Card
     */
    addressState?: string;
    /**
     *
     * @type {string}
     * @memberof Card
     */
    addressCity?: string;
    /**
     *
     * @type {string}
     * @memberof Card
     */
    addressLine1?: string;
    /**
     *
     * @type {string}
     * @memberof Card
     */
    addressLine2?: string;
    /**
     *
     * @type {string}
     * @memberof Card
     */
    country?: string;
    /**
     *
     * @type {string}
     * @memberof Card
     */
    addressZip?: string;
    /**
     *
     * @type {string}
     * @memberof Card
     */
    addressZipCheck?: string;
}

export function CardFromJSON(json: any): Card {
    return CardFromJSONTyped(json, false);
}

export function CardFromJSONTyped(json: any, ignoreDiscriminator: boolean): Card {
    if (json === undefined || json === null) {
        return json;
    }
    return {
        id: json["id"],
        object: !exists(json, "object") ? undefined : json["object"],
        created: !exists(json, "created") ? undefined : json["created"],
        name: !exists(json, "name") ? undefined : json["name"],
        last4: !exists(json, "last4") ? undefined : json["last4"],
        expMonth: !exists(json, "exp_month") ? undefined : json["exp_month"],
        expYear: !exists(json, "exp_year") ? undefined : json["exp_year"],
        brand: !exists(json, "brand") ? undefined : json["brand"],
        cvcCheck: !exists(json, "cvc_check") ? undefined : json["cvc_check"],
        fingerprint: !exists(json, "fingerprint") ? undefined : json["fingerprint"],
        addressState: !exists(json, "address_state") ? undefined : json["address_state"],
        addressCity: !exists(json, "address_city") ? undefined : json["address_city"],
        addressLine1: !exists(json, "address_line1") ? undefined : json["address_line1"],
        addressLine2: !exists(json, "address_line2") ? undefined : json["address_line2"],
        country: !exists(json, "country") ? undefined : json["country"],
        addressZip: !exists(json, "address_zip") ? undefined : json["address_zip"],
        addressZipCheck: !exists(json, "address_zip_check") ? undefined : json["address_zip_check"]
    };
}

export function CardToJSON(value?: Card): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        id: value.id,
        object: value.object,
        created: value.created,
        name: value.name,
        last4: value.last4,
        exp_month: value.expMonth,
        exp_year: value.expYear,
        brand: value.brand,
        cvc_check: value.cvcCheck,
        fingerprint: value.fingerprint,
        address_state: value.addressState,
        address_city: value.addressCity,
        address_line1: value.addressLine1,
        address_line2: value.addressLine2,
        country: value.country,
        address_zip: value.addressZip,
        address_zip_check: value.addressZipCheck
    };
}
