import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();



//contractAddress: '0xdf0530a01290Db7d7f921a0A910451a5c32b1EFc',
//delegated voter: '1',
//yarn run ts-node --files ./scripts/DelegatingVotes_4.ts "0xdf0530a01290Db7d7f921a0A910451a5c32b1EFc" "0xc045Bbcab0CB395B5C0a76dEfE1B23111197fc00"
async function main() {
    const args = process.argv;

    // TODO: do proper check before using it
    const ballotContractAddress = args.slice(2, 3)[0];
    const delegatedVoterAddress = args.slice(3, 4)[0];

    if (!ballotContractAddress || ballotContractAddress.length <= 0) {
        throw new Error("Missing ballot contract address parameter");
    }

    if (!delegatedVoterAddress || delegatedVoterAddress.length <= 0) {
        throw new Error("Missing delegatedVoterAddress parameter");
    }



    console.log(`delegatedVoterAddress is ${delegatedVoterAddress}`)
  
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
    const txReceipt =  await ballotContract.giveRightToVote(delegatedVoterAddress,{
        gasLimit: 100000
      });
    console.log(`vote receipt ${txReceipt}`)
  }

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });