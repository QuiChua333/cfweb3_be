import { envs } from '@/config';
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

@Injectable()
export class PinataService {
  private pinataAxios: AxiosInstance;
  constructor() {
    this.pinataAxios = axios.create({
      headers: {
        Authorization: `Bearer ${envs.pinata.jwt}`,
      },
    });
  }

  async uploadFile(formData: FormData, configHeader?: AxiosRequestConfig) {
    const res = await this.pinataAxios.post(
      `https://api.pinata.cloud/pinning/pinFileToIPFS`,
      formData,
      configHeader,
    );

    return res;
  }

  async uploadJSON(data: Object, configHeader?: AxiosRequestConfig) {
    const res = await this.pinataAxios.post(
      `https://api.pinata.cloud/pinning/pinJSONToIPFS`,
      data,
      configHeader,
    );

    return res;
  }
}
