import { SafeAreaView } from "react-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { deleteToken } from "~/lib/api/session-store";
import { api } from "~/lib/api/trpc";

export default function Home() {
  const { mutateAsync } = api.auth.signOut.useMutation();
  async function handleLogout() {
    try {
      deleteToken();
      await mutateAsync();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
  }

  return (
    <SafeAreaView>
      <Text>Welcome home</Text>
      <Button onPress={handleLogout}>
        <Text className="text-white">Sign out</Text>
      </Button>
    </SafeAreaView>
  );
}
