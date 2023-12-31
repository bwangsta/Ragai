import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native"
import type { StackScreenProps } from "@react-navigation/stack"
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs"

export type RootStackParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>
  Tags: {
    key: string
    url: string
    id: string
    tags: string
    description: string
    embeddings: number[]
  }
  Loading: { message: string }
}

export type HomeTabParamList = {
  Camera: undefined
  Inventory: undefined
}

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    StackScreenProps<RootStackParamList>
  >
