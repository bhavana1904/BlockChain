async function main() {
    const InsurancePolicy = await ethers.getContractFactory('InsurancePolicy');
    const insurancePolicy = await InsurancePolicy.deploy();
    await insurancePolicy.deployed();
    console.log('InsurancePolicy deployed to:', insurancePolicy.address);
    const [deployer] = await ethers.getSigners();
    //console.log("Deploying contract with the account:", deployer.address);
    const Claim = await ethers.getContractFactory("Claim");
    const claim = await Claim.deploy();
    await claim.deployed();
    console.log("Claim contract deployed to:", claim.address);


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
