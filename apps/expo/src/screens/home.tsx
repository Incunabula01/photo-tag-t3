import React, { useEffect, useState } from "react";

import { Button, Text, TextInput, TouchableOpacity, View, StyleSheet, Image, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@photo-tag/api";
import * as Location from "expo-location";
import uuid from 'react-native-uuid';

import { trpc } from "../utils/trpc";
import CameraComponent from "../components/CameraComponent";
import { Post, User } from "../../../../packages/db";

import { useModal } from "../components/ModalProvider";
import IconButton from "../components/IconButton";
import FullScreenLoader from "../components/Loading";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useUserStore, useAppStore } from "../store/GlobalStore";
import PostCard from "../components/PostCard";




interface CreatePostProps {
  userId: string | undefined;
  userCoord: Location.LocationObjectCoords | null;
  hasPost: boolean;
  onNewPost: () => void;
}

const CreatePost = ({
  userId,
  userCoord,
  hasPost,
  onNewPost
}: CreatePostProps) => {
  const { user } = useUser();
  const { currentUser, setCurrentUser } = useUserStore();
  const { status } = useAppStore();
  const utils = trpc.useContext();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [photoUrl, setPhotoUri] = useState<string>("");


  const { closeModal } = useModal();

  const updateUsers = trpc.user.updateUsers.useMutation({
    onError(error) {
      console.error('saveImage error!', error);
    },
    async onSuccess(data) {
      if (data?.updateUser2) {
        setCurrentUser({ ...currentUser, hasTag: data?.updateUser2.hasTag });
      }
      await utils.post.all.invalidate();
    }
  });

  const createNewTag = trpc.post.create.useMutation({
    async onSuccess() {
      setTitle('');
      setContent('');
      closeModal();
      onNewPost();
      await utils.post.all.invalidate();
    },
  });

  const handlePhotoSave = (imgUri: string) => {
    setPhotoUri(imgUri);
  };

  const handleCreatePost = () => {

    const capturedId = `tag-${uuid.v4()}`;

    if (hasPost && status === 'placed') {
      updateUsers.mutate({
        prevName: userId ?? '',
        nextName: `${user?.lastName}-${user?.firstName}`,
        capturedId: capturedId
      });
    }

    const todaysDate = new Date();
    const userName = `${user?.lastName}-${user?.firstName}`;

    createNewTag.mutate({
      title,
      content,
      imageUrl: photoUrl,
      userId: userName,
      createdAt: todaysDate,
      location: JSON.stringify({
        lat: userCoord?.latitude,
        long: userCoord?.longitude
      }),
      postId: `tag-${uuid.v4()}`
    });

  };

  return (
    <>
      <View className="flex flex-col p-4 gap-2">
        {photoUrl &&

          <KeyboardAwareScrollView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <>
                <View className="h-[60vh] w-[100vw] relative">
                  <View className="absolute top-1 left-1 z-10">
                    <IconButton
                      onPress={closeModal}
                      icon="cross"
                      iconSize={36}
                    />
                  </View>

                  <Image source={{ uri: photoUrl }} className="flex-1" />
                </View>
                <View className="p-2">
                  <TextInput
                    className="mb-2 rounded border-2 border-gray-500 p-2 text-slate-500"
                    onChangeText={(value) => setTitle(value)}
                    placeholder="Title"
                  />
                  <TextInput
                    className="mb-2 rounded border-2 border-gray-500 p-2 text-slate-500"
                    multiline={true}
                    onChangeText={(value) => setContent(value)}
                    placeholder="Content"
                  />
                  <TouchableOpacity
                    className="rounded bg-slate-500 p-2"
                    onPress={handleCreatePost}
                  >
                    <Text className="font-semibold text-white">Create Tag</Text>
                  </TouchableOpacity>
                </View>
              </>

            </TouchableWithoutFeedback>
          </KeyboardAwareScrollView>

        }
      </View>

      {!photoUrl &&
        <View className="flex flex-1 w-[100vw] h-full relative overflow-hidden">
          <View className="absolute top-1 left-1 z-10">
            <IconButton
              onPress={closeModal}
              icon="cross"
              iconSize={36}
            />
          </View>
          <CameraComponent onSavePhoto={handlePhotoSave} />
        </View>
      }
    </>
  );
};

