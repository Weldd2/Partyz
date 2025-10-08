import { Colors } from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function RootLayout() {
	const router = useRouter();
	const colors = Colors.light;
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
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: colors.primary,
				},
				headerTintColor: colors.white,
				headerTitleStyle: {
					fontFamily: "HossRound",
					fontSize: 18,
				},
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "Mes parties",
					headerRight: () => (
						<Pressable
							onPress={() => router.push("/login")}
							style={{ paddingHorizontal: 16 }}
						>
							<FontAwesome
								name="sign-out"
								size={20}
								color={colors.white}
							/>
						</Pressable>
					),
				}}
			/>
			<Stack.Screen name="party/[id]" />
			<Stack.Screen name="login" />
			<Stack.Screen name="party/create" />
			<Stack.Screen name="party/edit/[id]" />
			<Stack.Screen name="party/shopping-list/[id]" />
		</Stack>
	);
}
