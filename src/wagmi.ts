// import { createConfig, http } from "wagmi";
// import { arbitrum, base, mainnet, sonic } from "wagmi/chains";
// import { baseAccount, injected, walletConnect } from "wagmi/connectors";

// export const config = createConfig({
//   chains: [mainnet, base, arbitrum, sonic],
//   connectors: [
//     injected(),
//     baseAccount(),
//     walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
//   ],
//   transports: {
//     [mainnet.id]: http(),
//     [base.id]: http(),
//     [arbitrum.id]: http(),
//     [sonic.id]: http(),
//   },
// });

// declare module "wagmi" {
//   interface Register {
//     config: typeof config;
//   }
// }