export const HomeScreen = () => {
  const { openModal, closeModal } = useModal();
  const { currentUser, setCurrentUser } = useUserStore();
  const { status, setStatus } = useAppStore();
  const utils = trpc.useContext();
  const { data, refetch } = trpc.post.mostRecent.useQuery();
  const { isSignedIn, user } = useUser();


  const addUser = trpc.user.addUser.useMutation({
    onError(error) {
      console.log('User Cant Be Updated!', error);

    },
    async onSuccess(userData) {
      if (userData) {
        const { id, username, email, hasTag, capturedTags } = userData as User;

        setCurrentUser({
          id, username, email, hasTag, capturedTags
        });
        await utils.user.invalidate();
      }
    }
  });
  console.log("USER STORE ==>", currentUser.username, currentUser.hasTag);

  useEffect(() => {
    if (isSignedIn) {
      console.log('logged in!');
      // Adds user if signed up
      const { firstName, lastName, primaryEmailAddress } = user;

      addUser.mutate({
        username: `${lastName}-${firstName}` ?? "",
        email: primaryEmailAddress?.emailAddress ?? ""
      });
    }

  }, [isSignedIn, user]);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      const { coords } = await Location.getCurrentPositionAsync();
      console.log('zee coordz', coords);
      return coords;
    } else {
      Alert.alert('Location required', 'You can not post unless location access is enabled!', [{
        text: 'Cancel',
        style: 'cancel'
      }, {
        text: 'Accept',
        onPress: async () => {
          await Location.requestForegroundPermissionsAsync();
        }
      }])
    }
  }

  const isWithinRadius = (coord1: { lat: number; long: number }, coord2: { lat: number; long: number }): boolean => {
    const toRadians = (degrees: number): number => {
      return degrees * Math.PI / 180;
    };

    const earthRadius = 6371000; // Earth's radius in meters
    const lat1 = toRadians(coord1.lat);
    const lat2 = toRadians(coord2.lat);
    const deltaLat = toRadians(coord2.lat - coord1.lat);
    const deltaLong = toRadians(coord2.long - coord1.long);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance <= 100; // Check if distance is within 100 meters
  };

  const handleCapture = async () => {
    openModal(<FullScreenLoader />, false);

    const userLocation: Location.LocationObjectCoords | undefined = await getLocation();

    if (userLocation) {
      if (data && data.length > 0) {
        const coord1 = { lat: userLocation?.latitude, long: userLocation?.longitude };
        const coord2 = JSON.parse(data[0]?.location ?? '');

        if (currentUser.hasTag) {
          openModal(
            <CreatePost
              userId={currentUser.username}
              userCoord={userLocation}
              hasPost={true}
              onNewPost={() => {
                refetch({
                  throwOnError: true
                });
                setStatus('placed');
              }}
            />,
            true
          );
          console.log('App Status', status);

        } else if (isWithinRadius(coord1, coord2)) {
          setStatus('found');
          closeModal();
          openModal(
            <CreatePost
              userId={data[0]?.userId}
              userCoord={userLocation}
              hasPost={true}
              onNewPost={() => {
                refetch({
                  throwOnError: true
                });
                setStatus('pending');
              }}
            />,
            true
          );
          console.log('App Status', status);
        } else {
          closeModal();
          Alert.alert('Oops!', 'Nowhere close to tag, please try again!');
        }
      } else {
        closeModal();
        openModal(
          <CreatePost
            userId={`${user?.lastName}-${user?.firstName}`}
            userCoord={userLocation}
            hasPost={false}
            onNewPost={() => {
              refetch({
                throwOnError: true
              });
              setStatus('placed');
            }}
          />,
          true
        );
        console.log('App Status', status);
      }

    } else {

      Alert.alert('Location required', 'You can not post unless location access is enabled!', [{
        text: 'Cancel',
        style: 'cancel'
      }, {
        text: 'Accept',
        onPress: async () => {
          await Location.requestForegroundPermissionsAsync();
        }
      }]);
    }
  }

  return (
    <SafeAreaView className="bg-white" style={styles.container}>

      <View className="h-full w-full p-2" style={styles.main}>
        {/* <Text className="mx-auto pb-2 text-5xl font-bold text-gray-500">
            Photo Tag
          </Text> */}

        {data && data.length > 0 &&

          <>
            <PostCard post={data[0] as Post} />
            <View className="py-2">
              {(!currentUser.hasTag && status === 'placed') &&
                <TouchableOpacity
                  className="rounded bg-green-500 p-4"
                  onPress={handleCapture}
                >
                  <Text className="font-semibold text-white text-center">Capture Tag!</Text>
                </TouchableOpacity>
              }
              {currentUser.hasTag && status === 'pending' &&
                <TouchableOpacity
                  className="rounded bg-green-500 p-4"
                  onPress={handleCapture}
                >
                  <Text className="font-semibold text-white text-center">Place New Tag!</Text>
                </TouchableOpacity>
              }
            </View>
          </>
        }

        {data && data.length === 0 &&
          <>
            <Text className="font-semibold italic text-gray-500">
              No Posts Yet, create some!
            </Text>
            <View className="py-2">
              <TouchableOpacity
                className="rounded bg-green-500 p-4"
                onPress={handleCapture}
              >
                <Text className="font-semibold text-white text-center">Create New Tag!</Text>
              </TouchableOpacity>
            </View>
          </>
        }


      </View>


    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});





