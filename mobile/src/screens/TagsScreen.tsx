import { useEffect, useState } from "react"
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
import Loading from "../components/Loading"
import { deleteData, postData, postImage } from "../services/api"
import { colors } from "../styles/colors"

type TagsScreenProps = RootStackScreenProps<"Tags">
type ItemInfo = {
  key: string
  url: string
  id: string
  tags: string[]
  description: string
  embeddings: number[]
}

export default function TagsScreen({ navigation, route }: TagsScreenProps) {
  const { imageData } = route.params

  const [tagInput, setTagInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [item, setItem] = useState<ItemInfo>({} as ItemInfo)

  useEffect(() => {
    async function getItem() {
      setIsLoading(true)
      try {
        const data = await postImage("/images/", imageData)
        const modelData = await postData("/models/", { url: data.url })
        const { id, tags, description, embeddings } = modelData
        setItem({
          key: data.key,
          url: data.url,
          id: id,
          tags: tags,
          description: description,
          embeddings: embeddings,
        })
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }
    getItem()
  }, [])

  function deleteTag(selectedTag: string) {
    setItem((prevItem) => ({
      ...prevItem,
      tags: prevItem.tags.filter((tag) => tag !== selectedTag),
    }))
  }

  function handleInputChange(text: string) {
    setTagInput(text)
  }

  function handleSubmitEditing() {
    setItem((prevItem) => ({
      ...prevItem,
      tags: [...prevItem.tags, tagInput],
    }))
    setTagInput("")
  }

  function finishEditing(index: number, newTag: string) {
    setItem((prevItem) => ({
      ...prevItem,
      tags: prevItem.tags.map((tag, i) => (i === index ? newTag : tag)),
    }))
  }

  async function handleCancel() {
    navigation.navigate("Home", { screen: "Camera" })
    await deleteData(`/images/${item.key}`)
  }

  async function handleSubmit() {
    navigation.navigate("Home", { screen: "Camera" })
    try {
      await postData("/items/", {
        id: item.id,
        metadata: {
          url: item.url,
          desc: item.description,
          tags: item.tags,
        },
        values: item.embeddings,
      })
    } catch (e) {
      console.log(e)
    }
  }

  if (isLoading) {
    return <Loading message="Generating tags and description" />
  }

  return (
    <SafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, paddingBottom: 16 }}
      >
        <Image
          style={{ flex: 2 }}
          source={{ uri: item.url }}
          resizeMode="contain"
        />
        <Text>{item.description}</Text>
        <View style={styles.tagsList}>
          {item.tags.map((tag, index) => (
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
