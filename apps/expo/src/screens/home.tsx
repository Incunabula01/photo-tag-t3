import React, { useEffect, useState } from "react";

import { Button, Text, TextInput, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@photo-tag/api";

import { trpc } from "../utils/trpc";
import CameraComponent from "../components/CameraComponent";
import { useUniqueId } from "../hooks/useUniqueId";

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
      <Text className="text-gray-500">{post.content}</Text>
    </View>
  );
};

const CreatePost: React.FC<{ user: string | undefined }> = () => {
  const utils = trpc.useContext();
  const [photoUri, setPhotoUri] = React.useState<string>("");
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [showCreate, setShowCreate] = useState<boolean>(false);

  const { user } = useUser();
  const saveImage = trpc.post.saveImageToFirebase.useMutation({
    onError(error) {
      console.error('saveImage error!', error);
    },
    async onSuccess(data) {
      console.log('on success??', data);

      if (data.success) {
        setPhotoUri(data.imgUrl ?? "");
      }
      await utils.post.all.invalidate();
    }
  });

  const { uniqueId } = useUniqueId(photoUri);
  const createPost = trpc.post.create.useMutation({
    async onSuccess() {
      setPhotoUri('');
      setTitle('');
      setContent('');
      setShowCreate(false);
      await utils.post.all.invalidate();
    },
  });

  const handleSavePhoto = async (base64Img: string) => {
    console.log('handle photo save');

    saveImage.mutate({
      file: base64Img,
    })

  }

  const handleSave = () => {
    console.log('handle save pressed!');

    const todaysDate = new Date();
    createPost.mutate({
      title,
      content,
      imageUrl: photoUri,
      userId: uniqueId,
      createdAt: todaysDate,
      user: user?.fullName ?? ""
    });
  }

  console.log('create post rendered!');
  if (!showCreate) {
    return (
      <TouchableOpacity
        className="rounded bg-slate-500 p-2"
        onPress={() => setShowCreate(true)}
      >
        <Text className="font-semibold text-white">Capture Tag!</Text>
      </TouchableOpacity>
    )
  }
  return (
    <View className="flex flex-col border-t-2 border-gray-500 p-4 gap-2">
      {!photoUri &&
        <CameraComponent onSavePhoto={(imgUri) => handleSavePhoto(imgUri)} />
      }

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
  const postQuery = trpc.post.all.useQuery();
  const [showPost, setShowPost] = useState<string | null>(null);
  const { isSignedIn, user } = useUser();
  const [loggedInUser, setLoggedInUser] = useState<string | undefined>();

  const { mutate } = trpc.auth.addUser.useMutation({
    onSuccess(data) {
      if (data.success) {
        setLoggedInUser(data?.username);
      }
      console.log('User Created!');
    }
  })

  useEffect(() => {
    if (isSignedIn) {
      const { firstName, lastName, primaryEmailAddress } = user;

      mutate({
        username: `${lastName}-${firstName}` ?? "",
        email: primaryEmailAddress?.emailAddress ?? ""
      })
    }

  }, [isSignedIn, user]);

  return (
    <SafeAreaView className="bg-white" style={styles.container}>
      <View className="h-full w-full p-2" style={styles.main}>
        <Text className="mx-auto pb-2 text-5xl font-bold text-gray-500">
          Photo Tag
        </Text>

        <View className="py-2">
          {showPost ? (
            <Text className="text-gray-500">
              <Text className="font-semibold">Selected post:</Text>
              {showPost}
            </Text>
          ) : (
            <Text className="font-semibold italic text-gray-500">
              Press on a post
            </Text>
          )}
        </View>
        {postQuery.data ?
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
        }

        <View>
          <CreatePost user={loggedInUser} />
        </View>

        <SignOut />
      </View>
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

function setLoggedInUser(username: string | undefined) {
  throw new Error("Function not implemented.");
}

