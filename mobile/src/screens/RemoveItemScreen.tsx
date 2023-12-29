import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useEffect, useState } from "react"
import SafeArea from "../components/SafeArea"
import Loading from "../components/Loading"
import { Item, RootStackScreenProps } from "../types"
import { colors } from "../styles/colors"
import { deleteData, postImage } from "../services/api"

type RemoveItemScreenProps = RootStackScreenProps<"Remove">

export default function RemoveItemScreen({
  navigation,
  route,
}: RemoveItemScreenProps) {
  const { imageData } = route.params
  const [items, setItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<Item>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    postImage("/items/similar?limit=10", imageData)
      .then((data) => setItems(data))
      .catch((e) => console.log(e))
      .finally(() => setIsLoading(false))
  }, [])

  function handleCancelPress() {
    navigation.navigate("Home", { screen: "Camera" })
  }

  async function handleConfirmPress() {
    try {
      await deleteData(`/items/${selectedItem?.id}`)
      navigation.navigate("Home", { screen: "Camera" })
    } catch (error) {
      console.log(error)
    }
  }

  function handleImagePress(item: Item) {
    setSelectedItem(item)
  }

  if (isLoading) {
    return <Loading message="Searching for the item..." />
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 5 }}>
        <Image
          style={{ flex: 5 }}
          source={{ uri: selectedItem?.metadata.url ?? items[0].metadata.url }}
        />
        <FlatList
          data={items}
          horizontal={true}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleImagePress(item)}>
              <Image
                source={{ uri: item.metadata.url }}
                style={{ width: 100, flex: 1 }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
      <SafeArea>
        <Text>Are you sure you want to delete this item?</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.secondary }]}
            onPress={handleCancelPress}
          >
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleConfirmPress}
          >
            <Text style={styles.text}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </SafeArea>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 32,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  text: {
    color: colors.white,
    fontSize: 16,
  },
})
