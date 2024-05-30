import { AppRouter } from "@photo-tag/api/src/router";
import { inferProcedureOutput } from "@trpc/server";
import { View, Text, Image } from "react-native";

const PostCard: React.FC<{
    post: inferProcedureOutput<AppRouter["post"]["all"]>[number];
}> = ({ post }) => {
    console.log('Post Card Rendered!');

    return (
        <View className="p-2">
            <View className="h-[50vh]">
                <Image source={{ uri: post.imageUrl }} className="flex-1" />
            </View>
            <Text className="text-xl font-semibold text-[#cc66ff]">{post.title}</Text>
            <Text className="text-xl text-[#cc66ff]">{post.userId}</Text>
            <Text className="text-gray-500">{post.content}</Text>
        </View>
    );
};

export default PostCard;