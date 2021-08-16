import { Network } from "../../../entities";
import { IBCChainConfig } from "../../../services/IBCService/IBCChainConfig";

export const IRIS_TESTNET: IBCChainConfig = {
  network: Network.COSMOSHUB,
  chainId: "iris-testnet",
  rpcUrl: "https://iris-testnet-proxy.vercel.app/api/rpc",
  restUrl: "https://iris-testnet-proxy.vercel.app/rest",
  keplrChainInfo: {
    rpc: "https://iris-testnet-proxy.vercel.app/api/rpc",
    rest: "https://iris-testnet-proxy.vercel.app/rest",
    chainId: "iris-testnet",
    chainName: "IRIS Testnet",
    stakeCurrency: {
      coinDenom: "NYAN",
      coinMinimalDenom: "unyan",
      coinDecimals: 6,
      coinGeckoId: "iris",
    },
    walletUrl: "https://wallet.keplr.app/#/iris/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/iris/stake",
    bip44: {
      coinType: 566,
    },
    bech32Config: {
      bech32PrefixAccAddr: "iaa",
      bech32PrefixAccPub: "iaapub",
      bech32PrefixValAddr: "iaavaloper",
      bech32PrefixValPub: "iaavaloperpub",
      bech32PrefixConsAddr: "iaavalcons",
      bech32PrefixConsPub: "iaavalconspub",
    },
    currencies: [
      {
        coinDenom: "NYAN",
        coinMinimalDenom: "unyan",
        coinDecimals: 6,
        coinGeckoId: "iris",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "NYAN",
        coinMinimalDenom: "unyan",
        coinDecimals: 6,
        coinGeckoId: "iris",
      },
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"],
  },
};