import { Colors } from "@/constants/colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { Pressable, View, Text } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
	const router = useRouter();
	const colors = Colors.light;
	const [showSettingsMenu, setShowSettingsMenu] = useState(false);
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
		<GestureHandlerRootView style={{ flex: 1 }}>
			<QueryClientProvider client={queryClient}>
				<BottomSheetModalProvider>
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
							headerShadowVisible: false,
							headerBackTitleStyle: {
								fontFamily: "HossRound",
							},
							headerBackTitle: "Back",
						}}
					>
						<Stack.Screen
							name="index"
							options={{
								title: "Mes parties",
								headerRight: () => (
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											gap: 12,
										}}
									>
										<Pressable
											onPress={() =>
												setShowSettingsMenu(
													!showSettingsMenu,
												)
											}
										>
											<FontAwesome6
												name="gear"
												size={20}
												color={colors.white}
											/>
										</Pressable>
										{showSettingsMenu && (
											<View
												style={{
													position: "absolute",
													top: 40,
													right: 0,
													backgroundColor:
														colors.white,
													borderRadius: 8,
													minWidth: 180,
													shadowColor: colors.primary,
													shadowOffset: {
														width: 0,
														height: 2,
													},
													shadowOpacity: 0.25,
													shadowRadius: 4,
													elevation: 5,
													zIndex: 1000,
													overflow: "hidden",
												}}
											>
												<Pressable
													onPress={() => {
														setShowSettingsMenu(
															false,
														);
														router.push(
															"/preferences",
														);
													}}
													style={{
														padding: 12,
														borderBottomWidth: 1,
														borderBottomColor:
															colors.primary,
														flexDirection: "row",
														alignItems: "center",
														gap: 8,
													}}
												>
													<FontAwesome6
														name="sliders"
														size={16}
														color={colors.primary}
													/>
													<Text
														style={{
															color: colors.paragraph,
															fontSize: 14,
															fontFamily:
																"HossRound",
														}}
													>
														Préférences
													</Text>
												</Pressable>
												<Pressable
													onPress={() => {
														setShowSettingsMenu(
															false,
														);
													}}
													style={{
														padding: 12,
														flexDirection: "row",
														alignItems: "center",
														gap: 8,
													}}
												>
													<FontAwesome6
														name="user"
														size={16}
														color={colors.primary}
													/>
													<Text
														style={{
															color: colors.paragraph,
															fontSize: 14,
															fontFamily:
																"HossRound",
														}}
													>
														Mon profil
													</Text>
												</Pressable>
											</View>
										)}
										<Pressable
											onPress={() =>
												router.push("/login")
											}
										>
											<FontAwesome6
												name="arrow-right-to-bracket"
												size={20}
												color={colors.white}
											/>
										</Pressable>
									</View>
								),
							}}
						/>
						<Stack.Screen name="party/[id]" />
						<Stack.Screen name="login" />
						<Stack.Screen name="preferences" />
						<Stack.Screen name="party/create" />
						<Stack.Screen name="party/edit/[id]" />
					</Stack>
				</BottomSheetModalProvider>
			</QueryClientProvider>
		</GestureHandlerRootView>
	);
}
