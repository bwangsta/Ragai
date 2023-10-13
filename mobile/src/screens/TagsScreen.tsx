import { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native"
import { RootStackScreenProps } from "../types"
import SafeArea from "../components/SafeArea"
import Tag from "../components/Tag"

type TagsScreenProps = RootStackScreenProps<"Tags">

export default function TagsScreen({ navigation, route }: TagsScreenProps) {
  const { uri } = route.params
  const [tags, setTags] = useState<string[]>([
    "t-shirt",
    "shirt",
    "red",
    "jacket",
    "hoodie",
    "fur jacket",
    "pants",
  ])

  return (
    <SafeArea>
      <Image
        style={{ flex: 3 }}
        source={{ uri: uri }}
        resizeMode="contain"
        borderRadius={8}
      />
      <View style={styles.tagsList}>
        {tags.map((tag) => (
          <Tag key={tag} name={tag} />
        ))}
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home", { screen: "Camera" })}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home", { screen: "Camera" })}
        >
          <Text>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 1,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderColor: "black",
    borderWidth: 1,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    paddingVertical: 16,
    flex: 1,
  },
})
