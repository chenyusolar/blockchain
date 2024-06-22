<template>
  <div>
    <h1>Blockchain Wallet</h1>
    <button @click="connectWallet">Connect Wallet</button>
    <div v-if="account">
      <p>Account: {{ account }}</p>
      <p>ETH Balance: {{ ethBalance }}</p>
      <p>BNB Balance: {{ bnbBalance }}</p>

      <form @submit.prevent="sendTransaction">
        <div>
          <label for="to">Recipient Address:</label>
          <input v-model="to" id="to" type="text" required />
        </div>
        <div>
          <label for="amount">Amount:</label>
          <input v-model="amount" id="amount" type="number" step="0.01" required />
        </div>
        <div>
          <label for="network">Network:</label>
          <select v-model="network" id="network">
            <option value="ethereum">Ethereum</option>
            <option value="bsc">Binance Smart Chain</option>
          </select>
        </div>
        <button type="submit">Send</button>
      </form>

      <div v-if="transactionHash">
        <p>Transaction Hash: {{ transactionHash }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import getWeb3 from '../web3'
import Web3 from 'web3';

const account = ref<string | null>(null);
const ethBalance = ref<string | null>(null);
const bnbBalance = ref<string | null>(null);
const to = ref('');
const amount = ref<number | null>(null);
const network = ref('ethereum');
const transactionHash = ref<string | null>(null);

const web3 = getWeb3();


const connectWallet = async () => {
  try {
    const accounts = await web3.eth.requestAccounts();
    account.value = accounts[0];
    await updateBalances();
  } catch (error) {
    console.error('Failed to connect wallet:', error);
  }
};


const updateBalances = async () => {
  if (account.value) {
    // Update ETH balance
    const ethBal = await web3.eth.getBalance(account.value);
    ethBalance.value = web3.utils.fromWei(ethBal, 'ether');

    // Update BNB balance (using BSC provider)
    const bscWeb3 =  new Web3('https://bsc-dataseed.binance.org/');
    const bnbBal = await bscWeb3.eth.getBalance(account.value);
    bnbBalance.value = bscWeb3.utils.fromWei(bnbBal, 'ether');
  }
};


const sendTransaction = async () => {
  if (!account.value || !to.value || !amount.value) return;
  try {
    let tx;
    const value = web3.utils.toWei(amount.value.toString(), 'ether');

    if (network.value === 'ethereum') {
      tx = await web3.eth.sendTransaction({
        from: account.value,
        to: to.value,
        value,
      });
    } else if (network.value === 'bsc') {
      const bscWeb3 = new Web3('https://bsc-dataseed.binance.org/');
      tx = await bscWeb3.eth.sendTransaction({
        from: account.value,
        to: to.value,
        value,
      });
    }

    transactionHash.value = tx.transactionHash;
  } catch (error) {
    console.error('Transaction failed:', error);
  }
};

onMounted(() => {
  if (account.value) {
    updateBalances();
  }
});


</script>

<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 16px;
}
form div {
  margin-bottom: 8px;
}
label {
  display: block;
  margin-bottom: 4px;
}
input, select {
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
}
button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #38a169;
}
</style>
