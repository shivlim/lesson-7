import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();


/***
 * Gives voting rights to addresses using chairperson key
 * EX:yarn run ts-node --files ./scripts/VotingRights_2.ts "0xFE4235a6e0877B887970A08409064ff4702CEc34" "0xC9aA59Bf68ff97fC67cDade3F20ed8220bF6762B" "0xc045Bbcab0CB395B5C0a76dEfE1B23111197fc00" "0x78bC6B775Eb95f0D049bEA9593C03dDFB3306e74"
 * where 0xFE4235a6e0877B887970A08409064ff4702CEc34 is the contract addresses and 
 * all other parameters are addresses of voters
 */
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
     // Attach to existing contract
    const ballotContractFactory = new Ballot__factory(signer);
    const ballotContract = ballotContractFactory.attach(ballotContractAddress);
       console.log(`giving voting rights to ${v}`)
        const txReceipt = await ballotContract.giveRightToVote(v,{
          gasLimit: 100000
        })
        console.log(`Gave right to vote for ${v} and tx id is ${txReceipt.hash}`)
     });
  }

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });