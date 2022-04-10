import { RewardParams } from "@sifchain/sdk/build/typescript/generated/proto/sifnode/clp/v1/params";
import {
  LiquidityProvider,
  LiquidityUnlock,
} from "@sifchain/sdk/build/typescript/generated/proto/sifnode/clp/v1/types";
import BigNumber from "bignumber.js";
import { addSeconds } from "date-fns";
import Long from "long";

// TODO: this shouldn't be here
// see if this can be extracted out or fetch from external service
const EST_SECONDS_PER_BLOCK = 5;

const addDetailToUnlock = (
  unlock: LiquidityUnlock,
  params: RewardParams,
  currentHeight: number,
  totalUnits: BigNumber,
  totalNativeAssets: BigNumber,
  totalExternalAssets: BigNumber,
) => {
  const lockPeriod = params?.liquidityRemovalLockPeriod ?? Long.ZERO;
  const unlockedFromHeight = unlock.requestHeight.add(lockPeriod).toNumber();
  const ready = currentHeight >= unlockedFromHeight;

  const blocksUntilUnlock = unlockedFromHeight - currentHeight;
  const eta =
    blocksUntilUnlock <= 0
      ? undefined
      : addSeconds(new Date(), EST_SECONDS_PER_BLOCK * blocksUntilUnlock);

  const units = new BigNumber(unlock.units);
  const unlockPercentage = units.dividedBy(totalUnits);

  const nativeAssetAmount = new BigNumber(totalNativeAssets).multipliedBy(
    unlockPercentage,
  );
  const externalAssetAmount = new BigNumber(totalExternalAssets).multipliedBy(
    unlockPercentage,
  );

  return {
    ...unlock,
    nativeAssetAmount,
    externalAssetAmount,
    requestHeight: unlock.requestHeight.toNumber(),
    ready,
    unlockedFromHeight,
    eta,
  };
};

export const addDetailToLiquidityProvider = (
  liquidityProvider: LiquidityProvider,
  nativeAsset: { value: string; fractionalDigits: number },
  externalAsset: { value: string; fractionalDigits: number },
  params: RewardParams,
  currentHeight: number,
) => {
  return {
    ...liquidityProvider,
    unlocks: liquidityProvider.unlocks.map((x) =>
      addDetailToUnlock(
        x,
        params,
        currentHeight,
        new BigNumber(liquidityProvider.liquidityProviderUnits),
        new BigNumber(nativeAsset.value).shiftedBy(
          -nativeAsset.fractionalDigits,
        ),
        new BigNumber(externalAsset.value).shiftedBy(
          -externalAsset.fractionalDigits,
        ),
      ),
    ),
  };
};
