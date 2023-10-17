const BASE_URL = "http://10.0.2.2:3000"

export async function getData(endpoint: string) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`)
    const data = await response.json()
    return data
  } catch (e) {
    console.log(e)
  }
}

export async function postData(endpoint: string, formData: FormData) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
    const data = await response.json()
    return data
  } catch (e) {
    console.log(e)
  }
}
