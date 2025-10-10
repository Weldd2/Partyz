import partiesFixture from "@/fixtures/parties";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import {
	Stack,
	useLocalSearchParams,
	useRouter,
	withLayoutContext,
} from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function PartyLayout() {
	const colors = useThemeColors();
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const [activeTab, setActiveTab] = useState<string>("details");

	// Get party data to display title
	const party = partiesFixture.member.find((p) => p.id === id);
	const partyTitle = party ? party.title : "Ma party";

	const handleEdit = () => {
		router.push(`/party/edit/${id}`);
	};

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<Stack.Screen
				options={{
					title: partyTitle,
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.white,
					headerTitleStyle: {
						fontFamily: "HossRound",
						fontSize: 18,
					},
					headerShadowVisible: false,
					headerRight:
						activeTab === "details"
							? () => (
									<Pressable
										onPress={handleEdit}
										style={{ paddingHorizontal: 8 }}
									>
										<FontAwesome
											name="file-pen"
											size={20}
											color={colors.white}
										/>
									</Pressable>
								)
							: undefined,
				}}
			/>
			<SafeAreaView
				style={{ flex: 1, backgroundColor: colors.background }}
				edges={["bottom"]}
			>
				<MaterialTopTabs
					tabBarPosition="bottom"
					screenOptions={({ route }) => ({
						tabBarActiveTintColor: colors.primary,
						tabBarInactiveTintColor: colors.paragraphDisabled,
						tabBarIndicatorStyle: {
							backgroundColor: colors.primary,
						},
						tabBarStyle: {
							backgroundColor: "transparent",
						},
						tabBarLabelStyle: {
							fontSize: 14,
							fontFamily: "HossRound-Bold",
							textTransform: "none",
						},
						tabBarItemStyle: {
							flexDirection: "row",
							gap: 10,
						},
						swipeEnabled: true,
					})}
					screenListeners={{
						state: (e) => {
							const state = e.data
								.state as TabNavigationState<ParamListBase>;
							const routeName = state.routes[state.index].name;
							setActiveTab(routeName);
						},
					}}
				>
					<MaterialTopTabs.Screen
						name="details"
						options={{
							title: "Détails",
							tabBarIcon: ({ color }) => (
								<FontAwesome
									size={20}
									name="info"
									color={color}
								/>
							),
						}}
					/>
					<MaterialTopTabs.Screen
						name="chat"
						options={{
							title: "Chat",
							tabBarIcon: ({ color }) => (
								<FontAwesome
									size={20}
									name="comments"
									color={color}
								/>
							),
						}}
					/>
					<MaterialTopTabs.Screen
						name="gallery"
						options={{
							title: "Galerie",
							tabBarIcon: ({ color }) => (
								<FontAwesome
									size={20}
									name="image"
									color={color}
								/>
							),
						}}
					/>
				</MaterialTopTabs>
			</SafeAreaView>
		</View>
	);
}
