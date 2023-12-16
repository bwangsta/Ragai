import { useState, useEffect, useRef } from "react"
import { getData, postImage } from "./services/api"

type Item = {
  id: string
  values: number[]
  score: number
  metadata: {
    desc: string
    tags: string[]
    url: string
  }
}

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [fileData, setFileData] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getData("/items/").then((data) => setItems(data))
  }, [])

  useEffect(() => {
    if (fileData) {
      setPreviewUrl(URL.createObjectURL(fileData))
    }
    return () => URL.revokeObjectURL(previewUrl)
  }, [fileData])

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.target
    if (files && files.length > 0) {
      setFileData(files[0])
    }
  }

  function handleButtonClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (fileData) {
      const formData = new FormData()
      formData.append("file", fileData)
      const newItems = await postImage("/items/similar", formData)
      setItems(newItems)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4">
      <div className="grid items-center gap-4 py-4 sm:grid-cols-2">
        <form
          encType="multipart/form-data"
          className="order-2 flex-1 sm:order-1"
          onSubmit={handleSubmit}
        >
          <label htmlFor="image-file"></label>
          <input
            id="image-file"
            type="file"
            accept="image/*"
            name="image"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="space-y-4">
            <button
              type="button"
              className="w-full rounded-2xl border-2 border-dashed border-black bg-secondary px-2 py-4 text-3xl text-black sm:h-72"
              onClick={handleButtonClick}
            >
              {fileData ? fileData.name : "Select An Image"}
            </button>
            <button
              type="submit"
              className="w-full rounded-lg border bg-primary px-1 py-2 text-2xl text-white"
            >
              Upload
            </button>
          </div>
        </form>
        {previewUrl && (
          <div className="order-1 mx-auto sm:order-2">
            <div className="sm:h-96">
              <img
                src={previewUrl}
                alt={previewUrl}
                className="mx-auto h-full w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-fluid gap-4 py-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-md bg-secondary"
          >
            <img
              src={item.metadata.url}
              alt={item.metadata.desc}
              className="h-96 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="mb-4 text-lg font-semibold text-black">
                {item.metadata.desc}
              </h2>
              <h2 className="mb-4 text-lg font-semibold text-black">
                Score: {item.score}
              </h2>
              <div className="flex flex-wrap gap-1">
                {item.metadata.tags.map((tag) => (
                  <p
                    key={tag}
                    className="rounded-lg bg-primary px-2 py-1 text-white"
                  >
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
