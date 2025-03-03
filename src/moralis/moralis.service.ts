import { Injectable, Logger } from '@nestjs/common';
import { ApiConfig } from '../config/api.config';
import EvmApi from '@moralisweb3/evm-api';
import Moralis from 'moralis';
import {
  EXCHANGE_NAME,
  MORALIS_BASE_URL,
  SUPPORTED_CHAIN_IDS,
  SUPPORTED_TOKENS,
} from '../common';
import { ethers } from 'ethers';
import { formatMoralisPairUrl } from '../utils';

@Injectable()
export class MoralisService {
  private evmApi: EvmApi.EvmApi;
  private baseUrl: string;

  private readonly logger = new Logger(MoralisService.name);

  constructor(private readonly apiConfig: ApiConfig) {
    this.baseUrl = MORALIS_BASE_URL;
    (async () => {
      await Moralis.start({ apiKey: this.apiConfig.moralisAPIKey });
      this.evmApi = Moralis.EvmApi;
    })();
  }

  async fetchPrice(
    token: SUPPORTED_TOKENS | string,
    chain: SUPPORTED_CHAIN_IDS | string,
  ): Promise<bigint> {
    const price = await this.evmApi.token
      .getTokenPrice({
        address: token,
        chain: chain,
        exchange: 'uniswap-v3',
        include: 'percent_change',
      })
      .then((res) => res.raw)
      .then((raw) => raw.usdPrice);

    this.logger.log(`Price of ${token} on chain ${chain} -> ${price}`);
    return ethers.parseEther(price.toString());
  }

  async getTokenPrice(
    tokenIn: string,
    chain: string,
    tokenOut: string,
  ): Promise<bigint> {
    const url = formatMoralisPairUrl(this.baseUrl, tokenIn, chain);

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-Key': this.apiConfig.moralisAPIKey,
      },
    };

    const index = await fetch(url, options)
      .then((res) => res.json())
      .then((res: any) => {
        return res.pairs.filter(
          (index: any) =>
            (index.base_token.toLowerCase() === tokenOut.toLowerCase() ||
              index.quote_token.toLowerCase() === tokenOut.toLowerCase()) &&
            index.exchange_name === EXCHANGE_NAME,
        );
      })
      .then((res) => res[0]);

    return ethers.parseEther(index.usd_price.toString());
  }
}
