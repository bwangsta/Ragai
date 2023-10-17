import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, View, FlatList } from "react-native"
import SafeArea from "../components/SafeArea"

type Item = {
  _id: string
  name: string
  image: string
  tags: string[]
}

export default function InventoryScreen() {
  const [itemsData, setItemsData] = useState<Item[]>([])

  useEffect(() => {
    async function getItems() {
      try {
        const response = await fetch("http://10.0.2.2:3000/images")
        const data = await response.json()
        setItemsData(data)
      } catch (e) {
        console.log(e)
      }
    }
    getItems()
  }, [])

  return (
    <SafeArea>
      <FlatList
        data={itemsData}
        extraData={itemsData}
        numColumns={2}
        horizontal={false}
        columnWrapperStyle={styles.column}
        renderItem={({ item }) => (
          <View key={item._id} style={styles.itemContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              borderRadius={8}
            />
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.tagsList}>
              {item.tags.map((tag) => (
                <Text key={tag} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        )}
      />
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  column: {
    justifyContent: "center",
    gap: 8,
  },
  itemContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  grid: {
    justifyContent: "center",
    gap: 8,
  },
  image: {
    width: "100%",
    height: 150,
  },
  name: {
    paddingVertical: 4,
  },
  tag: {
    backgroundColor: "gray",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
})
