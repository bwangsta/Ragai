import { useState, useRef } from "react"
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Camera, CameraType, FlashMode } from "expo-camera"
import { manipulateAsync } from "expo-image-manipulator"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { MaterialIcons, Ionicons } from "@expo/vector-icons"
import { HomeTabScreenProps } from "../types"
import SafeArea from "../components/SafeArea"
import { postData, postModelData } from "../services/api"
import { colors } from "../styles/colors"

type CameraScreenProps = HomeTabScreenProps<"Camera">

export default function CameraScreen({ navigation }: CameraScreenProps) {
  const tabBarHeight = useBottomTabBarHeight()
  const cameraRef = useRef<Camera>(null)
  const [type, setType] = useState(CameraType.back)
  const [inPreview, setInPreview] = useState(false)
  const [flashMode, setFlashMode] = useState(FlashMode.auto)
  const [imageUri, setImageUri] = useState("")
  const [permission, requestPermission] = Camera.useCameraPermissions()
  let flashIcon: keyof typeof MaterialIcons.glyphMap

  if (flashMode === FlashMode.auto) {
    flashIcon = "flash-auto"
  } else if (flashMode === FlashMode.on) {
    flashIcon = "flash-on"
  } else {
    flashIcon = "flash-off"
  }

  function toggleCameraType() {
    setType((prevType) =>
      prevType === CameraType.back ? CameraType.front : CameraType.back
    )
  }

  function toggleFlash() {
    setFlashMode((prevFlashMode) => {
      switch (prevFlashMode) {
        case FlashMode.auto:
          return FlashMode.on
        case FlashMode.on:
          return FlashMode.off
        default:
          return FlashMode.auto
      }
    })
  }

  async function takePicture() {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync()
      const formatted = await manipulateAsync(
        data.uri,
        [{ resize: { width: 600 } }],
        { compress: 0.5 }
      )
      cameraRef.current.pausePreview()
      setImageUri(formatted.uri)
      setInPreview(true)
    }
  }

  function closePreview() {
    if (cameraRef.current) {
      cameraRef.current.resumePreview()
      setInPreview(false)
    }
  }

  async function onSubmit() {
    const formData = new FormData()
    formData.append("image", {
      uri: imageUri,
      type: "image/jpg",
      name: imageUri,
    })

    closePreview()
    navigation.navigate("Loading", { message: "Generating tags..." })
    const data = await postData("/images", formData)
    let modelData = await postModelData("/image", data.url)
    modelData = JSON.parse(modelData)
    const { tags, description, random_id, embeddings } = modelData[0]
    navigation.navigate("Tags", {
      key: data.key,
      url: data.url,
      id: random_id,
      tags: tags,
      description: description,
      embeddings: embeddings,
    })
  }

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <SafeArea
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </SafeArea>
    )
  }

  return (
    <SafeArea insets="top" style={{ backgroundColor: "black" }}>
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flashMode}
        ref={cameraRef}
      >
        {inPreview ? (
          <View
            style={{
              marginHorizontal: 24,
              marginVertical: 40,
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                alignSelf: "flex-start",
              }}
              onPress={closePreview}
            >
              <Ionicons name="close" color={colors.white} size={32} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-end",
                marginBottom: tabBarHeight,
                backgroundColor: colors.primary,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 24,
                overflow: "hidden",
              }}
              onPress={onSubmit}
            >
              <Text style={styles.text}>Submit</Text>
              <Ionicons name="chevron-forward" color={colors.white} size={32} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={toggleCameraType}>
                <MaterialIcons
                  name="flip-camera-ios"
                  color={colors.white}
                  size={32}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleFlash}>
                <MaterialIcons
                  name={flashIcon}
                  color={colors.white}
                  size={32}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.pictureButton,
                { marginBottom: 64 + tabBarHeight },
              ]}
              onPress={takePicture}
            />
          </View>
        )}
      </Camera>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  buttonGroup: {
    gap: 24,
    backgroundColor: "transparent",
    paddingTop: 48,
    paddingRight: 16,
    alignItems: "flex-end",
  },
  pictureButton: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderColor: colors.white,
    borderWidth: 8,
    borderRadius: 50,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    padding: 8,
  },
})
