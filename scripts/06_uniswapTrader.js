// Import ethers from Hardhat, not directly from the ethers package
const { ethers } = require("hardhat");
const IUniswapV3PoolABI = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json').abi;
const SwapRouterABI = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json').abi;
const ERC20ABI = require('../ERC20.json'); 
const { getPoolImmutables, getPoolState } = require('./helpers')

async function main() {
    // Use Hardhat's provider and signers
    const [owner, signer2] = await ethers.getSigners();
    const provider = waffle.provider;

    // Example addresses, replace these with your local Hardhat deployed addresses
    const poolAddress = '0x1FA8DDa81477A5b6FA1b2e149e93ed9C7928992F'; // Your local Uniswap Pool address
    const swapRouterAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'; // Your local Uniswap SwapRouter address

    // Initialize contracts with the local signer
    const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider);
    const swapRouterContract = new ethers.Contract(swapRouterAddress, SwapRouterABI, provider);

 
    const name0 = 'USDT';
    const symbol0 = 'USDT';
    const decimals0 = 18;
    const address0 = '0x0165878A594ca255338adfa4d48449f69242Eb8F';

    const name1 = 'USDC';
    const symbol1 = 'USDC';
    const decimals1 = 18;
    const address1 = '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'; 

    // Define the swap parameters
    const inputAmount = ethers.utils.parseUnits("1", decimals0);
    const approvalAmount = inputAmount.mul(100000);

    // Approve the SwapRouter to spend token
    const tokenContract0 = new ethers.Contract(address0, ERC20ABI, provider);
    const tokenContract1 = new ethers.Contract(address1, ERC20ABI, provider);

    await tokenContract0.connect(signer2).approve(swapRouterAddress, approvalAmount);
    await tokenContract1.connect(signer2).approve(swapRouterAddress, approvalAmount);

    // Set up swap parameters
    const immutables = await getPoolImmutables(poolContract);
    const state = await getPoolState(poolContract);

    const params = {
        tokenIn: immutables.token1,
        tokenOut: immutables.token0,
        fee: 500,
        recipient: signer2.address,
        deadline: Math.floor(Date.now() / 1000) + (60 * 10),
        amountIn: inputAmount,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
    };

    // Execute the swap
    const transaction = await swapRouterContract.connect(signer2).exactInputSingle(params, {
        gasLimit: ethers.utils.hexlify(1000000)
    });

    console.log(`Transaction hash: ${transaction.hash}`);
    const receipt = await transaction.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
