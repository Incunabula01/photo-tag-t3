import { StyleSheet, Text, View } from "react-native";
import Auth from 'src/components/auth';
import { useAuthStore } from "store/authStore";

export default function Page() {

  const { isAuthenticated } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {isAuthenticated ?
          <>
            <Text style={styles.title}>Home</Text>
            <Text style={styles.subtitle}>Modify app/index.tsx</Text>
          </>
          :
          <>
            <Auth />
          </>
        }
      </View>
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
