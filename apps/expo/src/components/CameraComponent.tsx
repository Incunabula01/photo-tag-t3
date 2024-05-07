// CameraComponent.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import { View, Text, StyleSheet, Image } from 'react-native';
import IconButton from './IconButton';
import { trpc } from '../utils/trpc';

interface CameraComponentProps {
    onSavePhoto: (imgUri: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onSavePhoto }) => {
    const utils = trpc.useContext();
    const [hasCameraPermissions, setHasCameraPermissions] = useState<boolean | null>(null);
    const [flashMode, setFlashMode] = useState<number | FlashMode>(FlashMode.off);
    const cameraRef = useRef<Camera | null>(null);
    const [img, setImg] = useState<string | null>(null);
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    console.log('camera component rendered!');


    const uploadImage = trpc.post.saveImageToFirebase.useMutation({
        onError(error) {
            console.error('saveImage error!', error);
        },
        async onSuccess(data) {
            console.log('on success??', data);

            if (data.success) {
                onSavePhoto(data.imgUrl ?? "");
            }
            await utils.post.all.invalidate();
        }
    });

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
            // const imageSizes = await cameraRef.current.getAvailablePictureSizesAsync();
            // console.log('picture sizes ==>', imageSizes);

            const { uri } = await cameraRef.current.takePictureAsync();
            const resizedPhoto = await resizePhoto(uri);
            console.log('picture resize ==>', resizedPhoto);
            setImg(resizedPhoto);
        } catch (error) {
            console.error('Error taking photo:', error);
        } finally {
            setIsTakingPhoto(false);
        }
    };

    const resizePhoto = async (uri: string) => {
        const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }],
            { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );

        return manipResult.uri;
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

                uploadImage.mutate({
                    file: base64Img,
                });
            } catch (error) {
                console.error('Error saving photo:', error);
            } finally {
                setImg(null);
            }
        }
    }

    const toggleFlash = () => {
        setFlashMode((prevMode) =>
            prevMode === FlashMode.off
                ? FlashMode.on
                : FlashMode.off
        );
    }

    if (!hasCameraPermissions) {
        return (
            <View className='flex items-center justify-center p-2'>
                <Text>No Access to Camera</Text>
            </View>
        )
    }

    return (
        <View className='flex flex-1 justify-center items-center'>
            {!img ?
                <Camera
                    type={CameraType.back}
                    flashMode={flashMode}
                    ref={cameraRef}
                    // style={styles.camera}
                    // className='flex justify-between h-[80vh] w-full'
                    className='flex-1 h-[100vh] w-full justify-between'
                >
                </Camera> :
                <Image source={{ uri: img }} className='flex-1 h-[100vh] w-full justify-between' />
            }
            <View className="flex flex-row justify-between h-16">
                {img ?
                    <>
                        <IconButton title={'Retake Photo'} icon="camera" onPress={() => setImg(null)} iconColor='#64748b' />
                        <IconButton title={'Save Photo'} icon="check" onPress={saveImage} iconColor='#64748b' />
                    </> :
                    <>
                        <IconButton title={'Take a Photo'} icon="camera" onPress={takePhoto} iconColor='#64748b' />
                        <IconButton title={'Toggle Flash'} icon="flash" onPress={toggleFlash} iconColor='#64748b' />
                    </>
                }

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    }
})

export default CameraComponent;
