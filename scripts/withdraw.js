const { Provider } = require("@ethersproject/abstract-provider");
const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeCoffee.sol/BuyMeCoffee.json");

async function getBalance(provider, address) {
    const balanceBigInt = await provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
    //Get the contract that has been deployed to goerli
    const contractAddress = "0x72E5C75cC16BAAb730128981E28b96CDb6f638fD";
    const abi = abi.abi;

    //get the node connection and wallet connection.

    const provider = new hre.ethers.providers.AlchemyProvider(
        "goerli", 
        process.env.GOERLI_API_KEY
        );

    //Ensuring that the signer is the same as the deployer
    //else script will fail
    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

    //Instantiate connected contracts
    const buyMeCoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

    //checking starting balance 
    console.log("current balance of owner:", await getBalance(provider, signer.address), "ETH");
    const contractBalance = await getBalance(provider, buyMeCoffee.address);
    console.log("Current balance of contract:", await getBalance(provider, buyMeCoffee.address), "ETH");

    //withdraw funds if there are any funds to withdraw
    if(contractBalance !== "0.0") {
        console.log("withdrawing funds....");
        const withrawTxn = await buyMeCoffee.withdrawTips();
        await withrawTxn.wait();
    } else {
        console.log("no funds to withraw");
    }

    //check ending balance.
    console.log("current balance of owner:", await getBalance(provider, signer.address), "ETH");

    //Handling error
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}