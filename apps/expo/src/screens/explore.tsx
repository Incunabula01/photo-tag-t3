import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import PostCard from "../components/PostCard";
import FullScreenLoader from "../components/Loading";
import { trpc } from "../utils/trpc";


export const ExploreScreen = () => {
  const { data, isLoading } = trpc.post.all.useQuery();
  const [showPost, setShowPost] = useState<string | undefined>();

  if (isLoading) {
    return <FullScreenLoader />
  }

  return (
    <View style={styles.container}>
      {/* <View style={styles.main}> */}
      <View className="container">
        <View className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          {data ?
            data.map((postData) => (
              <View key={postData.postId}>
                <PostCard post={postData} />
              </View>
            )) :
            <Text style={styles.subtitle}>No Tags Available!</Text>
          }
        </View>
      </View>
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "flex-start",
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
