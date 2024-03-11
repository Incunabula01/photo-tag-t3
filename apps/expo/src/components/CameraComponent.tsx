// CameraComponent.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import { View, Text, StyleSheet, Image } from 'react-native';
import IconButton from './IconButton';

interface CameraComponentProps {
    onSavePhoto: (imgUri: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onSavePhoto }) => {
    const [hasCameraPermissions, setHasCameraPermissions] = useState<boolean | null>(null);
    const [flashMode, setFlashMode] = useState<number | FlashMode>(FlashMode.off);
    const cameraRef = useRef<Camera | null>(null);
    const [img, setImg] = useState<string | null>(null);
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    console.log('camera component rendered!');

    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync();
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermissions(cameraStatus.status === 'granted');
        })();
    }, []);

    const takePhoto = async () => {
        if (!cameraRef.current || isTakingPhoto) return;

        setIsTakingPhoto(true);

        try {
            console.log('picture sizes ==>', await cameraRef.current.getAvailablePictureSizesAsync('4:3'));

            const { uri } = await cameraRef.current.takePictureAsync();

            setImg(uri);
        } catch (error) {
            console.error('Error taking photo:', error);
        } finally {
            setIsTakingPhoto(false);
        }
    };

    const saveImage = async () => {
        if (img) {
            try {
                const { uri, width } = await MediaLibrary.createAssetAsync(img);
                MediaLibrary.saveToLibraryAsync(uri);
                const resizedPhoto = await ImageManipulator.manipulateAsync(
                    uri,
                    [{ resize: { width: width / 2 } }],
                    { base64: true }
                );
                const base64Img = `data:image/jpg;base64,${resizedPhoto.base64}`;
                onSavePhoto(base64Img);
            } catch (error) {
                console.error('Error saving photo:', error);
            } finally {
                setImg(null);
            }
        }
    }

    if (!hasCameraPermissions) {
        return (
            <View className='flex items-center justify-center p-2'>
                <Text>No Access to Camera</Text>
            </View>
        )
    }

    return (
        <>
            <View className='h-full'>
                {!img ?
                    <Camera
                        type={CameraType.back}
                        flashMode={flashMode}
                        ref={cameraRef}
                        style={styles.camera}
                        className='flex justify-between h-[100vh]'
                    >
                    </Camera> :
                    <Image source={{ uri: img }} style={styles.camera} />
                }
                <View className="flex flex-row justify-between h-24">
                    {img ?
                        <>
                            <IconButton title={'Retake Photo'} icon="camera" onPress={() => setImg(null)} iconColor='#64748b' />
                            <IconButton title={'Save Photo'} icon="check" onPress={saveImage} iconColor='#64748b' />
                        </> :
                        <>
                            <IconButton title={'Take a Photo'} icon="camera" onPress={takePhoto} iconColor='#64748b' />
                            <IconButton title={'Toggle Flash'} icon="flash" onPress={() => setFlashMode(FlashMode.on)} iconColor='#64748b' />
                        </>
                    }

                </View>
            </View>
        </>

    );
};

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        borderRadius: 20
    }
})

export default CameraComponent;
