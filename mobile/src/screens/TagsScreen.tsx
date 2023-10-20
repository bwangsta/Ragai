import { useState } from "react"
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { RootStackScreenProps } from "../types"
import SafeArea from "../components/SafeArea"
import Tag from "../components/Tag"
import { deleteData, postData } from "../services/api"
import { colors } from "../styles/colors"

type TagsScreenProps = RootStackScreenProps<"Tags">

export default function TagsScreen({ navigation, route }: TagsScreenProps) {
  const { key, url } = route.params

  const [tags, setTags] = useState<string[]>([
    "t-shirt",
    "shirt",
    "red",
    "jacket",
    "hoodie",
    "fur jacket",
    "pants",
  ])
  const [tagInput, setTagInput] = useState("")

  function deleteTag(selectedTag: string) {
    setTags((prevTags) => prevTags.filter((tag) => tag !== selectedTag))
  }

  function handleInputChange(text: string) {
    setTagInput(text)
  }

  function handleSubmitEditing() {
    setTags((prevTags) => [...prevTags, tagInput])
    setTagInput("")
  }

  function finishEditing(index: number, newTag: string) {
    setTags((prevTags) =>
      prevTags.map((tag, i) => (i === index ? newTag : tag))
    )
  }

  async function handleCancel() {
    navigation.navigate("Home", { screen: "Camera" })
    await deleteData(`/images/${key}`)
  }

  async function handleSubmit() {
    const formData = new FormData()
    formData.append(
      "data",
      JSON.stringify({
        name: "Some clothing",
        image: url,
        tags: tags,
      })
    )
    navigation.navigate("Home", { screen: "Camera" })
    await postData("/items", formData)
  }

  return (
    <SafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, paddingBottom: 16 }}
      >
        <Image style={{ flex: 2 }} source={{ uri: url }} resizeMode="contain" />
        <View style={styles.tagsList}>
          {tags.map((tag, index) => (
            <Tag
              key={tag}
              index={index}
              name={tag}
              deleteTag={deleteTag}
              finishEditing={finishEditing}
            />
          ))}
        </View>
        <View style={styles.inputBox}>
          <TextInput
            autoCapitalize="none"
            placeholder="Add tags"
            placeholderTextColor={colors.white}
            value={tagInput}
            style={styles.input}
            maxLength={20}
            onChangeText={handleInputChange}
            onSubmitEditing={handleSubmitEditing}
          />
          <Ionicons
            name="add"
            size={24}
            color={colors.white}
            style={{ padding: 8 }}
          />
        </View>
      </KeyboardAvoidingView>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.secondary }]}
          onPress={handleCancel}
        >
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.text}>Submit</Text>
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
    paddingVertical: 32,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
    paddingVertical: 16,
    flex: 1,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  input: {
    flex: 1,
    paddingLeft: 8,
    color: colors.white,
  },
  text: {
    color: colors.white,
    fontSize: 16,
  },
})
