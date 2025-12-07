// server/api/bitcoin.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.coingeckoApiKey // server-only key

  const data = await $fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&x_cg_demo_api_key=${apiKey}`
  )

  return data
})
