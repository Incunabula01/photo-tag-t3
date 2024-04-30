import React, { useEffect, useState } from "react";

import { Button, Text, TextInput, TouchableOpacity, View, StyleSheet, Image, Alert } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@photo-tag/api";
import * as Location from "expo-location";
import uuid from 'react-native-uuid';

import { trpc } from "../utils/trpc";
import CameraComponent from "../components/CameraComponent";
import { Post } from "../../../../packages/db";


const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View className="rounded-lg border-2 border-gray-500 p-4">
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
    </View>
  );
};

const PostCard: React.FC<{
  post: inferProcedureOutput<AppRouter["post"]["all"]>[number];
}> = ({ post }) => {
  console.log('Post Card Rendered!');

  return (
    <View className="rounded-lg border-2 border-gray-500 p-4">
      <View className="h-[20vh]">
        <Image source={{ uri: post.imageUrl }} className="flex-1" />
      </View>
      <Text className="text-xl font-semibold text-[#cc66ff]">{post.title}</Text>
      <Text className="text-xl text-[#cc66ff]">{post.userId}</Text>
      <Text className="text-gray-500">{post.content}</Text>
    </View>
  );
};

interface CreatePostProps {
  userId: string | undefined;
  postCoord?: string | undefined;
  userCoord: Location.LocationObjectCoords | null;
  captureTitle: string;
  hasPost: boolean;
  photoUri: string;
  onCapture: (cameraState: boolean) => void;
}

