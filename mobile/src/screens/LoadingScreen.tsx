import { View, Text, ActivityIndicator, StyleSheet } from "react-native"
import { RootStackScreenProps } from "../types"

type LoadingScreenProps = RootStackScreenProps<"Loading">

export default function LoadingScreen({ route }: LoadingScreenProps) {
  const { message } = route.params

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007BFF" />
      <Text>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
