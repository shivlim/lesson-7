import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();


/**
 * Casts votes on smartcontract using voter private key
 * Ex: yarn run ts-node --files ./scripts/CastingVotes_3.ts "0xFE4235a6e0877B887970A08409064ff4702CEc34" "1"
 * where 0xFE4235a6e0877B887970A08409064ff4702CEc34 is the smartcontract address
 * and 1 is the proposal index
 */
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
    
    const privateKey = process.env.VOTER_PRIVATE_KEY;
    if (!privateKey || privateKey.length <= 0)
      throw new Error("Missing environment: Mnemonic seed");
    const wallet = new ethers.Wallet(privateKey);
    console.log(`Connected to the wallet address ${wallet.address}`);
    const signer = wallet.connect(provider);
  
    // Attach to existing contract
    const ballotContractFactory = new Ballot__factory(signer);
    const ballotContract = ballotContractFactory.attach(ballotContractAddress);
    const txReceipt =  await ballotContract.vote(proposalIndex,{
        gasLimit: 100000
      });
    console.log(`vote receipt ${txReceipt.hash}`)
  }

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });