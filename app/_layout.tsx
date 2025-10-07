import ThemedHeader from "@/components/Theme/ThemedHeader";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";

export default function RootLayout() {
	const router = useRouter();
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
					header: () => (
						<ThemedHeader
							title="Mes parties"
							menuItems={[
								{
									label: "Se déconnecter",
									icon: "sign-out",
									onPress: () => router.push("/login"),
								},
							]}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="party/[id]"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="login"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="party/create"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="party/edit/[id]"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="party/shopping-list/[id]"
				options={{
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
