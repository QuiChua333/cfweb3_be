import { envs } from '@/config';
import { Injectable } from '@nestjs/common';
import { Contract, ContractEventPayload, ethers, EventLog, formatEther } from 'ethers';
import { factoryAbi } from './abi/factoryAbi';
import { CreateNFTDto } from '@/api/nft/dto';
import { NftService } from '@/api/nft/nft.service';
import { RepositoryService } from '@/repositories/repository.service';
import { PaymentStatus } from '@/constants';
import { ContributionService } from '@/api/contribution/contribution.service';
@Injectable()
export class Web3Service {
  private contract: Contract;
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly contributionService: ContributionService,
  ) {
    const provider = new ethers.JsonRpcProvider(envs.web3.rpcUrl);
    const wallet = new ethers.Wallet(envs.web3.privateKey, provider);
    const contract = new ethers.Contract(envs.web3.factoryContractAddress, factoryAbi, wallet);
    this.contract = contract;
  }

  async setNumber(number: number) {
    const tx = await this.contract.setNumber(number);
    const receipt = await tx.wait();
    return receipt;
  }

  async getNumber() {
    const number = await this.contract.getNumber();
    return number;
  }

  // async createNFT(createNFTDto: CreateNFTDto, uri: string) {
  //   const valuePriceInWei = ethers.parseEther(createNFTDto.nftPrice.toString());
  //   const tx = await this.contract.createNFT(
  //     createNFTDto.authorAddress,
  //     createNFTDto.name,
  //     createNFTDto.symbol,
  //     uri,
  //     valuePriceInWei,
  //   );

  //   return tx;
  // }

  async watchContractEvent() {
    this.contract.on(
      'NewNFT',
      async (nftContractAddress, authorAddress, name, symbol, price, uri, nftCreationId, event) => {
        console.log(`Event NewNFT: updating database...`);
        await this.updateNFTCreation(nftContractAddress, authorAddress, nftCreationId, event);
      },
    );

    this.contract.on('TransferFund', async (sender, adminAddress, price, contributionId, event) => {
      console.log(`Event TransferFund: updating database...`);
      await this.updateContributionTransferFund(contributionId, sender, event);
    });

    this.contract.on('MintNFT', async (minter, nftAddress, price, name, symbol, tokenId, event) => {
      console.log(`Event MintNFT: updating database...`);
      await this.updateMintNFT(minter, tokenId);
    });

    this.contract.on('SetPrice', async (nftContractAddress, newPrice) => {
      console.log(`Event SetPrice: updating database...`);
      await this.updatePriceNFT(nftContractAddress, newPrice);
    });
  }

  async updateNFTCreation(
    nftContractAddress: string,
    authorAddress: string,
    nftCreationId: string,
    event: ContractEventPayload,
  ) {
    const transactionHash = event.log.transactionHash;
    const nftCreation = await this.repositoryService.nftCreation.findOne({
      where: {
        id: nftCreationId,
      },
    });

    if (!nftCreation) return;
    if (nftCreation.contractAddress) return;

    nftCreation.contractAddress = nftContractAddress;
    nftCreation.authorAddress = authorAddress;
    nftCreation.transactionHash = transactionHash;
    nftCreation.createdSuccess = true;
    await this.repositoryService.nftCreation.save(nftCreation);
    console.log(`Event NewNFT: updating database successfully...`);
  }

  async updateContributionTransferFund(
    contributionId: string,
    sender: string,
    event: ContractEventPayload,
  ) {
    const transactionHash = event.log.transactionHash;
    const contribution = await this.repositoryService.contribution.findOne({
      where: {
        id: contributionId,
      },
    });
    if (!contribution) return;
    if (contribution.transactionHash) return;
    contribution.transactionHash = transactionHash;
    contribution.customerWalletAddress = sender;
    contribution.status = PaymentStatus.SUCCESS;
    contribution.isFinish = true;
    await this.repositoryService.contribution.save(contribution);
    this.contributionService.sendMailContributionSuccess(contribution.id);
    console.log(`Event TransferFund: updating database successfully...`);
  }

  async updateMintNFT(minter: string, tokenId: number) {
    const nft = await this.repositoryService.nft.findOne({
      where: {
        tokenId,
      },
    });

    if (!nft) return;
    if (nft.isMinted) return;
    nft.isMinted = true;
    nft.ownerAddress = minter;

    await this.repositoryService.nft.save(nft);
    console.log(`Event MintNFT: updating database successfully...`);
  }

  async updatePriceNFT(nftContractAddress: string, newPrice: number) {
    // const perk = await this.repositoryService.perk.findOne({
    //   where: {
    //     nftCreation: {
    //       nftContractAddress,
    //     },
    //   },
    // });
    // perk.ethPrice = Number(formatEther(newPrice)) ?? 0;
    // await this.repositoryService.perk.save(perk);
    // console.log(`Event SetPrice: updating database successfully...`);
  }
}
