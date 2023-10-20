import { useState } from "react"
import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors } from "../styles/colors"

type TagProps = {
  name: string
  index: number
  deleteTag: (selectedTag: string) => void
  finishEditing: (index: number, newTag: string) => void
}

export default function Tag({
  name,
  index,
  deleteTag,
  finishEditing,
}: TagProps) {
  const [tagName, setTagName] = useState(name)

  return (
    <View style={styles.tag}>
      <TextInput
        value={tagName}
        maxLength={20}
        inputMode="text"
        autoCapitalize="none"
        onChangeText={(text) => setTagName(text)}
        onEndEditing={() => finishEditing(index, tagName)}
        style={{ fontSize: 16, color: colors.white }}
      />
      <TouchableOpacity onPress={() => deleteTag(name)}>
        <Ionicons name="close" size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    alignItems: "center",
    gap: 16,
    borderRadius: 4,
    padding: 8,
    overflow: "hidden",
  },
})
