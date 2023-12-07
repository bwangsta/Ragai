import { useState, useCallback } from "react"
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useFocusEffect } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import SafeArea from "../components/SafeArea"
import { getData } from "../services/api"
import { colors } from "../styles/colors"

type Item = {
  _id: string
  name: string
  image: string
  tags: string[]
}

export default function InventoryScreen() {
  const tabBarHeight = useBottomTabBarHeight()
  const [itemsData, setItemsData] = useState<Item[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const allTags = itemsData.flatMap((item) => item.tags)
  const tagsCounter: { [key: string]: number } = {}

  useFocusEffect(
    useCallback(() => {
      getData("/items")
        .then((data) => setItemsData(data))
        .catch((e) => console.log(e))
    }, [])
  )

  allTags.map((tag) => {
    if (tag in tagsCounter) {
      tagsCounter[tag] += 1
    } else {
      tagsCounter[tag] = 1
    }
  })

  function openModal() {
    setIsModalVisible(true)
  }

  function closeModal() {
    setIsModalVisible(false)
  }

  return (
    <SafeArea
      insets="top left right"
      style={{ backgroundColor: colors.white, marginBottom: tabBarHeight }}
    >
      <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={openModal}>
        <Ionicons name="filter" size={24} />
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <SafeArea>
          <TouchableOpacity onPress={closeModal}>
            <Ionicons name="close-sharp" size={24} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text>Tags</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
              {Object.entries(tagsCounter).map(([tag, count]) => (
                <TouchableOpacity
                  key={tag}
                  style={{
                    flexDirection: "row",
                    gap: 4,
                    backgroundColor: "gray",
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    borderRadius: 16,
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <Text style={{ color: colors.white }}>{tag}</Text>
                    <Text style={{ color: colors.white }}>{count}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={{
              alignItems: "center",
              backgroundColor: "gray",
              paddingVertical: 16,
            }}
            onPress={closeModal}
          >
            <Text>Apply Filters</Text>
          </TouchableOpacity>
        </SafeArea>
      </Modal>
      <FlatList
        data={itemsData}
        extraData={itemsData}
        numColumns={2}
        horizontal={false}
        initialNumToRender={4}
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
