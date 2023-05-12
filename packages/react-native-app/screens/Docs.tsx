import React, { useState } from 'react';
import { Button, Image, TextInput, View, StyleSheet,Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import Snackbar from 'react-native-snackbar';

const Docs = () => {
  const [imageUri, setImageUri] = useState(null);
  const [customName, setCustomName] = useState('');

  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access camera denied');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      setImageUri(result.uri);
      promptForCustomName();
    }
  };

  const handleGalleryPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access media library denied');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      setImageUri(result.uri);
      promptForCustomName();
    }
  };

  const promptForCustomName = () => {
    setCustomName(''); // Clear any existing custom name
  };

  const saveToGallery = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission to access media library denied');
      return;
    }

    const asset = await MediaLibrary.createAssetAsync(imageUri, {filename: customName})

    if (asset) {
      try {
        await MediaLibrary.createAlbumAsync('Expo', asset, false);
        console.log('Image saved to gallery!');
        Alert.alert('Success', 'Image successfully uploaded to gallery');
      } catch (error) {
        console.log('Error saving image to gallery:', error);
      }
    }
  };

  
  return (
    <View style={styles.container}>
      <Button title="Take Picture" onPress={handleCameraPress} />
      <Button title="Upload from Gallery" onPress={handleGalleryPress} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
      {imageUri && (
        <TextInput
          style={styles.textInput}
          placeholder="Enter file name"
          onChangeText={text => setCustomName(text)}
          value={customName}
        />
      )}
      {imageUri && (
        <Button
          title="Save to Gallery"
          onPress={saveToGallery}
          disabled={!customName}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  textInput: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color:"white"
  },
});

export default Docs;
