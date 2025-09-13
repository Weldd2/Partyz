import partiesFixture from "@/fixtures/parties";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import {
	Stack,
	useLocalSearchParams,
	useRouter,
	withLayoutContext,
} from "expo-router";
import { useState } from "react";
import { Pressable, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useApi from "@/hooks/useApi";
import { PartyInterface } from "@/types/PartyInterface";

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function PartyLayout() {
	const colors = useThemeColors();
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const [activeTab, setActiveTab] = useState<string>("details");
	const {
		isLoading,
		error,
		data: party,
	} = useApi<PartyInterface>("party", `/parties/${id}`);

	if (isLoading) {
		return <Text>is loading</Text>;
	}

	if (error || !party) {
		console.log(error);
		return <Text>error</Text>;
	}
	const handleEdit = () => {
		router.push(`/party/edit/${id}`);
	};

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<Stack.Screen
				options={{
					title: party?.title,
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
										<FontAwesome6
											name="pen-to-square"
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
							gap: 4,
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
						name="chat"
						options={{
							title: "Chat",
							tabBarIcon: ({ color }) => (
								<FontAwesome6
									size={20}
									name="comments"
									color={color}
								/>
							),
						}}
					/>
					<MaterialTopTabs.Screen
						name="details"
						options={{
							title: "Détails",
							tabBarIcon: ({ color }) => (
								<FontAwesome6
									size={20}
									name="info"
									color={color}
								/>
							),
						}}
					/>
					<MaterialTopTabs.Screen
						name="shoppingList"
						options={{
							title: "Liste",
							tabBarIcon: ({ color }) => (
								<FontAwesome6
									size={20}
									name="cart-shopping"
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
								<FontAwesome6
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
