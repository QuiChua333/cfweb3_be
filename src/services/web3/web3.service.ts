import { envs } from '@/config';
import { Injectable } from '@nestjs/common';
import { Contract, ContractEventPayload, ethers, EventLog, formatEther } from 'ethers';
import { factoryAbi } from './abi/factoryAbi';
import { CreateNFTDto } from '@/api/nft/dto';
import { NftService } from '@/api/nft/nft.service';
import { RepositoryService } from '@/repositories/repository.service';
@Injectable()
export class Web3Service {
  private contract: Contract;
  constructor(private readonly repositoryService: RepositoryService) {
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

  async createNFT(createNFTDto: CreateNFTDto) {
    const valuePriceInWei = ethers.parseEther(createNFTDto.nftPrice.toString());
    const tx = await this.contract.createNFT(
      createNFTDto.authorAddress,
      createNFTDto.name,
      createNFTDto.symbol,
      valuePriceInWei,
    );
    return tx;
  }

  async watchContractEvent() {
    this.contract.on(
      'NewNFT',
      async (nftContractAddress, authorAddress, name, symbol, price, event) => {
        console.log(`Event NewNFT: updating database...`);
        await this.updateNFTCreation(nftContractAddress, event);
      },
    );

    this.contract.on('SetPrice', async (nftContractAddress, newPrice) => {
      console.log(`Event SetPrice: updating database...`);
      await this.updatePriceNFT(nftContractAddress, newPrice);
    });
  }

  async updateNFTCreation(nftContractAddress: string, event: ContractEventPayload) {
    const transactionHash = event.log.transactionHash;
    const nftCreation = await this.repositoryService.nftCreation.findOne({
      where: {
        transactionHash,
      },
    });

    if (!nftCreation) return;
    if (nftCreation.nftContractAddress) return;

    nftCreation.nftContractAddress = nftContractAddress;
    await this.repositoryService.nftCreation.save(nftCreation);
    console.log(`Event NewNFT: updating database successfully...`);
  }

  async updatePriceNFT(nftContractAddress: string, newPrice: number) {
    const nftCreation = await this.repositoryService.nftCreation.findOne({
      where: {
        nftContractAddress,
      },
    });
    nftCreation.price = Number(formatEther(newPrice));
    await this.repositoryService.nftCreation.save(nftCreation);
    console.log(`Event SetPrice: updating database successfully...`);
  }
}
