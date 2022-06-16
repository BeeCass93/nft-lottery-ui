// overview of all the DFK related networks: AVAX, DFK chain (avax subnet), Harmony

export const chains = {
  dfkchain: {
    chainId: `0x${Number(53935).toString(16)}`,
    chainName: "DFK Chain Mainnet",
    nativeCurrency: {
      name: "JEWEL",
      symbol: "JEWEL",
      decimals: 18,
    },
    rpcUrls: [
      "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc",
      "https://avax-dfk.gateway.pokt.network/v1/lb/6244818c00b9f0003ad1b619/ext/bc/q2aTwKuyzgs8pynF7UXBZCU7DejbZbZ6EUyHr3JQzYgwNPUPi/rpc",
    ],
    blockExplorerUrls: ["https://explorer.dfkchain.com/"],
  },
  avalanche: {
    chainId: `0x${Number(43114).toString(16)}`,
    chainName: "Avalanche C-Chain",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: [
      "https://api.avax.network/ext/bc/C/rpc",
      "https://rpc.ankr.com/avalanche",
    ],
    blockExplorerUrls: ["https://snowtrace.io"],
  },
  harmony: {
    chainId: `0x${Number(1666600000).toString(16)}`,
    chainName: "Harmony Mainnet",
    nativeCurrency: {
      name: "ONE",
      symbol: "ONE",
      decimals: 18,
    },
    rpcUrls: [
      "https://harmony-0-rpc.gateway.pokt.network	",
      "https://api.s0.t.hmny.io",
      "https://a.api.s0.t.hmny.io",
    ],
    blockExplorerUrls: ["https://explorer.harmony.one/"],
  }
};
