import ThemedButton from "@/components/Theme/ThemedButton";
import ThemedText from "@/components/Theme/ThemedText";
import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
	Alert,
	Dimensions,
	FlatList,
	Modal,
	Pressable,
	StyleSheet,
	View,
} from "react-native";

// Images de fixtures pour la démo
const fixtureImages = [
	require("@/assets/images/fixtures/a2.jpg"),
	require("@/assets/images/fixtures/bubu.jpeg"),
	require("@/assets/images/fixtures/mlo.jpeg"),
	require("@/assets/images/fixtures/mlou.jpg"),
	require("@/assets/images/fixtures/sim.jpeg"),
];

type GalleryImage = {
	id: string;
	uri: any;
	addedBy: string;
	addedAt: Date;
};

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const SCREEN_WIDTH = Dimensions.get("window").width;

const getStyles = (colors: typeof Colors.light, columns: number) => {
	const spacing = 4;
	const itemWidth = (SCREEN_WIDTH - spacing * (columns + 1)) / columns;

	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		headerContainer: {
			paddingHorizontal: 15,
			paddingTop: 15,
			paddingBottom: 10,
			backgroundColor: colors.white,
			gap: 12,
			borderBottomWidth: 1,
			borderBottomColor: colors.primary,
		},
		headerTop: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		gridSelector: {
			flexDirection: "row",
			gap: 8,
			justifyContent: "center",
		},
		gridButton: {
			width: 36,
			height: 36,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
			backgroundColor: colors.white,
			justifyContent: "center",
			alignItems: "center",
		},
		gridButtonActive: {
			backgroundColor: colors.primary,
		},
		imageGrid: {
			padding: spacing,
		},
		imageContainer: {
			width: itemWidth,
			height: itemWidth,
			padding: spacing / 2,
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
		},
		emptyIcon: {
			marginBottom: 20,
		},
		modalOverlay: {
			flex: 1,
			backgroundColor: "rgba(0, 0, 0, 0.95)",
		},
		modalImage: {
			width: "100%",
			height: "100%",
		},
		modalHeader: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			paddingTop: 50,
			paddingHorizontal: 20,
			paddingBottom: 15,
		},
		modalCloseButton: {
			alignSelf: "flex-end",
			backgroundColor: "rgba(255, 255, 255, 0.2)",
			width: 40,
			height: 40,
			borderRadius: 20,
			justifyContent: "center",
			alignItems: "center",
		},
		modalFooter: {
			position: "absolute",
			bottom: 0,
			left: 0,
			right: 0,
			paddingHorizontal: 20,
			paddingBottom: 40,
		},
		modalInfo: {
			backgroundColor: "rgba(0, 0, 0, 0.6)",
			padding: 15,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: "rgba(255, 255, 255, 0.1)",
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
	});
};

export default function Gallery() {
	const colors = useThemeColors();
	const { id } = useLocalSearchParams();

	const [columns, setColumns] = useState(3);
	const styles = getStyles(colors, columns);

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
	const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(
		null,
	);

	const isSelectionMode = selectedImages.size > 0;

	const handleAddPhotos = () => {
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
	};

	const handleLongPress = (imageId: string) => {
		const newSelection = new Set(selectedImages);
		if (newSelection.has(imageId)) {
			newSelection.delete(imageId);
		} else {
			newSelection.add(imageId);
		}
		setSelectedImages(newSelection);
	};

	const handlePress = (image: GalleryImage) => {
		if (isSelectionMode) {
			handleLongPress(image.id);
		} else {
			setSelectedImage(image);
		}
	};

	const handleDeleteSelected = () => {
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
	};

	const handleCancelSelection = () => {
		setSelectedImages(new Set());
	};

	const formatDate = (date: Date) => {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffHours / 24);

		if (diffHours < 1) return "À l'instant";
		if (diffHours < 24) return `Il y a ${diffHours}h`;
		if (diffDays === 1) return "Hier";
		if (diffDays < 7) return `Il y a ${diffDays}j`;

		return date.toLocaleDateString("fr-FR", {
			day: "numeric",
			month: "short",
		});
	};

	const renderImage = ({ item }: { item: GalleryImage }) => {
		const isSelected = selectedImages.has(item.id);

		return (
			<View style={styles.imageContainer}>
				<Pressable
					onPress={() => handlePress(item)}
					onLongPress={() => handleLongPress(item.id)}
					delayLongPress={300}
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
								<FontAwesome
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
	};

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<View style={styles.headerTop}>
					<ThemedText
						style={{
							fontSize: 16,
							color: colors.paragraph,
							fontFamily: "HossRound-Bold",
						}}
					>
						{images.length} photo{images.length > 1 ? "s" : ""}
					</ThemedText>
					<Pressable onPress={handleAddPhotos}>
						<FontAwesome
							name="plus-circle"
							size={28}
							color={colors.primary}
						/>
					</Pressable>
				</View>

				<View style={styles.gridSelector}>
					{[2, 3, 4, 5].map((col) => (
						<Pressable
							key={col}
							style={[
								styles.gridButton,
								columns === col && styles.gridButtonActive,
							]}
							onPress={() => setColumns(col)}
						>
							<ThemedText
								style={{
									fontSize: 14,
									fontFamily: "HossRound-Bold",
									color:
										columns === col
											? colors.white
											: colors.primary,
								}}
							>
								{col}
							</ThemedText>
						</Pressable>
					))}
				</View>
			</View>

			{images.length === 0 ? (
				<View style={styles.emptyState}>
					<FontAwesome
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
							marginBottom: 20,
						}}
					>
						Aucune photo pour le moment.{"\n"}
						Soyez le premier à partager vos souvenirs !
					</ThemedText>
					<ThemedButton
						text="Ajouter une photo"
						onPress={handleAddPhotos}
					/>
				</View>
			) : (
				<FlatList
					data={images}
					renderItem={renderImage}
					keyExtractor={(item) => item.id}
					numColumns={columns}
					key={columns}
					contentContainerStyle={styles.imageGrid}
					showsVerticalScrollIndicator={false}
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
							<FontAwesome
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

			{/* Modal pour afficher l'image en plein écran */}
			<Modal
				visible={selectedImage !== null}
				transparent
				animationType="fade"
				onRequestClose={() => setSelectedImage(null)}
			>
				<View style={styles.modalOverlay}>
					<LinearGradient
						colors={["rgba(0, 0, 0, 0.8)", "transparent"]}
						style={styles.modalHeader}
					>
						<Pressable
							style={styles.modalCloseButton}
							onPress={() => setSelectedImage(null)}
						>
							<FontAwesome
								name="times"
								size={20}
								color={colors.white}
							/>
						</Pressable>
					</LinearGradient>

					{selectedImage && (
						<>
							<Image
								source={selectedImage.uri}
								style={styles.modalImage}
								contentFit="contain"
							/>
							<LinearGradient
								colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
								style={styles.modalFooter}
							>
								<View style={styles.modalInfo}>
									<ThemedText
										style={{
											fontSize: 16,
											color: colors.white,
											marginBottom: 5,
											fontFamily: "HossRound-Bold",
										}}
									>
										Ajoutée par {selectedImage.addedBy}
									</ThemedText>
									<ThemedText
										style={{
											fontSize: 14,
											color: colors.white,
											opacity: 0.8,
										}}
									>
										{formatDate(selectedImage.addedAt)}
									</ThemedText>
								</View>
							</LinearGradient>
						</>
					)}
				</View>
			</Modal>
		</View>
	);
}
