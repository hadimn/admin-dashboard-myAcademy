import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
  // 👇 THIS LINE IS REQUIRED
  // @ts-ignore
  window.Pusher = Pusher

  const echo = new Echo({
    broadcaster: 'reverb', // 👈 still reverb
    key: 't491v4yed8qzce49b136',
    wsHost: 'localhost',
    wsPort: 8080,
    forceTLS: false,
    disableStats: true,
  })

  return {
    provide: { echo },
  }
})