const CreatePost = ({ userId, userCoord, postCoord, captureTitle, hasPost, photoUri = '', onCapture }: CreatePostProps) => {
  const utils = trpc.useContext();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [showCreate, setShowCreate] = useState<boolean>(false);

  const [userUpdated, setUserUpdated] = useState<boolean>(false);
  const { user } = useUser();

  const isWithinRadius = (coord1: { lat: number; long: number }, coord2: { lat: number; long: number }): boolean => {
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

  const toRadians = (degrees: number): number => {
    return degrees * Math.PI / 180;
  };


  const updateUsers = trpc.user.updateUsers.useMutation({
    onError(error) {
      console.error('saveImage error!', error);
    },
    async onSuccess(data) {
      if (data?.updateUser2) {
        setUserUpdated(true);
      }
      await utils.post.all.invalidate();
    }
  });



  const createPost = trpc.post.create.useMutation({
    async onSuccess() {
      setTitle('');
      setContent('');
      setShowCreate(false);
      await utils.post.all.invalidate();
    },
  });

  const handleCapture = () => {
    // Todo, deal with first capture logic
    const capturedId = `tag-${uuid.v4()}`;

    let input = {
      prevName: userId ?? '',
      nextName: `${user?.lastName}-${user?.firstName}`,
      capturedId
    }
    if (!hasPost) {
      input = {
        prevName: `${user?.lastName}-${user?.firstName}`,
        nextName: '',
        capturedId
      }
    }

    if (userId !== `${user?.lastName}-${user?.firstName}` && userCoord?.latitude && userCoord?.longitude && postCoord) {
      const coord1 = { lat: userCoord?.latitude, long: userCoord?.longitude };
      const coord2 = JSON.parse(postCoord ?? '');
      console.log('user coord', coord1);
      console.log('is in radius?', isWithinRadius(coord1, coord2));
      if (isWithinRadius(coord1, coord2)) {
        updateUsers.mutate(input);
        onCapture(true);
      } else {
        // Todo: add modals
        Alert.alert('Oops!', 'Nowhere close to tag, please try again!');
      }
    }
  }

  const handleSave = () => {
    console.log('handle save pressed!');

    const todaysDate = new Date();
    const userName = `${user?.lastName}-${user?.firstName}`;
    createPost.mutate({
      title,
      content,
      imageUrl: photoUri,
      userId: userName,
      createdAt: todaysDate,
      location: JSON.stringify({
        lat: userCoord?.latitude,
        long: userCoord?.longitude
      }),
      postId: `tag-${uuid.v4()}`
    });
  }

  return (
    <View className="flex flex-col border-t-2 border-gray-500 p-4 gap-2">
      <TouchableOpacity
        className="rounded bg-green-500 p-4"
        onPress={handleCapture}
      >
        <Text className="font-semibold text-white text-center">{captureTitle}</Text>
      </TouchableOpacity>

      {photoUri &&
        <>
          <View className="h-[50vh]">
            <Image source={{ uri: photoUri }} className="flex-1" />
          </View>

          <TextInput
            className="mb-2 rounded border-2 border-gray-500 p-2 text-slate-500"
            onChangeText={(value) => setTitle(value)}
            placeholder="Title"
          />
          <TextInput
            className="mb-2 rounded border-2 border-gray-500 p-2 text-slate-500"
            onChangeText={(value) => setContent(value)}
            placeholder="Content"
          />
          <TouchableOpacity
            className="rounded bg-slate-500 p-2"
            onPress={handleSave}
          >
            <Text className="font-semibold text-white">Publish post</Text>
          </TouchableOpacity>
        </>
      }

    </View>

  );
};

export const HomeScreen = () => {
  // const postQuery = trpc.post.all.useQuery();
  const mostRecentPostQuery = trpc.post.mostRecent.useQuery();
  const [showPost, setShowPost] = useState<string | undefined>();
  const { isSignedIn, user } = useUser();
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const { mutate } = trpc.user.addUser.useMutation();
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [photoUrl, setPhotoUri] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const { coords } = await Location.getCurrentPositionAsync();
        if (coords) {
          setLocation(coords);
          console.log('zee coordz', coords);

        }
      } else {
        Alert.alert('Location required', 'You can not post unless location access is enabled!', [{
          text: 'Cancel',
          onPress: () => {
            setLocation(null);
          },
          style: 'cancel'
        }, {
          text: 'Accept',
          onPress: async () => {
            await Location.requestForegroundPermissionsAsync();
          }
        }])
      }
    })();

    if (isSignedIn) {
      console.log('logged in!');
      // Adds user if signed up
      const { firstName, lastName, primaryEmailAddress } = user;

      mutate({
        username: `${lastName}-${firstName}` ?? "",
        email: primaryEmailAddress?.emailAddress ?? ""
      });
    }

  }, [isSignedIn, user]);


  console.log('most recent', mostRecentPostQuery);

  const handlePhotoSave = (imgUri: string) => {
    setPhotoUri(imgUri);
    setShowCamera(false);
  }

  return (
    <SafeAreaView className="bg-white" style={styles.container}>
      <View className="h-full w-full p-2" style={styles.main}>
        <Text className="mx-auto pb-2 text-5xl font-bold text-gray-500">
          Photo Tag
        </Text>


        {mostRecentPostQuery.data && mostRecentPostQuery.data.length > 0 ?
          <>
            <TouchableOpacity onPress={() => setShowPost(mostRecentPostQuery.data[0]?.id.toString())}>
              <PostCard post={mostRecentPostQuery.data[0] as Post} />
            </TouchableOpacity>
            <View>
              <CreatePost
                userId={mostRecentPostQuery.data[0]?.userId}
                postCoord={mostRecentPostQuery.data[0]?.location}
                userCoord={location}
                captureTitle={"Capture tag!"}
                hasPost={true}
                onCapture={(cameraState) => setShowCamera(cameraState)}
                photoUri=""
              />
            </View>
          </> :
          <View className="py-2">
            <Text className="font-semibold italic text-gray-500">
              No Posts Yet, create some!
            </Text>
            <View>
              <CreatePost
                userId={`${user?.lastName}-${user?.firstName}`}
                userCoord={location}
                captureTitle={"Create New Tag!"}
                hasPost={false}
                photoUri={photoUrl}
                onCapture={(cameraState) => setShowCamera(cameraState)}
              />
            </View>
          </View>


        }
        {/* {postQuery.data ?
          <FlashList
            data={postQuery.data}
            estimatedItemSize={1}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={(p) => (
              <TouchableOpacity onPress={() => setShowPost(p.item.id.toString())}>
                <PostCard post={p.item} />
              </TouchableOpacity>
            )}
          /> :
          <View className="py-2">
            <Text className="font-semibold italic text-gray-500">
              No Posts Yet, create some!
            </Text>
          </View>
        } */}



        <SignOut />
      </View>
      {showCamera &&
        <View className='relative'>
          <CameraComponent onSavePhoto={handlePhotoSave} />
        </View>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    // padding: 24,
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



