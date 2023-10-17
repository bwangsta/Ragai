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
import { RootStackScreenProps } from "../types"
import SafeArea from "../components/SafeArea"
import Tag from "../components/Tag"
import { deleteData, postData } from "../services/api"

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
        style={{ flex: 1 }}
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
            value={tagInput}
            style={styles.input}
            maxLength={20}
            onChangeText={handleInputChange}
            onSubmitEditing={handleSubmitEditing}
          />
          <Text style={styles.addIcon}>+</Text>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
    paddingVertical: 32,
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
    alignItems: "center",
    gap: 4,
    paddingVertical: 16,
    flex: 1,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
  },
  input: {
    flex: 1,
    paddingLeft: 8,
  },
  addIcon: {
    padding: 8,
  },
})
