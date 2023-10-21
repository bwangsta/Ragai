import { View, StyleProp, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type SafeAreaProps = {
  insets?:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "vertical"
    | "horizontal"
    | "top left right"
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
  const offset = 8

  switch (insets) {
    case "top":
      padding = { paddingTop: top }
      break
    case "right":
      padding = { paddingRight: right + offset }
      break
    case "bottom":
      padding = { paddingBottom: bottom }
      break
    case "left":
      padding = { paddingLeft: left + offset }
      break
    case "horizontal":
      padding = {
        paddingRight: right + offset,
        paddingLeft: left + offset,
      }
      break
    case "vertical":
      padding = {
        paddingTop: top,
        paddingBottom: bottom,
      }
      break
    case "top left right":
      padding = {
        paddingTop: top,
        paddingLeft: left + offset,
        paddingRight: right + offset,
      }
      break
    default:
      padding = {
        paddingTop: top,
        paddingRight: right + offset,
        paddingBottom: bottom,
        paddingLeft: left + offset,
      }
  }

  return <View style={[padding, style, { flex: 1 }]}>{children}</View>
}
