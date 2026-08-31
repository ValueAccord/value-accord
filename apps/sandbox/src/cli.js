import { AccordSandbox } from "./index.js";

const sandbox = new AccordSandbox();
const tx = sandbox.pay({ amountEur: 42 });
console.log(JSON.stringify({ warning: "Sandbox only — no real funds are transferred", transaction: tx, balances: sandbox.balances }, null, 2));
