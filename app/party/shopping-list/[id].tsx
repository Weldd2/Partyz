import ShoppingListItemBottomSheet from "@/components/ShoppingListItemBottomSheet";
import ThemedTextInput from "@/components/Theme/Input/ThemedTextInput";
import ThemedText from "@/components/Theme/ThemedText";
import useThemeColors from "@/hooks/useThemeColors";
import { ShoppingListInterface } from "@/types/ShoppingListItem";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import BottomSheet from "@gorhom/bottom-sheet";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Alert,
	FlatList,
	Keyboard,
	Pressable,
	StyleSheet,
	View,
	Text,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useApi from "@/hooks/useApi";
import { PartyInterface } from "@/types/PartyInterface";
import { ApiCollectionInterface } from "@/types/ApiInterface";

type SortOption = "default" | "completed" | "name";

export default function ShoppingList() {
	const colors = useThemeColors();
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const bottomSheetRef = useRef<BottomSheet>(null);

	const {
		isLoading: isPartyLoading,
		error: isPartyError,
		data: party,
	} = useApi<PartyInterface>("party", `/parties/${id}`);

	const {
		isLoading: isShoppingListLoading,
		error: isShoppingListError,
		data: apiResponse,
	} = useApi<ApiCollectionInterface<ShoppingListInterface>>(
		"shoppingList",
		`/parties/${id}/shoppingListItem`,
	);

	const shoppingListItems = apiResponse?.member;

	const partyTitle = party ? party.title : "Shopping List";
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedItem, setSelectedItem] =
		useState<ShoppingListInterface | null>(null);
	const [sortBy, setSortBy] = useState<SortOption>("default");
	const [showSortMenu, setShowSortMenu] = useState(false);
	const [sortedList, setSortedList] = useState<ShoppingListInterface[]>([]);

	// Sort function
	const sortItems = useCallback(
		(items: ShoppingListInterface[]) => {
			return [...items].sort((a, b) => {
				// Priority 1: Items with broughtQuantity > 0 go first (user brought these)
				const aHasBrought = a.broughtQuantity > 0;
				const bHasBrought = b.broughtQuantity > 0;

				if (aHasBrought && !bHasBrought) return -1;
				if (!aHasBrought && bHasBrought) return 1;

				// Priority 2: Apply selected sort option
				if (sortBy === "default") {
					// Default: uncompleted first
					const aComplete = a.broughtQuantity >= a.quantity;
					const bComplete = b.broughtQuantity >= b.quantity;
					if (!aComplete && bComplete) return -1;
					if (aComplete && !bComplete) return 1;
					return 0;
				} else if (sortBy === "completed") {
					// Completed first
					const aComplete = a.broughtQuantity >= a.quantity;
					const bComplete = b.broughtQuantity >= b.quantity;
					if (aComplete && !bComplete) return -1;
					if (!aComplete && bComplete) return 1;
					return 0;
				} else if (sortBy === "name") {
					// Alphabetical by name
					return a.name.localeCompare(b.name);
				}
				return 0;
			});
		},
		[sortBy],
	);

	// Apply sorting only when sortBy changes or on initial load
	useEffect(() => {
		setSortedList(sortItems(shoppingListItems));
	}, [sortBy, sortItems, shoppingListItems]);

	// Keep sortedList in sync with shoppingList changes (updates only, not re-sorting)
	useEffect(() => {
		setSortedList((prevSorted) => {
			// Create a map of current shopping list items by id for quick lookup
			const shoppingMap = new Map(
				shoppingListItems.map((item) => [item.id, item]),
			);

			// Update existing items in sortedList with new data from shoppingList
			return prevSorted
				.map((sortedItem) => shoppingMap.get(sortedItem.id))
				.filter(
					(item): item is ShoppingListInterface => item !== undefined,
				);
		});
	}, [shoppingListItems]);

	// Filter items based on search (no sorting here)
	const filteredItems = useMemo(() => {
		if (!searchQuery.trim()) return sortedList;
		return sortedList.filter((item) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [sortedList, searchQuery]);

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
		button: {
			// handle area touch
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
		controlButtonDisabled: {
			opacity: 0.3,
		},
		contributionText: {
			fontSize: 20,
			fontFamily: "HossRound",
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
			width: 40,
			height: 40,
			borderRadius: 8,
			backgroundColor: colors.primary,
			justifyContent: "center",
			alignItems: "center",
			shadowColor: colors.primary,
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.3,
			shadowRadius: 8,
			elevation: 8,
		},
		sortButton: {
			paddingTop: 16,
			paddingHorizontal: 12,
			marginLeft: 8,
		},
		sortMenuContainer: {
			position: "absolute",
			top: 60,
			left: 0,
			padding: 2,
			backgroundColor: colors.white,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
			shadowColor: colors.primary,
			shadowOffset: { width: 2, height: 2 },
			shadowOpacity: 1,
			shadowRadius: 0,
			elevation: 8,
			zIndex: 1000,
		},
		sortMenuItem: {
			paddingVertical: 12,
			paddingHorizontal: 16,
			minWidth: 180,
		},
		sortMenuItemActive: {
			backgroundColor: colors.background,
		},
		sortMenuDivider: {
			height: 1,
			backgroundColor: colors.primary,
		},
		completedItem: {
			opacity: 0.6,
		},
		completedItemText: {
			textDecorationLine: "line-through",
			color: colors.paragraphDisabled,
		},
	});

	const renderItem = ({ item }: { item: ShoppingListInterface }) => {
		const progress =
			item.quantity > 0 ? item.broughtQuantity / item.quantity : 0;
		const isComplete = item.broughtQuantity >= item.quantity;

		return (
			<Pressable
				style={[styles.itemCard, isComplete && styles.completedItem]}
				onPress={() => handleOpenBottomSheet(item)}
			>
				<View style={styles.itemHeader}>
					<View style={styles.itemInfo}>
						<ThemedText
							style={[
								styles.itemName,
								isComplete && styles.completedItemText,
							]}
						>
							{item.name}
						</ThemedText>
					</View>
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
								styles.button,
								item.broughtQuantity === 0 &&
									styles.controlButtonDisabled,
							]}
							onPress={() => handleDecrement(item)}
							hitSlop={{
								top: 15,
								bottom: 15,
								left: 15,
								right: 15,
							}}
						>
							<FontAwesome6
								name="minus"
								size={20}
								color={colors.primary}
							/>
						</Pressable>

						<ThemedText style={styles.contributionText}>
							{item.broughtQuantity} / {item.quantity}
						</ThemedText>

						<Pressable
							style={[
								styles.button,
								isComplete && styles.controlButtonDisabled,
							]}
							onPress={() => handleIncrement(item)}
							hitSlop={{
								top: 15,
								bottom: 15,
								left: 15,
								right: 15,
							}}
						>
							<FontAwesome6
								name="plus"
								size={20}
								color={colors.primary}
							/>
						</Pressable>
					</View>
				</View>
			</Pressable>
		);
	};

	if (isPartyLoading || isShoppingListLoading) {
		return <Text>is loading</Text>;
	}

	if (isPartyError || !party || isShoppingListError || !shoppingListItems) {
		console.log(isPartyError);
		console.log(isShoppingListError);
		return <Text>error</Text>;
	}

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
							bottom: "40%",
						}}
					/>
					<View
						style={{
							paddingHorizontal: 10,
							paddingTop: 10,
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<View style={{ flex: 1 }}>
							<ThemedTextInput
								placeholder="Rechercher un article..."
								value={searchQuery}
								onChangeText={setSearchQuery}
								containerStyle={{ marginBottom: 0 }}
							/>
						</View>
					</View>
				</View>
				<View style={{ alignSelf: "flex-start", zIndex: 99999 }}>
					<Pressable
						style={styles.sortButton}
						onPress={() => setShowSortMenu(!showSortMenu)}
					>
						<FontAwesome6
							name="arrow-up-short-wide"
							size={16}
							color={colors.paragraphDisabled}
						/>
						<ThemedText
							style={{
								fontSize: 14,
								color: colors.paragraphDisabled,
							}}
						>
							Trier
						</ThemedText>
						{/* Sort Menu */}
						{showSortMenu && (
							<View style={styles.sortMenuContainer}>
								<Pressable
									style={[
										styles.sortMenuItem,
										sortBy === "default" &&
											styles.sortMenuItemActive,
									]}
									onPress={() => {
										setSortBy("default");
										setShowSortMenu(false);
									}}
								>
									<ThemedText style={{ fontSize: 14 }}>
										Par défaut (non complétés)
									</ThemedText>
								</Pressable>
								<View style={styles.sortMenuDivider} />
								<Pressable
									style={[
										styles.sortMenuItem,
										sortBy === "completed" &&
											styles.sortMenuItemActive,
									]}
									onPress={() => {
										setSortBy("completed");
										setShowSortMenu(false);
									}}
								>
									<ThemedText style={{ fontSize: 14 }}>
										Complétés d&apos;abord
									</ThemedText>
								</Pressable>
								<View style={styles.sortMenuDivider} />
								<Pressable
									style={[
										styles.sortMenuItem,
										sortBy === "name" &&
											styles.sortMenuItemActive,
									]}
									onPress={() => {
										setSortBy("name");
										setShowSortMenu(false);
									}}
								>
									<ThemedText style={{ fontSize: 14 }}>
										Par nom
									</ThemedText>
								</Pressable>
							</View>
						)}
					</Pressable>
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
							<FontAwesome6
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
							{
								transform: pressed
									? [{ scale: 1.2 }]
									: [{ scale: 1 }],
							},
						]}
						onPress={() => handleOpenBottomSheet(null)}
					>
						<FontAwesome6
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
