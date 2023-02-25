import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();



//contractAddress: '0xB2CE688C4491933eB1D9238FD3bDaEf5E1d12F1A',
//yarn run ts-node --files ./scripts/QueryingResults_5.ts "0xB2CE688C4491933eB1D9238FD3bDaEf5E1d12F1A"
async function main() {
    const args = process.argv;

    // TODO: do proper check before using it
    const ballotContractAddress = args.slice(2, 3)[0];
    const proposalIndex = args.slice(3, 4)[0];

    if (!ballotContractAddress || ballotContractAddress.length <= 0) {
        throw new Error("Missing ballot contract address parameter");
    }

  
    //const provider =  ethers.getDefaultProvider("goerli");
    const provider = new ethers.providers.AlchemyProvider(
        "goerli",
        process.env.ALCHEMY_API_KEY
      );
    
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || privateKey.length <= 0)
      throw new Error("Missing environment: private key");
    const wallet = new ethers.Wallet(privateKey);
    console.log(`Connected to the wallet address ${wallet.address}`);
    const signer = wallet.connect(provider);
  
    // Attach to existing contract
    const ballotContractFactory = new Ballot__factory(signer);
    const ballotContract = ballotContractFactory.attach(ballotContractAddress);
    const winnerAddress =  await ballotContract.winnerName();
    const winnerName =  ethers.utils.parseBytes32String(winnerAddress)
    console.log(`winnername ${winnerName}`)
  }

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });