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
  const { key, url, id, tags, description, embeddings } = route.params

  let formattedTags = tags.split("|")
  formattedTags = formattedTags.map((tag) => tag.trim().toLowerCase())
  const [imageTags, setImageTags] = useState<string[]>(formattedTags)
  const [tagInput, setTagInput] = useState("")

  function deleteTag(selectedTag: string) {
    setImageTags((prevTags) => prevTags.filter((tag) => tag !== selectedTag))
  }

  function handleInputChange(text: string) {
    setTagInput(text)
  }

  function handleSubmitEditing() {
    setImageTags((prevTags) => [...prevTags, tagInput])
    setTagInput("")
  }

  function finishEditing(index: number, newTag: string) {
    setImageTags((prevTags) =>
      prevTags.map((tag, i) => (i === index ? newTag : tag))
    )
  }

  async function handleCancel() {
    navigation.navigate("Home", { screen: "Camera" })
    await deleteData(`/images/${key}`)
  }

  async function handleSubmit() {
    navigation.navigate("Home", { screen: "Camera" })
    try {
      await postData("/items", {
        id: id,
        metadata: {
          url: url,
          desc: description,
          tags: imageTags,
        },
        values: embeddings,
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <SafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, paddingBottom: 16 }}
      >
        <Image style={{ flex: 2 }} source={{ uri: url }} resizeMode="contain" />
        <Text>{description}</Text>
        <View style={styles.tagsList}>
          {imageTags.map((tag, index) => (
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
