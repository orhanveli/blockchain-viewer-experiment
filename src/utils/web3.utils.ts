import Web3 from 'web3';
import { config } from '../constants';

export const web3Instance = new Web3(config.cryptoNetworkUri);
