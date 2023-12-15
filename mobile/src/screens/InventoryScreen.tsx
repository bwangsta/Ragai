import { useState, useCallback } from "react"
import { Image, StyleSheet, Text, View, FlatList } from "react-native"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useFocusEffect } from "@react-navigation/native"
import SafeArea from "../components/SafeArea"
import { getData } from "../services/api"
import { colors } from "../styles/colors"

type Item = {
  id: string
  metadata: {
    desc: string
    tags: string[]
    url: string
  }
}

export default function InventoryScreen() {
  const tabBarHeight = useBottomTabBarHeight()
  const [itemsData, setItemsData] = useState<Item[]>([])

  useFocusEffect(
    useCallback(() => {
      getData("/items")
        .then((data) => setItemsData(data))
        .catch((e) => console.log(e))
    }, [])
  )

  return (
    <SafeArea
      insets="top left right"
      style={{ backgroundColor: colors.white, marginBottom: tabBarHeight }}
    >
      <FlatList
        data={itemsData}
        extraData={itemsData}
        numColumns={2}
        horizontal={false}
        initialNumToRender={4}
        columnWrapperStyle={styles.column}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.itemContainer}>
            <Image
              source={{ uri: item.metadata.url }}
              style={styles.image}
              borderRadius={8}
            />
            <Text style={styles.name}>{item.metadata.desc}</Text>
            <View style={styles.tagsList}>
              {item.metadata.tags.map((tag) => (
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
    height: 240,
  },
  name: {
    paddingVertical: 4,
    color: colors.black,
    fontWeight: "bold",
  },
  tag: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
})
