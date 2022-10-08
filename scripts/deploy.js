const hre = require("hardhat");

async function main() {
    // we get the contract to deploy

    const BuyMeCoffee = await hre.ethers.getContractFactory("BuyMeCoffee");
    const buyMeCoffee = await BuyMeCoffee.deploy();

    await buyMeCoffee.deployed();
    console.log("Buy me a coffee is deployed to:", buyMeCoffee.address);
}

//handling error

main() 
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });