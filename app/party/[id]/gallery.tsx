import ImageModal from "@/components/ImageModal";
import ThemedText from "@/components/Theme/ThemedText";
import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
	Alert,
	FlatList,
	Pressable,
	StyleSheet,
	useWindowDimensions,
	View,
} from "react-native";

const fixtureImages = [
	"https://placehold.co/600x400",
	"https://placehold.co/600x400",
	"https://placehold.co/600x400",
	"https://placehold.co/600x400",
	"https://placehold.co/600x400",
];

type GalleryImage = {
	id: string;
	uri: string;
	addedBy: string;
	addedAt: Date;
};

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const GRID_SPACING = 4;
const LONG_PRESS_DELAY = 300;

const getStyles = (colors: typeof Colors.light, columns: number, screenWidth: number) => {
	const itemWidth = (screenWidth - GRID_SPACING * (columns + 1)) / columns;

	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		imageGrid: {
			padding: GRID_SPACING,
			paddingBottom: 100, // Extra padding for floating button
		},
		imageContainer: {
			width: itemWidth,
			height: itemWidth,
			padding: GRID_SPACING / 2,
		},
		imageWrapper: {
			width: "100%",
			height: "100%",
			borderRadius: 4,
			overflow: "hidden",
			backgroundColor: colors.white,
			position: "relative",
		},
		image: {
			width: "100%",
			height: "100%",
		},
		selectionOverlay: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(21, 45, 29, 0.7)",
			justifyContent: "center",
			alignItems: "center",
		},
		selectionCheckmark: {
			width: 32,
			height: 32,
			borderRadius: 16,
			backgroundColor: colors.third,
			justifyContent: "center",
			alignItems: "center",
		},
		imageGradient: {
			position: "absolute",
			bottom: 0,
			left: 0,
			right: 0,
			height: "40%",
			justifyContent: "flex-end",
			padding: 6,
		},
		emptyState: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			paddingHorizontal: 40,
			paddingVertical: 60,
			paddingBottom: 140, // Extra padding for floating button
		},
		emptyIcon: {
			marginBottom: 20,
		},
		selectionBar: {
			position: "absolute",
			bottom: 0,
			left: 0,
			right: 0,
			backgroundColor: colors.white,
			borderTopWidth: 1,
			borderTopColor: colors.primary,
			paddingHorizontal: 15,
			paddingVertical: 12,
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			shadowColor: colors.primary,
			shadowOffset: { width: 0, height: -2 },
			shadowOpacity: 0.1,
			shadowRadius: 8,
			elevation: 10,
		},
		selectionActions: {
			flexDirection: "row",
			gap: 10,
		},
		actionButton: {
			flexDirection: "row",
			alignItems: "center",
			gap: 6,
			paddingHorizontal: 16,
			paddingVertical: 10,
			borderRadius: 8,
			borderWidth: 1,
		},
		deleteButton: {
			backgroundColor: colors.red,
			borderColor: colors.red,
		},
		cancelButton: {
			backgroundColor: colors.white,
			borderColor: colors.primary,
		},
		floatingButton: {
			position: "absolute",
			bottom: 20,
			right: 20,
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
		settingsButton: {
			position: "absolute",
			top: 20,
			right: 20,
			width: 40,
			height: 40,
			borderRadius: 8,
			backgroundColor: colors.white,
			borderWidth: 1,
			borderColor: colors.primary,
			justifyContent: "center",
			alignItems: "center",
			shadowColor: colors.primary,
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.2,
			shadowRadius: 4,
			elevation: 4,
		},
		dropdownMenu: {
			position: "absolute",
			top: 68,
			right: 20,
			backgroundColor: colors.white,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
			shadowColor: colors.primary,
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.2,
			shadowRadius: 4,
			elevation: 4,
			overflow: "hidden",
		},
		dropdownItem: {
			paddingVertical: 12,
			paddingHorizontal: 20,
			flexDirection: "row",
			alignItems: "center",
			gap: 12,
			borderBottomWidth: 1,
			borderBottomColor: colors.background,
		},
		dropdownItemLast: {
			borderBottomWidth: 0,
		},
		dropdownItemActive: {
			backgroundColor: colors.background,
		},
	});
};

