const BASE_URL = "http://localhost:8000"

export async function getData(endpoint: string) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`)
    const data = await response.json()
    return data
  } catch (e) {
    console.log(e)
  }
}

export async function postImage(endpoint: string, formData: FormData) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      body: formData,
    })
    const data = await response.json()
    return data
  } catch (e) {
    console.log(e)
  }
}
