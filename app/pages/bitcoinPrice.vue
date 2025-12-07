<script setup lang="ts">
const { data: res, pending, error, execute, refresh } = await useFetch<any>('/api/bitcoin')

const refetchBitcoinPrice = async () => {
  await execute()
}

onMounted(() => {
  setInterval(() => {
    refresh()
  }, 5000)
})
</script>

<template>
  <div>
    bitcoin price:
    <Uprogress />
    <span v-if="pending">Loading...</span>
    <span v-else-if="error" class="text-red-500">{{ error }}</span>
    <span v-else-if="res">{{ res.bitcoin.usd }}$</span>
    <button @click="refetchBitcoinPrice" class="bg-secondary">refresh price</button>
  </div>
</template>

<style scoped></style>
