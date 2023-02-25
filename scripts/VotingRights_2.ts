import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();


//Chairperson gives right to votes for diff voters/addresses which are passed as parameters
//from: '0x11f84712f66f76d2AE20D07a1347E806098fC44D',
//contractAddress: '0xB2CE688C4491933eB1D9238FD3bDaEf5E1d12F1A',
//yarn run ts-node --files ./scripts/VotingRights_2.ts "0xB2CE688C4491933eB1D9238FD3bDaEf5E1d12F1A" "0xC9aA59Bf68ff97fC67cDade3F20ed8220bF6762B" "0xc045Bbcab0CB395B5C0a76dEfE1B23111197fc00"
async function main() {
    const args = process.argv;

    // TODO: do proper check before using it
    const ballotContractAddress = args.slice(2, 3)[0];
    const voters = args.slice(3);

    if (!ballotContractAddress || ballotContractAddress.length <= 0) {
        throw new Error("Missing ballot contract address parameter");
    }

    if (voters.length <= 0) {
        throw new Error("Missing parameter: voters");
    }

    console.log(`voters are ${voters}`)
  
    //const provider =  ethers.getDefaultProvider("goerli");
    const provider = new ethers.providers.AlchemyProvider(
        "goerli",
        process.env.ALCHEMY_API_KEY
      );
    
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || privateKey.length <= 0)
      throw new Error("Missing environment: Mnemonic seed");
    const wallet = new ethers.Wallet(privateKey);
    console.log(`Connected to the wallet address ${wallet.address}`);
    const signer = wallet.connect(provider);
  
    // Attach to existing contract
    const ballotContractFactory = new Ballot__factory(signer);
    const ballotContract = ballotContractFactory.attach(ballotContractAddress);

    voters.map(async v=>{
       console.log(`giving voting rights to ${v}`)
        const txReceipt = await ballotContract.giveRightToVote(v)
        console.log(`Gave right to vote for ${v} and tx id is ${txReceipt}`)
     });
  }

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });