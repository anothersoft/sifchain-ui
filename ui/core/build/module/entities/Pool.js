import { Asset } from "./Asset";
import { AssetAmount } from "./AssetAmount";
import { Pair } from "./Pair";
import { calculatePoolUnits, calculatePriceImpact, calculateProviderFee, calculateReverseSwapResult, calculateSwapResult, } from "./formulae";
import { Amount } from "./Amount";
export function Pool(a, b, poolUnits) {
    const pair = Pair(a, b);
    const amounts = pair.amounts;
    return {
        amounts,
        get externalAmount() {
            return amounts.find((amount) => amount.symbol !== "rowan");
        },
        get nativeAmount() {
            return amounts.find((amount) => amount.symbol === "rowan");
        },
        otherAsset: pair.otherAsset,
        symbol: pair.symbol,
        contains: pair.contains,
        toString: pair.toString,
        getAmount: pair.getAmount,
        poolUnits: poolUnits ||
            calculatePoolUnits(Amount(a), Amount(b), Amount("0"), Amount("0"), Amount("0")),
        priceAsset(asset) {
            return this.calcSwapResult(AssetAmount(asset, "1"));
        },
        calcProviderFee(x) {
            const X = amounts.find((a) => a.symbol === x.symbol);
            if (!X)
                throw new Error(`Sent amount with symbol ${x.symbol} does not exist in this pair: ${this.toString()}`);
            const Y = amounts.find((a) => a.symbol !== x.symbol);
            if (!Y)
                throw new Error("Pool does not have an opposite asset."); // For Typescript's sake will probably never happen
            const providerFee = calculateProviderFee(x, X, Y);
            return AssetAmount(this.otherAsset(x), providerFee);
        },
        calcPriceImpact(x) {
            const X = amounts.find((a) => a.symbol === x.symbol);
            if (!X)
                throw new Error(`Sent amount with symbol ${x.symbol} does not exist in this pair: ${this.toString()}`);
            return calculatePriceImpact(x, X).multiply("100");
        },
        // https://github.com/Sifchain/sifnode/blob/develop/docs/1.Liquidity%20Pools%20Architecture.md
        // Formula: swapAmount = (x * X * Y) / (x + X) ^ 2
        calcSwapResult(x) {
            const X = amounts.find((a) => a.symbol === x.symbol);
            if (!X)
                throw new Error(`Sent amount with symbol ${x.symbol} does not exist in this pair: ${this.toString()}`);
            const Y = amounts.find((a) => a.symbol !== x.symbol);
            if (!Y)
                throw new Error("Pool does not have an opposite asset."); // For Typescript's sake will probably never happen
            const swapAmount = calculateSwapResult(x, X, Y);
            return AssetAmount(this.otherAsset(x), swapAmount);
        },
        calcReverseSwapResult(Sa) {
            const Ya = amounts.find((a) => a.symbol === Sa.symbol);
            if (!Ya)
                throw new Error(`Sent amount with symbol ${Sa.symbol} does not exist in this pair: ${this.toString()}`);
            const Xa = amounts.find((a) => a.symbol !== Sa.symbol);
            if (!Xa)
                throw new Error("Pool does not have an opposite asset."); // For Typescript's sake will probably never happen
            const otherAsset = this.otherAsset(Sa);
            if (Sa.equalTo("0")) {
                return AssetAmount(otherAsset, "0");
            }
            const x = calculateReverseSwapResult(Sa, Xa, Ya);
            return AssetAmount(otherAsset, x);
        },
        calculatePoolUnits(nativeAssetAmount, externalAssetAmount) {
            const [nativeBalanceBefore, externalBalanceBefore] = amounts;
            // Calculate current units created by this potential liquidity provision
            const lpUnits = calculatePoolUnits(nativeAssetAmount, externalAssetAmount, nativeBalanceBefore, externalBalanceBefore, this.poolUnits);
            const newTotalPoolUnits = lpUnits.add(this.poolUnits);
            return [newTotalPoolUnits, lpUnits];
        },
    };
}
export function CompositePool(pair1, pair2) {
    // The combined asset is the
    const pair1Assets = pair1.amounts.map((a) => a.symbol);
    const pair2Assets = pair2.amounts.map((a) => a.symbol);
    const nativeSymbol = pair1Assets.find((value) => pair2Assets.includes(value));
    if (!nativeSymbol) {
        throw new Error("Cannot create composite pair because pairs do not share a common symbol");
    }
    const amounts = [
        ...pair1.amounts.filter((a) => a.symbol !== nativeSymbol),
        ...pair2.amounts.filter((a) => a.symbol !== nativeSymbol),
    ];
    if (amounts.length !== 2) {
        throw new Error("Cannot create composite pair because pairs do not share a common symbol");
    }
    return {
        amounts: amounts,
        get externalAmount() {
            return amounts[0];
        },
        get nativeAmount() {
            return amounts[1];
        },
        getAmount: (asset) => {
            if (Asset(asset).symbol === nativeSymbol) {
                throw new Error(`Asset ${nativeSymbol} doesnt exist in pair`);
            }
            // quicker to try catch than contains
            try {
                return pair1.getAmount(asset);
            }
            catch (err) { }
            return pair2.getAmount(asset);
        },
        priceAsset(asset) {
            return this.calcSwapResult(AssetAmount(asset, "1"));
        },
        otherAsset(asset) {
            const otherAsset = amounts.find((amount) => amount.symbol !== asset.symbol);
            if (!otherAsset)
                throw new Error("Asset doesnt exist in pair");
            return otherAsset;
        },
        symbol() {
            return amounts
                .map((a) => a.symbol)
                .sort()
                .join("_");
        },
        contains(...assets) {
            const local = amounts.map((a) => a.symbol).sort();
            const other = assets.map((a) => a.symbol).sort();
            return !!local.find((s) => other.includes(s));
        },
        calcProviderFee(x) {
            const [first, second] = pair1.contains(x)
                ? [pair1, pair2]
                : [pair2, pair1];
            const firstSwapFee = first.calcProviderFee(x);
            const firstSwapOutput = first.calcSwapResult(x);
            const secondSwapFee = second.calcProviderFee(firstSwapOutput);
            const firstSwapFeeInOutputAsset = second.calcSwapResult(firstSwapFee);
            return AssetAmount(second.otherAsset(firstSwapFee), firstSwapFeeInOutputAsset.add(secondSwapFee));
        },
        calcPriceImpact(x) {
            const [first, second] = pair1.contains(x)
                ? [pair1, pair2]
                : [pair2, pair1];
            const firstPoolImpact = first.calcPriceImpact(x);
            const r = first.calcSwapResult(x);
            const secondPoolImpact = second.calcPriceImpact(r);
            return firstPoolImpact.add(secondPoolImpact);
        },
        calcSwapResult(x) {
            // TODO: possibly use a combined formula
            const [first, second] = pair1.contains(x)
                ? [pair1, pair2]
                : [pair2, pair1];
            const nativeAmount = first.calcSwapResult(x);
            return second.calcSwapResult(nativeAmount);
        },
        calcReverseSwapResult(S) {
            // TODO: possibly use a combined formula
            const [first, second] = pair1.contains(S)
                ? [pair1, pair2]
                : [pair2, pair1];
            const nativeAmount = first.calcReverseSwapResult(S);
            return second.calcReverseSwapResult(nativeAmount);
        },
        toString() {
            return amounts.map((a) => a.toString()).join(" | ");
        },
    };
}
//# sourceMappingURL=Pool.js.map