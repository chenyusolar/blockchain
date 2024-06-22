<template>
  <div>Ganache Acc1 Balance: {{ balance1 }}</div>
  <div>Ganache Acc2 Balance: {{ balance2 }}</div>
  <h1></h1>
  <div>
    <div>From:  <input v-model="transferFrom" type="text" placeholder="Transfer from Account" /></div>
    <div>Transfer TO:  <input v-model="transferTo" type="text" placeholder="Transfer to Account" /></div>
    <div>Transfer Amount:  <input v-model="transferAmount" type="text" placeholder="Amount to transfer" /></div>
    <div>Current Gas Price: {{ gasPrice }} Gwei</div>
    <button @click="transfer">Transfer</button>
  </div>

  <h1>Block Explorer</h1>
  <div>
    <input v-model="blockQuery" type="text" placeholder="Enter block number or hash" />
    <button @click="getBlock">Get Block Info</button>
  </div>

  <h1>Block Information</h1>
  <div v-if="blockInfo">
    <h2>Block Information</h2>
    <pre> BaseFeePerGas:  {{ blockInfo.value.baseFeePerGas }}</pre>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import Web3 from "web3"

const transferAmount = ref("")
const transferFrom = ref("0xDEE459Df8e068a1B4C41f4B13c590af03f2bb21D")  // 默认值可改为任意账户
const transferTo = ref("0x2EFe9e96Fdb75B7C9b8f4802DB68624238920bB6")  // 默认值可改为任意账户

const balance1 = ref("0")
const balance2 = ref("0")
const gasPrice = ref("0")
const blockQuery = ref("")
const blockInfo = ref(false)


// 链接区块链网络
const web3 = new Web3("http://127.0.0.1:7545")

//获取账户余额
async function getBalance(account: string): Promise<string> {
  try {
    const balanceWei = await web3.eth.getBalance(account)
    return web3.utils.fromWei(balanceWei, 'ether')
  } catch (error) {
    console.error("Error fetching balance:", error)
    return "0"
  }
}

//获取当前网络的Gas费用
async function getGasPrice() {
  try {
    const priceWei = await web3.eth.getGasPrice()
    return web3.utils.fromWei(priceWei, 'gwei')
  } catch (error) {
    console.error("Error fetching gas price:", error)
    return "0"
  }
}

//转账
async function transfer() {
  try {
    const amountInWei = web3.utils.toWei(transferAmount.value, 'ether')

    await web3.eth.sendTransaction({
      from: transferFrom.value,
      to: transferTo.value,
      value: amountInWei
    })

    // 更新余额
    balance1.value = await getBalance(transferFrom.value)
    balance2.value = await getBalance(transferTo.value)
    transferAmount.value = ""
  } catch (error) {
    console.error("Error during transfer:", error)
  }
}

// 获取区块信息
async function getBlock() {
  try {
    let block
    if (/^0x[a-fA-F0-9]{64}$/.test(blockQuery.value)) {
      block = await web3.eth.getBlock(blockQuery.value)
    } else if (/^\d+$/.test(blockQuery.value)) {
      block = await web3.eth.getBlock(parseInt(blockQuery.value))
    } else {
      console.error("Invalid block query")
      return
    }
    blockInfo.value = block
  } catch (error) {
    console.error("Error fetching block information:", error)
    blockInfo.value = false
  }
  if (blockInfo == null) {
     blockInfo.value = false
  }
  console.log(blockInfo.value)

  //console.log("---"+ blockInfo.value+ "---")
}

// 更新显示
onMounted(async () => {
  balance1.value = await getBalance(transferFrom.value)
  balance2.value = await getBalance(transferTo.value)
  gasPrice.value = await getGasPrice()
})
</script>
