import { useCore } from "@/hooks/useCore";
import { IAsset, IAssetAmount, Network } from "@sifchain/sdk";
import { PegEvent } from "../../../../core/src/usecases/peg/peg";
import { UnpegEvent } from "../../../../core/src/usecases/peg/unpeg";
import { Vuextra } from "../Vuextra";

export type ExportDraft = {
  amount: string;
  network: Network;
  symbol: string;
  unpegEvent: UnpegEvent | undefined;
};
type State = {
  draft: ExportDraft;
};
export const exportStore = Vuextra.createStore({
  name: "export",
  options: {
    devtools: true,
  },
  state: {
    draft: {
      amount: "0",
      network: Network.ETHEREUM,
      symbol: "eth",
      unpegEvent: undefined,
    },
  } as State,
  getters: (state) => ({
    networks() {
      return Object.values(Network).filter(
        (network) => network !== Network.SIFCHAIN,
      );
    },
  }),
  mutations: (state) => ({
    setDraft(nextDraft: Partial<ExportDraft>) {
      console.log("SETTING DRAFT!!!", state, nextDraft);
      Object.assign(state.draft, nextDraft);
    },
    setPegEvent(unpegEvent: UnpegEvent | undefined) {
      state.draft.unpegEvent = unpegEvent;
    },
  }),
  actions: (ctx) => ({
    async runExport(payload: { assetAmount: IAssetAmount }) {
      if (!payload.assetAmount) throw new Error("Please provide an amount");
      self.setPegEvent(undefined);
      for await (const event of useCore().usecases.peg.peg(
        payload.assetAmount,
        ctx.state.draft.network,
      )) {
        self.setPegEvent(event);
        console.log({ event });
      }
    },
  }),

  modules: [],
});

const self = exportStore;
