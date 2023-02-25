import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();



//contractAddress: '0xB2CE688C4491933eB1D9238FD3bDaEf5E1d12F1A',
//proposal index: '1',
//yarn run ts-node --files ./scripts/CastingVotes_3.ts "0xB2CE688C4491933eB1D9238FD3bDaEf5E1d12F1A" "1"
async function main() {
    const args = process.argv;

    // TODO: do proper check before using it
    const ballotContractAddress = args.slice(2, 3)[0];
    const proposalIndex = args.slice(3, 4)[0];

    if (!ballotContractAddress || ballotContractAddress.length <= 0) {
        throw new Error("Missing ballot contract address parameter");
    }

    if (!proposalIndex || proposalIndex.length <= 0) {
        throw new Error("Missing proposalIndex parameter");
    }



    console.log(`proposalIndex is ${proposalIndex}`)
  
    //const provider =  ethers.getDefaultProvider("goerli");
    const provider = new ethers.providers.AlchemyProvider(
        "goerli",
        process.env.ALCHEMY_API_KEY
      );
    
    const privateKey = process.env.DELEGATING_VOTER_PRIVATE_KEY;
    if (!privateKey || privateKey.length <= 0)
      throw new Error("Missing environment: Mnemonic seed");
    const wallet = new ethers.Wallet(privateKey);
    console.log(`Connected to the wallet address ${wallet.address}`);
    const signer = wallet.connect(provider);
  
    // Attach to existing contract
    const ballotContractFactory = new Ballot__factory(signer);
    const ballotContract = ballotContractFactory.attach(ballotContractAddress);
    const txReceipt =  await ballotContract.vote(proposalIndex);
    console.log(`vote receipt ${txReceipt}`)
  }

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });