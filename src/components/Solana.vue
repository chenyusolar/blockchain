<template>
  <div>
    <button @click="connectWallet" v-if="!isConnected">连接SOL钱包</button>
    <div v-else>
      <p>钱包地址: {{ walletAddress }}</p>
      <p>SOL 余额: {{ balance }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

const isConnected = ref(false)
const walletAddress = ref('')
const balance = ref(0)

const connectWallet = async () => {
  if ('solana' in window) {
    try {
      // 请求连接到钱包
      const provider = window.solana
      await provider.connect()

      // 获取钱包地址
      walletAddress.value = provider.publicKey.toString()

      // 创建连接
      // Solana 官方文档: https://docs.solana.com/developing/clients/jsonrpc-api
      // 主网: https://api.mainnet-beta.solana.com
      // 测试网: https://api.devnet.solana.com
      const connection = new Connection('https://api.devnet.solana.com')

      // 获取余额
      const balanceLamports = await connection.getBalance(new PublicKey(walletAddress.value))
      balance.value = balanceLamports / LAMPORTS_PER_SOL

      isConnected.value = true
    } catch (error) {
      console.error('连接钱包失败:', error)
    }
  } else {
    alert('请安装Solana钱包!')
  }
}

onMounted(() => {
  // 检查是否已经连接
  if ('solana' in window) {
    window.solana.connect({ onlyIfTrusted: true })
        .then(() => {
          connectWallet()
        })
        .catch(() => {
          // 用户没有已连接的钱包，不执行任何操作
        })
  }
})
</script>