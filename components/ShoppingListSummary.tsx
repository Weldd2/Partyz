import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { ShoppingListInterface } from "@/types/ShoppingListItem";
import { useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import useApi from "@/hooks/useApi";
import ThemedText from "./Theme/ThemedText";
import ThemedButton from "./Theme/ThemedButton";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ApiCollectionInterface } from "@/types/ApiInterface";

type Props = {
	partyId: string;
};

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.white,
			borderWidth: 1,
			borderColor: colors.primary,
			borderRadius: 8,
			shadowColor: colors.primary,
			shadowOffset: { width: 1, height: 1 },
			shadowOpacity: 1,
			shadowRadius: 0,
			paddingVertical: 15,
			paddingHorizontal: 10,
			marginTop: 20,
		},
	});

export default function ShoppingListSummary({ partyId }: Props) {
	const colors = useThemeColors();
	const styles = getStyles(colors);
	const flatListRef = useRef<FlatList>(null);
	const {
		isLoading: isShoppingListLoading,
		error: shoppingListError,
		data: apiResponse,
	} = useApi<ApiCollectionInterface<ShoppingListInterface>>(
		"shoppingList",
		`/parties/${partyId}/shoppingListItem`,
	);
	if (isShoppingListLoading) {
		return <ThemedText>loading...</ThemedText>;
	}
	if (shoppingListError || !apiResponse) {
		console.log(shoppingListError);
		return <ThemedText>error</ThemedText>;
	}
	const shoppingListItems = apiResponse.member;
	return (
		<View>
			<ThemedText
				variant="h2"
				style={{
					textTransform: "uppercase",
					paddingTop: 40,
					textAlign: "center",
				}}
			>
				Liste de courses
			</ThemedText>

			{shoppingListItems.length > 0 ? (
				<View style={styles.container}>
					<ThemedText style={{ marginBottom: 10 }} variant="disabled">
						Je ramène :
					</ThemedText>
					<FlatList
						ref={flatListRef}
						data={shoppingListItems.slice(0, 4)}
						renderItem={(item) => (
							<View style={{ flexDirection: "row" }}>
								<ThemedText style={{ flex: 1, fontSize: 16 }}>
									{item.item.name}
								</ThemedText>
								<ThemedText
									style={{
										fontFamily: "HossRound-Bold",
										fontSize: 16,
									}}
								>
									x{item.item.quantity}
								</ThemedText>
							</View>
						)}
						scrollEnabled={false}
						ItemSeparatorComponent={() => (
							<View style={{ height: 10 }}></View>
						)}
						keyExtractor={(item) => `shopping-list-item-${item.id}`}
					/>
				</View>
			) : (
				<View></View>
			)}

			<View
				style={{
					alignSelf: "center",
					paddingTop: 20,
				}}
			>
				<ThemedButton
					style={{
						flexDirection: "row",
						gap: 10,
					}}
					onPress={() => {
						router.push(`/party/shopping-list/${partyId}`);
					}}
				>
					<ThemedText color="white" style={{ fontSize: 16 }}>
						Voir la liste de courses
					</ThemedText>
					<FontAwesome6
						size={20}
						name="arrow-right"
						color={colors.white}
					/>
				</ThemedButton>
			</View>
		</View>
	);
}
