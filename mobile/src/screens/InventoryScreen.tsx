import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, View, FlatList } from "react-native"
import SafeArea from "../components/SafeArea"

export default function InventoryScreen() {
  const [urls, setUrls] = useState([])
  const data = urls.map((url) => {
    return {
      url: url,
    }
  })

  useEffect(() => {
    async function getImages() {
      try {
        const response = await fetch("http://10.0.2.2:3000/images")
        const data = await response.json()
        setUrls(data.urls)
      } catch (e) {
        console.log(e)
      }
    }
    getImages()
  }, [])

  return (
    <SafeArea>
      <FlatList
        data={data}
        extraData={urls}
        numColumns={3}
        horizontal={false}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 8,
        }}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: item.url }}
              style={styles.image}
              borderRadius={8}
            />
            <Text>Image Name</Text>
          </View>
        )}
      />
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
  },
  grid: {
    justifyContent: "center",
    gap: 8,
  },
  image: {
    width: "100%",
    height: 150,
  },
})
