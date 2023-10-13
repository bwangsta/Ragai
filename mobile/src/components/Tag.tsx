import { StyleSheet, Text, View, TouchableOpacity } from "react-native"

type TagProps = {
  name: string
}

export default function Tag({ name }: TagProps) {
  return (
    <View style={styles.tag}>
      <Text>{name}</Text>
      <TouchableOpacity>
        <Text>X</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    backgroundColor: "gray",
    alignItems: "center",
    gap: 8,
    borderRadius: 4,
    padding: 8,
  },
})