export default function Gallery() {
	const colors = useThemeColors();
	const { id } = useLocalSearchParams();
	const { width: screenWidth } = useWindowDimensions();

	const [columns, setColumns] = useState(3);
	const styles = useMemo(() => getStyles(colors, columns, screenWidth), [colors, columns, screenWidth]);

	const [images, setImages] = useState<GalleryImage[]>([
		{
			id: "1",
			uri: fixtureImages[0],
			addedBy: "Marie",
			addedAt: new Date(Date.now() - 86400000),
		},
		{
			id: "2",
			uri: fixtureImages[1],
			addedBy: "Toi",
			addedAt: new Date(Date.now() - 43200000),
		},
		{
			id: "3",
			uri: fixtureImages[2],
			addedBy: "Pierre",
			addedAt: new Date(Date.now() - 21600000),
		},
		{
			id: "4",
			uri: fixtureImages[3],
			addedBy: "Sophie",
			addedAt: new Date(Date.now() - 10800000),
		},
		{
			id: "5",
			uri: fixtureImages[4],
			addedBy: "Toi",
			addedAt: new Date(Date.now() - 7200000),
		},
		{
			id: "6",
			uri: fixtureImages[0],
			addedBy: "Marie",
			addedAt: new Date(Date.now() - 3600000),
		},
		{
			id: "7",
			uri: fixtureImages[1],
			addedBy: "Pierre",
			addedAt: new Date(Date.now() - 1800000),
		},
		{
			id: "8",
			uri: fixtureImages[2],
			addedBy: "Sophie",
			addedAt: new Date(Date.now() - 900000),
		},
	]);

	const [selectedImages, setSelectedImages] = useState<Set<string>>(
		new Set(),
	);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalInitialIndex, setModalInitialIndex] = useState(0);
	const [settingsVisible, setSettingsVisible] = useState(false);

	const isSelectionMode = selectedImages.size > 0;

	const handleAddPhotos = useCallback(() => {
		const newImage: GalleryImage = {
			id: Date.now().toString(),
			uri: fixtureImages[
				Math.floor(Math.random() * fixtureImages.length)
			],
			addedBy: "Toi",
			addedAt: new Date(),
		};
		setImages((prev) => [newImage, ...prev]);

		Alert.alert(
			"Photo ajoutée !",
			"Votre photo a été ajoutée à la galerie",
		);
	}, []);

	const handleLongPress = useCallback((imageId: string) => {
		setSelectedImages((prevSelection) => {
			const newSelection = new Set(prevSelection);
			const wasEmpty = prevSelection.size === 0;

			if (wasEmpty) {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			}

			if (newSelection.has(imageId)) {
				newSelection.delete(imageId);
			} else {
				newSelection.add(imageId);
			}
			return newSelection;
		});
	}, []);

	const handlePress = useCallback((image: GalleryImage, index: number) => {
		if (selectedImages.size > 0) {
			handleLongPress(image.id);
		} else {
			setModalInitialIndex(index);
			setModalVisible(true);
		}
	}, [selectedImages.size, handleLongPress]);

	const handleDeleteSelected = useCallback(() => {
		Alert.alert(
			"Supprimer les photos",
			`Êtes-vous sûr de vouloir supprimer ${selectedImages.size} photo${selectedImages.size > 1 ? "s" : ""} ?`,
			[
				{
					text: "Annuler",
					style: "cancel",
				},
				{
					text: "Supprimer",
					style: "destructive",
					onPress: () => {
						setImages((prev) =>
							prev.filter((img) => !selectedImages.has(img.id)),
						);
						setSelectedImages(new Set());
					},
				},
			],
		);
	}, [selectedImages]);

	const handleCancelSelection = useCallback(() => {
		setSelectedImages(new Set());
	}, []);

	const renderImage = useCallback(({
		item,
		index,
	}: {
		item: GalleryImage;
		index: number;
	}) => {
		const isSelected = selectedImages.has(item.id);

		return (
			<View style={styles.imageContainer}>
				<Pressable
					onPress={() => handlePress(item, index)}
					onLongPress={() => handleLongPress(item.id)}
					delayLongPress={LONG_PRESS_DELAY}
					style={styles.imageWrapper}
				>
					<Image
						source={item.uri}
						placeholder={{ blurhash }}
						style={styles.image}
						contentFit="cover"
						transition={200}
					/>

					{!isSelectionMode && (
						<LinearGradient
							colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
							style={styles.imageGradient}
						>
							<ThemedText
								style={{
									fontSize: 10,
									color: colors.white,
									fontFamily: "HossRound-Medium",
								}}
							>
								{item.addedBy}
							</ThemedText>
						</LinearGradient>
					)}

					{isSelected && (
						<View style={styles.selectionOverlay}>
							<View style={styles.selectionCheckmark}>
								<FontAwesome6
									name="check"
									size={18}
									color={colors.primary}
								/>
							</View>
						</View>
					)}
				</Pressable>
			</View>
		);
	}, [selectedImages, isSelectionMode, styles, colors, handlePress, handleLongPress]);

	return (
		<View style={styles.container}>

			{images.length === 0 ? (
				<View style={styles.emptyState}>
					<FontAwesome6
						name="camera"
						size={64}
						color={colors.paragraphDisabled}
						style={styles.emptyIcon}
					/>
					<ThemedText
						style={{
							textAlign: "center",
							color: colors.paragraphDisabled,
							fontSize: 16,
						}}
					>
						Aucune photo pour le moment.{"\n"}
						Soyez le premier à partager vos souvenirs !
					</ThemedText>
				</View>
			) : (
				<FlatList
					data={images}
					renderItem={renderImage}
					keyExtractor={(item) => item.id}
					numColumns={columns}
					key={`grid-${columns}`}
					contentContainerStyle={styles.imageGrid}
					showsVerticalScrollIndicator={false}
					removeClippedSubviews={true}
					maxToRenderPerBatch={10}
					updateCellsBatchingPeriod={50}
					windowSize={7}
					initialNumToRender={20}
				/>
			)}

			{/* Barre de sélection */}
			{isSelectionMode && (
				<View style={styles.selectionBar}>
					<ThemedText
						style={{
							fontSize: 16,
							fontFamily: "HossRound-Bold",
							color: colors.paragraph,
						}}
					>
						{selectedImages.size} sélectionnée
						{selectedImages.size > 1 ? "s" : ""}
					</ThemedText>
					<View style={styles.selectionActions}>
						<Pressable
							style={[styles.actionButton, styles.cancelButton]}
							onPress={handleCancelSelection}
						>
							<ThemedText
								style={{
									color: colors.primary,
									fontSize: 14,
									fontFamily: "HossRound-Medium",
								}}
							>
								Annuler
							</ThemedText>
						</Pressable>
						<Pressable
							style={[styles.actionButton, styles.deleteButton]}
							onPress={handleDeleteSelected}
						>
							<FontAwesome6
								name="trash"
								size={16}
								color={colors.white}
							/>
							<ThemedText
								style={{
									color: colors.white,
									fontSize: 14,
									fontFamily: "HossRound-Medium",
								}}
							>
								Supprimer
							</ThemedText>
						</Pressable>
					</View>
				</View>
			)}

			{/* Modal pour afficher l'image en plein écran avec navigation */}
			<ImageModal
				visible={modalVisible}
				images={images}
				initialIndex={modalInitialIndex}
				onClose={() => setModalVisible(false)}
			/>

			{/* Settings Button */}
			{!isSelectionMode && (
				<>
					<Pressable
						style={({ pressed }) => [
							styles.settingsButton,
							{
								transform: pressed ? [{ scale: 1.2 }] : [{ scale: 1 }],
							},
						]}
						onPress={() => setSettingsVisible(!settingsVisible)}
					>
						<FontAwesome6 name="gear" size={20} color={colors.primary} />
					</Pressable>

					{settingsVisible && (
						<View style={styles.dropdownMenu}>
							<ThemedText
								style={{
									paddingHorizontal: 20,
									paddingVertical: 8,
									fontSize: 12,
									color: colors.paragraphDisabled,
									fontFamily: "HossRound-Bold",
								}}
							>
								TAILLE DE LA GRILLE
							</ThemedText>
							{[2, 3, 4, 5].map((col, index) => (
								<Pressable
									key={col}
									style={[
										styles.dropdownItem,
										columns === col && styles.dropdownItemActive,
										index === 3 && styles.dropdownItemLast,
									]}
									onPress={() => {
										setColumns(col);
										setSettingsVisible(false);
									}}
								>
									<ThemedText
										style={{
											fontSize: 16,
											fontFamily:
												columns === col
													? "HossRound-Bold"
													: "HossRound",
											color: colors.paragraph,
										}}
									>
										{col} colonnes
									</ThemedText>
									{columns === col && (
										<FontAwesome6
											name="check"
											size={16}
											color={colors.primary}
										/>
									)}
								</Pressable>
							))}
						</View>
					)}
				</>
			)}

			{/* Floating Action Button */}
			{!isSelectionMode && (
				<Pressable
					style={({ pressed }) => [
						styles.floatingButton,
						{
							transform: pressed ? [{ scale: 1.2 }] : [{ scale: 1 }],
						},
					]}
					onPress={handleAddPhotos}
				>
					<FontAwesome6 name="plus" size={24} color={colors.white} />
				</Pressable>
			)}
		</View>
	);
}
