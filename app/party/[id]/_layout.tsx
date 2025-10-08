import partiesFixture from "@/fixtures/parties";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
	Stack,
	useLocalSearchParams,
	useRouter,
	withLayoutContext,
} from "expo-router";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function PartyLayout() {
	const colors = useThemeColors();
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const [menuVisible, setMenuVisible] = useState(false);

	// Get party data to display title
	const party = partiesFixture.member.find((p) => p.id === id);
	const partyTitle = party ? party.title : "Ma party";

	const handleEdit = () => {
		router.push(`/party/edit/${id}`);
	};

	const handleDelete = () => {
		Alert.alert(
			"Supprimer la party",
			"Êtes-vous sûr de vouloir supprimer cette party ? Cette action est irréversible.",
			[
				{
					text: "Annuler",
					style: "cancel",
				},
				{
					text: "Supprimer",
					style: "destructive",
					onPress: () => {
						// TODO: Call API to delete when backend is ready
						console.log("Delete party:", id);
						Alert.alert("Succès", "La party a été supprimée", [
							{
								text: "OK",
								onPress: () => router.replace("/"),
							},
						]);
					},
				},
			],
		);
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
					headerRight: () => (
						<Pressable
							onPress={handleEdit}
							style={{ paddingHorizontal: 8 }}
						>
							<FontAwesome
								name="edit"
								size={20}
								color={colors.white}
							/>
						</Pressable>
					),
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
