const main = async () => {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  //const lockedAmount = hre.ethers.utils.parseEther("1");

  const transactionsFactory = await hre.ethers.getContractFactory("Transactions");// like a class to generate instances of that specific contract
  const transactionsContract = await transactionsFactory.deploy();

  await transactionsContract.deployed();

  console.log('Transaction deployed to: ', transactionsContract.address);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();