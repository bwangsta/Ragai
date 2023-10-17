import { useState, useRef } from "react"
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Camera, CameraType, FlashMode } from "expo-camera"
import { HomeTabScreenProps } from "../types"
import SafeArea from "../components/SafeArea"
import { postData } from "../services/api"

type CameraScreenProps = HomeTabScreenProps<"Camera">

export default function CameraScreen({ navigation }: CameraScreenProps) {
  const cameraRef = useRef<Camera>(null)
  const [type, setType] = useState(CameraType.back)
  const [inPreview, setInPreview] = useState(false)
  const [flashMode, setFlashMode] = useState(FlashMode.auto)
  const [imageUri, setImageUri] = useState("")
  const [permission, requestPermission] = Camera.useCameraPermissions()

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
      cameraRef.current.pausePreview()
      setImageUri(data.uri)
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
    const data = await postData("/images", formData)
    navigation.navigate("Tags", {
      url: data.url,
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
    <SafeArea insets="top">
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flashMode}
        ref={cameraRef}
      >
        {inPreview ? (
          <View style={{ marginHorizontal: 24, marginVertical: 40, flex: 1 }}>
            <TouchableOpacity
              style={{
                alignSelf: "flex-start",
              }}
              onPress={closePreview}
            >
              <Text style={styles.text}>X</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}></View>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={onSubmit}
            >
              <Text style={styles.text}>Submit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={toggleCameraType}>
                <Text style={styles.text}>Flip</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleFlash}>
                <Text style={styles.text}>{flashMode.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.pictureButton}
              onPress={takePicture}
            />
          </>
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
    flex: 1,
    gap: 8,
    backgroundColor: "transparent",
    paddingTop: 48,
    paddingRight: 16,
    alignItems: "flex-end",
  },
  pictureButton: {
    marginBottom: 96,
    alignSelf: "center",
    width: 80,
    height: 80,
    borderColor: "white",
    borderWidth: 8,
    borderRadius: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
})
