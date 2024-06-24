<template>
  <div>
    <button @click="connectWallet" v-if="!isConnected">连接钱包</button>
    <div v-else>
      <p>钱包地址: {{ walletAddress }}</p>
      <p>BNB 余额: {{ balance }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Web3 from 'web3'

export default {
  setup() {
    const web3 = ref(null)
    const isConnected = ref(false)
    const walletAddress = ref('')
    const balance = ref(0)

    const connectWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // 请求用户授权
          await window.ethereum.request({ method: 'eth_requestAccounts' })

          // 创建Web3实例
          web3.value = new Web3(window.ethereum)

          // 获取钱包地址
          const accounts = await web3.value.eth.getAccounts()
          walletAddress.value = accounts[0]

          // 获取BNB余额
          const balanceWei = await web3.value.eth.getBalance(walletAddress.value)
          balance.value = web3.value.utils.fromWei(balanceWei, 'ether')

          isConnected.value = true
        } catch (error) {
          console.error('连接钱包失败:', error)
        }
      } else {
        alert('请安装MetaMask!')
      }
    }

    onMounted(() => {
      // 检查是否已经连接
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
          if (accounts.length > 0) {
            connectWallet()
          }
        })
      }
    })

    return {
      isConnected,
      walletAddress,
      balance,
      connectWallet
    }
  }
}
</script>