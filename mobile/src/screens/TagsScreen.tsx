import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native"
import { RootStackScreenProps } from "../types"
import SafeArea from "../components/SafeArea"

type TagsScreenProps = RootStackScreenProps<"Tags">

export default function TagsScreen({ navigation, route }: TagsScreenProps) {
  const { uri } = route.params

  return (
    <SafeArea>
      <Image style={{ flex: 2 }} source={{ uri: uri }} resizeMode="contain" />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          flex: 1,
        }}
      >
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
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderColor: "black",
    borderWidth: 1,
  },
})
