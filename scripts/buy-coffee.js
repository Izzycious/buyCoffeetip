const hre = require("hardhat");

//returns Ethers of the given address
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

//logs the Ether balances for a list of addresses 
async function printBalances(addresses) {
  let idx = 0;
  for(const address of addresses) {
    console.log(`Address ${idx} balance:`, await getBalance(address));
    idx++;
  }
}

//Logs the memos stored on chain from coffee purchases.

async function printMemos(memos) {
  for(const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}
async function main() {
  //Get the example accounts we'll be working on
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  //We give the contract to deploy 
  const BuyMeCoffee = await hre.ethers.getContractFactory("BuyMeCoffee");
  const buyMeCoffee = await BuyMeCoffee.deploy();

  //deploy contract 
  await buyMeCoffee.deployed();
  console.log("BuyMeACoffee deployed to :", buyMeCoffee.address);

  //check balances before the coffee purchase
  const addresses = [owner.address, tipper.address, buyMeCoffee.address];
  console.log("=== start ===");
  await printBalances(addresses);

  //Buy owner a few coffee
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeCoffee.connect(tipper).buyCoffee("Umar", "You are awesome and i appreciate it all", tip);
  await buyMeCoffee.connect(tipper2).buyCoffee("Akintunde Ismaheel", "I love your steadfastness and i appreciate all ya effort", tip);
  await buyMeCoffee.connect(tipper3).buyCoffee("Ayomide Fadoro", "I wish you would learn this thing, it is going to berewarding", tip);

  //check the balance of the coffee purchase
  console.log("=== bought coffee ===");
  await printBalances(addresses);

  //withdraw 
  await buyMeCoffee.connect(owner).withdrawTips();

  //check balances after withdrawal 
  console.log("=== withdrawTips ===");
  await printBalances(addresses);

  //checkout Memos
  console.log("=== Memos ===");
  const memos = await buyMeCoffee.getMemos();
  printMemos(memos);
}

  //We need to handle error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
