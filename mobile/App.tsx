import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import Ionicons from "@expo/vector-icons/Ionicons"
import CameraScreen from "./src/screens/CameraScreen"
import InventoryScreen from "./src/screens/InventoryScreen"
import TagsScreen from "./src/screens/TagsScreen"
import { RootStackParamList, HomeTabParamList } from "./src/types"
import { colors } from "./src/styles/colors"
import RemoveItemScreen from "./src/screens/RemoveItemScreen"

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<HomeTabParamList>()

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {() => (
              <Tab.Navigator
                initialRouteName="Camera"
                screenOptions={{
                  headerShown: false,
                  tabBarStyle: {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    position: "absolute",
                    borderTopWidth: 0,
                    elevation: 1,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                  },
                  tabBarActiveTintColor: "#5AD4BE",
                  tabBarInactiveTintColor: colors.white,
                }}
              >
                <Tab.Screen
                  name="Camera"
                  component={CameraScreen}
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="camera" color={color} size={size} />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Inventory"
                  component={InventoryScreen}
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="shirt" color={color} size={size} />
                    ),
                  }}
                />
              </Tab.Navigator>
            )}
          </Stack.Screen>
          <Stack.Screen name="Tags" component={TagsScreen} />
          <Stack.Screen name="Remove" component={RemoveItemScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
