import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Ionicons from "@expo/vector-icons/Ionicons"
import CameraScreen from "./src/screens/CameraScreen"
import InventoryScreen from "./src/screens/InventoryScreen"
import TagsScreen from "./src/screens/TagsScreen"
import { RootStackParamList, HomeTabParamList } from "./src/types"
import LoadingScreen from "./src/screens/LoadingScreen"

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<HomeTabParamList>()

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {() => (
              <Tab.Navigator
                initialRouteName="Camera"
                screenOptions={{
                  headerShown: false,
                  tabBarStyle: {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    position: "absolute",
                    borderTopWidth: 0,
                  },
                  tabBarActiveTintColor: "white",
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
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
