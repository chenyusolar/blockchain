<template>
  <div>
    <h1>比特币钱包</h1>

    <div>
      <h2>钱包地址: {{ address }}</h2>
      <p>余额: {{ balance }} BTC</p>
      <button @click="refreshBalance">刷新余额</button>
    </div>

    <div>
      <h2>转账</h2>
      <input v-model="recipientAddress" placeholder="接收地址" />
      <input v-model="amount" type="number" step="0.00000001" placeholder="金额 (BTC)" />
      <button @click="sendTransaction">发送</button>
    </div>

    <div>
      <h2>最近交易</h2>
      <ul>
        <li v-for="tx in recentTransactions" :key="tx.txid">
          {{ tx.txid }} - {{ tx.amount }} BTC
        </li>
      </ul>
      <button @click="fetchTransactions">刷新交易</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import * as bitcoin from 'bitcoinjs-lib'

const address = ref('')
const balance = ref(0)
const recipientAddress = ref('')
const amount = ref(0)
const recentTransactions = ref([])

// 使用测试网络
const network = bitcoin.networks.testnet
const apiBaseUrl = 'https://api.blockcypher.com/v1/btc/test3'

// 生成新的钱包地址
const generateAddress = () => {
  const keyPair = bitcoin.ECPair.makeRandom({ network })
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })
  return address
}

// 查询余额
const refreshBalance = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/addrs/${address.value}/balance`)
    balance.value = response.data.balance / 100000000 // 转换为BTC
  } catch (error) {
    console.error('获取余额失败:', error)
  }
}

// 发送交易 (简化版,实际使用需要更复杂的逻辑)
const sendTransaction = async () => {
  alert('发送交易功能需要更复杂的实现,包括UTXO管理、签名等。这里仅作为示例。')
  // 实际实现需要:
  // 1. 获取UTXO
  // 2. 创建交易
  // 3. 签名交易
  // 4. 广播交易
}

// 获取最近交易
const fetchTransactions = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/addrs/${address.value}`)
    recentTransactions.value = response.data.txrefs.slice(0, 5).map(tx => ({
      txid: tx.tx_hash,
      amount: tx.value / 100000000
    }))
  } catch (error) {
    console.error('获取交易失败:', error)
  }
}

onMounted(() => {
  address.value = generateAddress()
  refreshBalance()
  fetchTransactions()
})
</script>