import ThemedHeader from "@/components/Theme/ThemedHeader";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		HossRound: require("@/assets/fonts/Hoss_Round_Medium.otf"),
		"HossRound-Light": require("@/assets/fonts/Hoss_Round_Light.otf"),
		"HossRound-Regular": require("@/assets/fonts/Hoss_Round_Regular.otf"),
		"HossRound-Bold": require("@/assets/fonts/Hoss_Round_Bold.otf"),
		"HossRound-Heavy": require("@/assets/fonts/Hoss_Round_Heavy.otf"),
		"HossRound-Black": require("@/assets/fonts/Hoss_Round_Black.otf"),
		"HossRound-Ultra": require("@/assets/fonts/Hoss_Round_Ultra.otf"),
	});
	if (!fontsLoaded) return null;

	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					header: () => <ThemedHeader title="Mes parties" />,
				}}
			/>
			<Stack.Screen
				name="party/[id]"
				options={{
					header: () => <ThemedHeader title="Ma party" />,
				}}
			/>
		</Stack>
	);
}
