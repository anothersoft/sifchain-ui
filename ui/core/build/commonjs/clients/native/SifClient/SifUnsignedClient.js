"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.SifUnSignedClient = void 0;
const launchpad_1 = require("@cosmjs/launchpad");
const clients_1 = require("../../../clients");
const clp_1 = require("./x/clp");
const dispensation_1 = require("./x/dispensation");
const ethbridge_1 = require("./x/ethbridge");
function createLcdClient(apiUrl, broadcastMode) {
  return launchpad_1.LcdClient.withExtensions(
    { apiUrl: apiUrl, broadcastMode: broadcastMode },
    launchpad_1.setupAuthExtension,
    clp_1.setupClpExtension,
    ethbridge_1.setupEthbridgeExtension,
    dispensation_1.setupDispensationExtension,
  );
}
class SifUnSignedClient extends launchpad_1.CosmosClient {
  constructor(
    apiUrl,
    wsUrl = "ws://localhost:26657/websocket",
    rpcUrl = "http://localhost:26657",
    broadcastMode,
  ) {
    super(apiUrl, broadcastMode);
    this.rpcUrl = rpcUrl;
    this.apiUrl = apiUrl;
    this.lcdClient = createLcdClient(apiUrl, broadcastMode);
    this.swap = this.lcdClient.clp.swap;
    this.getPools = this.lcdClient.clp.getPools;
    this.getAssets = this.lcdClient.clp.getAssets;
    this.addLiquidity = this.lcdClient.clp.addLiquidity;
    this.createPool = this.lcdClient.clp.createPool;
    this.getLiquidityProvider = this.lcdClient.clp.getLiquidityProvider;
    this.removeLiquidity = this.lcdClient.clp.removeLiquidity;
    this.getPool = this.lcdClient.clp.getPool;
    this.burn = this.lcdClient.ethbridge.burn;
    this.lock = this.lcdClient.ethbridge.lock;
    this.claim = this.lcdClient.dispensation.claim;
    this.nativeDexClientPromise = (() =>
      __awaiter(this, void 0, void 0, function* () {
        const chainId = yield this.getChainId();
        const cxn = clients_1.NativeDexClient.connect(rpcUrl, apiUrl, chainId);
        return cxn;
      }))();
  }
  loadNativeDexClient() {
    return this.nativeDexClientPromise;
  }
}
exports.SifUnSignedClient = SifUnSignedClient;
//# sourceMappingURL=SifUnsignedClient.js.map