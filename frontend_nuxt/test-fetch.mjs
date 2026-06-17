import { $fetch } from 'ofetch'

async function test() {
  try {
    const res = await $fetch('http://localhost:3000/api/taches', {
      query: { typeTache: 'PUBLICATION,SPONSORISATION,MAILING,ADMINISTRATIVE' }
    })
    console.log("Found:", res.length)
  } catch (e) {
    console.error("Error:", e.message)
  }
}
test()
