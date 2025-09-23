import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function PartyLayout() {
	const colors = useThemeColors();

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.white }}
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
						backgroundColor: colors.white,
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
							<FontAwesome size={20} name="info" color={color} />
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
							<FontAwesome size={20} name="image" color={color} />
						),
					}}
				/>
			</MaterialTopTabs>
		</SafeAreaView>
	);
}
