TETHER_ADDRESS= '0x0165878A594ca255338adfa4d48449f69242Eb8F'
USDC_ADDRESS= '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'
WRAPPED_BITCOIN_ADDRESS= '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'

const swapRouterAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'; 

const {ethers, waffle} = require('hardhat');
const {Contract} = require("ethers");
const ERC20ABI = require('../ERC20.json'); 

const artifacts = {
    SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
    Usdt: require("../artifacts/contracts/Tether.sol/Tether.json"),
    Usdc: require("../artifacts/contracts/UsdCoin.sol/UsdCoin.json")
};



async function main(){

    const [owner, signer2] = await ethers.getSigners();
    const provider = waffle.provider;
    const USDTToken = new Contract(TETHER_ADDRESS, artifacts.Usdt.abi, provider);
    const USDCToken = new Contract(USDC_ADDRESS, artifacts.Usdc.abi, provider);
    const allowedT = await USDTToken.connect(signer2).allowance(signer2.address,swapRouterAddress);
    const allowedC = await USDCToken.connect(signer2).allowance(signer2.address,swapRouterAddress);
    console.log(`Allowed USDT:  ${allowedT}`);
    console.log(`Allowed USDC:  ${allowedC}`);

}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });