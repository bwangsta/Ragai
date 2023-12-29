const BASE_URL = `http://${process.env.EXPO_PUBLIC_DOMAIN}:8000`

export async function getData(endpoint: string) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`)
    const data = await response.json()
    return data
  } catch (e) {
    console.log(e)
  }
}

export async function deleteData(endpoint: string) {
  try {
    await fetch(`${BASE_URL}${endpoint}`, { method: "DELETE" })
  } catch (e) {
    console.log(e)
  }
}

export async function postImage(endpoint: string, formData: FormData) {
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

export async function postData(endpoint: string, data: any) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    const responseData = await response.json()

    return responseData
  } catch (e) {
    console.log(e)
  }
}
