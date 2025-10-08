import ShoppingListItemBottomSheet from "@/components/ShoppingListItemBottomSheet";
import ThemedTextInput from "@/components/Theme/Input/ThemedTextInput";
import ThemedText from "@/components/Theme/ThemedText";
import partiesFixture from "@/fixtures/parties";
import useThemeColors from "@/hooks/useThemeColors";
import { ShoppingListInterface } from "@/types/ShoppingListItem";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import BottomSheet from "@gorhom/bottom-sheet";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
	Alert,
	FlatList,
	Keyboard,
	Pressable,
	StyleSheet,
	View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ShoppingList() {
	const colors = useThemeColors();
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const bottomSheetRef = useRef<BottomSheet>(null);

	// Get party data
	const party = partiesFixture.member.find((p) => p.id === id);
	const partyTitle = party ? party.title : "Shopping List";
	const [shoppingList, setShoppingList] = useState<ShoppingListInterface[]>(
		party?.shoppingList || [],
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedItem, setSelectedItem] =
		useState<ShoppingListInterface | null>(null);

	// Filter items based on search
	const filteredItems = useMemo(() => {
		if (!searchQuery.trim()) return shoppingList;
		return shoppingList.filter((item) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [shoppingList, searchQuery]);

	const handleOpenBottomSheet = useCallback(
		(item: ShoppingListInterface | null) => {
			Keyboard.dismiss();
			setSelectedItem(item);
			bottomSheetRef.current?.expand();
		},
		[],
	);

	const handleCloseBottomSheet = useCallback(() => {
		bottomSheetRef.current?.close();
		setSelectedItem(null);
	}, []);

	const handleSaveItem = useCallback(
		(item: Partial<ShoppingListInterface>) => {
			if (selectedItem) {
				// Update existing item
				setShoppingList((prev) =>
					prev.map((i) =>
						i.id === selectedItem.id ? { ...i, ...item } : i,
					),
				);
			} else {
				// Add new item
				const newItem: ShoppingListInterface = {
					"@id": `/api/shopping_list_items/${Date.now()}`,
					"@type": "ShoppingListItem",
					id: Date.now(),
					name: item.name!,
					quantity: item.quantity!,
					broughtQuantity: 0,
				};
				setShoppingList((prev) => [...prev, newItem]);
			}
			handleCloseBottomSheet();
		},
		[selectedItem, handleCloseBottomSheet],
	);

	const handleIncrement = useCallback((item: ShoppingListInterface) => {
		setShoppingList((prev) =>
			prev.map((i) =>
				i.id === item.id
					? {
							...i,
							broughtQuantity: Math.min(
								i.broughtQuantity + 1,
								i.quantity,
							),
						}
					: i,
			),
		);
	}, []);

	const handleDecrement = useCallback((item: ShoppingListInterface) => {
		setShoppingList((prev) =>
			prev.map((i) =>
				i.id === item.id
					? {
							...i,
							broughtQuantity: Math.max(i.broughtQuantity - 1, 0),
						}
					: i,
			),
		);
	}, []);

	const handleDeleteItem = useCallback((item: ShoppingListInterface) => {
		Alert.alert(
			"Supprimer l'article",
			`Êtes-vous sûr de vouloir supprimer "${item.name}" ?`,
			[
				{
					text: "Annuler",
					style: "cancel",
				},
				{
					text: "Supprimer",
					style: "destructive",
					onPress: () => {
						setShoppingList((prev) =>
							prev.filter((i) => i.id !== item.id),
						);
					},
				},
			],
		);
	}, []);

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
			position: "relative",
		},
		listContainer: {
			padding: 16,
		},
		emptyContainer: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			paddingVertical: 60,
		},
		emptyText: {
			textAlign: "center",
			color: colors.paragraphDisabled,
			fontSize: 16,
		},
		itemCard: {
			backgroundColor: colors.white,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
			padding: 16,
			marginBottom: 12,
		},
		itemHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "flex-start",
			marginBottom: 12,
		},
		itemInfo: {
			flex: 1,
		},
		itemName: {
			fontSize: 18,
			color: colors.paragraph,
			marginBottom: 4,
		},
		itemQuantity: {
			fontSize: 14,
			color: colors.paragraphDisabled,
		},
		deleteButton: {
			padding: 4,
		},
		itemControls: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		controlButtons: {
			flexDirection: "row",
			alignItems: "center",
			gap: 16,
		},
		controlButton: {
			width: 36,
			height: 36,
			borderRadius: 18,
			backgroundColor: colors.primary,
			justifyContent: "center",
			alignItems: "center",
		},
		controlButtonDisabled: {
			opacity: 0.3,
		},
		contributionText: {
			fontSize: 20,
			fontFamily: "HossRound-Bold",
			minWidth: 30,
			textAlign: "center",
		},
		progressBar: {
			flex: 1,
			height: 8,
			backgroundColor: colors.background,
			borderRadius: 4,
			overflow: "hidden",
			marginRight: 16,
		},
		progressFill: {
			height: "100%",
			borderRadius: 4,
		},
		fabContainer: {
			position: "absolute",
			bottom: 20,
			right: 20,
		},
		fab: {
			width: 60,
			height: 60,
			borderRadius: 30,
			backgroundColor: colors.primary,
			justifyContent: "center",
			alignItems: "center",
			shadowColor: colors.primary,
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.3,
			shadowRadius: 8,
			elevation: 8,
		},
	});

	const renderItem = ({ item }: { item: ShoppingListInterface }) => {
		const progress =
			item.quantity > 0 ? item.broughtQuantity / item.quantity : 0;
		const isComplete = item.broughtQuantity >= item.quantity;

		return (
			<Pressable
				style={styles.itemCard}
				onPress={() => handleOpenBottomSheet(item)}
			>
				<View style={styles.itemHeader}>
					<View style={styles.itemInfo}>
						<ThemedText style={styles.itemName}>
							{item.name}
						</ThemedText>
						<ThemedText style={styles.itemQuantity}>
							Objectif: {item.quantity}
						</ThemedText>
					</View>
					<Pressable
						style={styles.deleteButton}
						onPress={() => handleDeleteItem(item)}
						hitSlop={8}
					>
						<FontAwesome
							name="trash"
							size={18}
							color={colors.red}
						/>
					</Pressable>
				</View>

				<View style={styles.itemControls}>
					<View style={styles.progressBar}>
						<View
							style={[
								styles.progressFill,
								{
									width: `${progress * 100}%`,
									backgroundColor: isComplete
										? colors.green
										: colors.secondary,
								},
							]}
						/>
					</View>

					<View style={styles.controlButtons}>
						<Pressable
							style={[
								styles.controlButton,
								item.broughtQuantity === 0 &&
									styles.controlButtonDisabled,
							]}
							onPress={() => handleDecrement(item)}
							disabled={item.broughtQuantity === 0}
						>
							<FontAwesome
								name="minus"
								size={16}
								color={colors.white}
							/>
						</Pressable>

						<ThemedText style={styles.contributionText}>
							{item.broughtQuantity}
						</ThemedText>

						<Pressable
							style={[
								styles.controlButton,
								isComplete && styles.controlButtonDisabled,
							]}
							onPress={() => handleIncrement(item)}
							disabled={isComplete}
						>
							<FontAwesome
								name="plus"
								size={16}
								color={colors.white}
							/>
						</Pressable>
					</View>
				</View>
			</Pressable>
		);
	};

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<Stack.Screen
				options={{
					title: `${partyTitle} - Liste`,
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.white,
					headerTitleStyle: {
						fontFamily: "HossRound",
						fontSize: 18,
						textTransform: "uppercase",
					},
					headerShadowVisible: false,
				}}
			/>
			<GestureHandlerRootView style={styles.container}>
				<View style={{ position: "relative" }}>
					<View
						style={{
							position: "absolute",
							backgroundColor: colors.primary,
							height: "400%",
							width: "100%",
							right: 0,
							bottom: "50%",
						}}
					/>
					<View style={{ padding: 10 }}>
						<ThemedTextInput
							placeholder="Rechercher un article..."
							value={searchQuery}
							onChangeText={setSearchQuery}
							containerStyle={{ marginBottom: 0 }}
						/>
					</View>
				</View>

				<FlatList
					data={filteredItems}
					renderItem={renderItem}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={[
						styles.listContainer,
						filteredItems.length === 0 && { flex: 1 },
					]}
					ListEmptyComponent={
						<View style={styles.emptyContainer}>
							<FontAwesome
								name="shopping-basket"
								size={60}
								color={colors.paragraphDisabled}
								style={{ marginBottom: 16 }}
							/>
							<ThemedText style={styles.emptyText}>
								{searchQuery
									? "Aucun article trouvé"
									: "Aucun article dans la liste\nAppuyez sur + pour en ajouter"}
							</ThemedText>
						</View>
					}
				/>

				{/* FAB */}
				<View style={styles.fabContainer}>
					<Pressable
						style={({ pressed }) => [
							styles.fab,
							{ opacity: pressed ? 0.8 : 1 },
						]}
						onPress={() => handleOpenBottomSheet(null)}
					>
						<FontAwesome
							name="plus"
							size={24}
							color={colors.white}
						/>
					</Pressable>
				</View>

				{/* Bottom Sheet */}
				<ShoppingListItemBottomSheet
					ref={bottomSheetRef}
					item={selectedItem}
					onSave={handleSaveItem}
					onCancel={handleCloseBottomSheet}
				/>
			</GestureHandlerRootView>
		</View>
	);
}
