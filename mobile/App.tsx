import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import CameraScreen from "./src/screens/CameraScreen"
import InventoryScreen from "./src/screens/InventoryScreen"
import TagsScreen from "./src/screens/TagsScreen"
import { RootStackParamList, HomeTabParamList } from "./src/types"

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
                screenOptions={{ headerShown: false }}
              >
                <Tab.Screen name="Camera" component={CameraScreen} />
                <Tab.Screen name="Inventory" component={InventoryScreen} />
              </Tab.Navigator>
            )}
          </Stack.Screen>
          <Stack.Screen name="Tags" component={TagsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
