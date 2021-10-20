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
/**
 *
 * @export
 * @interface OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochs
 */
export interface OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochs {
  /**
   *
   * @type {string}
   * @memberof OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochs
   */
  identifier?: string;
  /**
   *
   * @type {Date}
   * @memberof OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochs
   */
  startTime?: Date;
  /**
   *
   * @type {string}
   * @memberof OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochs
   */
  duration?: string;
  /**
   *
   * @type {string}
   * @memberof OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochs
   */
  currentEpoch?: string;
  /**
   *
   * @type {Date}
   * @memberof OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochs
   */
  currentEpochStartTime?: Date;
  /**
   *
   * @type {boolean}
   * @memberof OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochs
   */
  epochCountingStarted?: boolean;
  /**
   *
   * @type {boolean}
   * @memberof OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochs
   */
  currentEpochEnded?: boolean;
}

export function OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochsFromJSON(
  json: any,
): OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochs {
  return OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochsFromJSONTyped(
    json,
    false,
  );
}

export function OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochsFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochs {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    identifier: !exists(json, "identifier") ? undefined : json["identifier"],
    startTime: !exists(json, "start_time")
      ? undefined
      : new Date(json["start_time"]),
    duration: !exists(json, "duration") ? undefined : json["duration"],
    currentEpoch: !exists(json, "current_epoch")
      ? undefined
      : json["current_epoch"],
    currentEpochStartTime: !exists(json, "current_epoch_start_time")
      ? undefined
      : new Date(json["current_epoch_start_time"]),
    epochCountingStarted: !exists(json, "epoch_counting_started")
      ? undefined
      : json["epoch_counting_started"],
    currentEpochEnded: !exists(json, "current_epoch_ended")
      ? undefined
      : json["current_epoch_ended"],
  };
}

export function OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochsToJSON(
  value?: OsmosisEpochsV1beta1QueryEpochsInfoResponseEpochs | null,
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    identifier: value.identifier,
    start_time:
      value.startTime === undefined ? undefined : value.startTime.toISOString(),
    duration: value.duration,
    current_epoch: value.currentEpoch,
    current_epoch_start_time:
      value.currentEpochStartTime === undefined
        ? undefined
        : value.currentEpochStartTime.toISOString(),
    epoch_counting_started: value.epochCountingStarted,
    current_epoch_ended: value.currentEpochEnded,
  };
}