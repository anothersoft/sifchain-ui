/* tslint:disable */
/* eslint-disable */
/**
 * Sifchain - gRPC Gateway docs
 * A REST interface for state queries, legacy transactions
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime";
import {
  InlineResponse2002Balances,
  InlineResponse2002BalancesFromJSON,
  InlineResponse2002BalancesFromJSONTyped,
  InlineResponse2002BalancesToJSON,
} from "./";

/**
 * DepositParams defines the params for deposits on governance proposals.
 * @export
 * @interface CosmosGovV1beta1DepositParams
 */
export interface CosmosGovV1beta1DepositParams {
  /**
   * Minimum deposit for a proposal to enter voting period.
   * @type {Array<InlineResponse2002Balances>}
   * @memberof CosmosGovV1beta1DepositParams
   */
  minDeposit?: Array<InlineResponse2002Balances>;
  /**
   * Maximum period for Atom holders to deposit on a proposal. Initial value: 2
   *  months.
   * @type {string}
   * @memberof CosmosGovV1beta1DepositParams
   */
  maxDepositPeriod?: string;
}

export function CosmosGovV1beta1DepositParamsFromJSON(
  json: any,
): CosmosGovV1beta1DepositParams {
  return CosmosGovV1beta1DepositParamsFromJSONTyped(json, false);
}

export function CosmosGovV1beta1DepositParamsFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): CosmosGovV1beta1DepositParams {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    minDeposit: !exists(json, "min_deposit")
      ? undefined
      : (json["min_deposit"] as Array<any>).map(
          InlineResponse2002BalancesFromJSON,
        ),
    maxDepositPeriod: !exists(json, "max_deposit_period")
      ? undefined
      : json["max_deposit_period"],
  };
}

export function CosmosGovV1beta1DepositParamsToJSON(
  value?: CosmosGovV1beta1DepositParams | null,
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    min_deposit:
      value.minDeposit === undefined
        ? undefined
        : (value.minDeposit as Array<any>).map(
            InlineResponse2002BalancesToJSON,
          ),
    max_deposit_period: value.maxDepositPeriod,
  };
}