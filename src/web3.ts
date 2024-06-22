import Web3 from 'web3';
const getWeb3 = () => {
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  return web3;
};
export default getWeb3;
