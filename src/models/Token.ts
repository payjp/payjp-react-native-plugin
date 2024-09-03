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

import { Card, CardFromJSON, CardFromJSONTyped, CardToJSON } from './';

/**
 *
 * @export
 * @interface Token
 */
export interface Token {
    /**
     * tok_で始まる一意なオブジェクトを示す文字列
     * @type {string}
     * @memberof Token
     */
    id: string;
    /**
     *
     * @type {Card}
     * @memberof Token
     */
    card: Card;
    /**
     * このトークン作成時のタイムスタンプ
     * @type {number}
     * @memberof Token
     */
    created: number;
    /**
     * 本番環境かどうか
     * @type {boolean}
     * @memberof Token
     */
    livemode: boolean;
    /**
     * \\\"token\\\"の固定文字列
     * @type {string}
     * @memberof Token
     */
    object: string;
    /**
     * このトークンが使用済みかどうか
     * @type {boolean}
     * @memberof Token
     */
    used: boolean;
}

export function TokenFromJSON(json: any): Token {
    return TokenFromJSONTyped(json, false);
}

export function TokenFromJSONTyped(json: any, ignoreDiscriminator: boolean): Token {
    if (json === undefined || json === null) {
        return json;
    }
    return {
        id: json['id'],
        card: CardFromJSON(json['card']),
        created: json['created'],
        livemode: json['livemode'],
        object: json['object'],
        used: json['used'],
    };
}

export function TokenToJSON(value?: Token | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        id: value.id,
        card: CardToJSON(value.card),
        created: value.created,
        livemode: value.livemode,
        object: value.object,
        used: value.used,
    };
}
