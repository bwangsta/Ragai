import { View, StyleProp, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type SafeAreaProps = {
  insets?: "top" | "right" | "bottom" | "left" | "vertical" | "horizontal"
  style?: StyleProp<ViewStyle>
  children: React.ReactNode
}

export default function SafeArea({ insets, style, children }: SafeAreaProps) {
  const { top, right, bottom, left } = useSafeAreaInsets()
  let padding: {
    paddingTop?: number
    paddingRight?: number
    paddingBottom?: number
    paddingLeft?: number
  } = {}

  switch (insets) {
    case "top":
      padding = { paddingTop: top }
      break
    case "right":
      padding = { paddingRight: right }
      break
    case "bottom":
      padding = { paddingBottom: bottom }
      break
    case "left":
      padding = { paddingLeft: left }
      break
    case "horizontal":
      padding = {
        paddingRight: right,
        paddingLeft: left,
      }
      break
    case "vertical":
      padding = {
        paddingTop: top,
        paddingBottom: bottom,
      }
      break
    default:
      padding = {
        paddingTop: top,
        paddingRight: right,
        paddingBottom: bottom,
        paddingLeft: left,
      }
  }

  return <View style={[padding, style, { flex: 1 }]}>{children}</View>
}
