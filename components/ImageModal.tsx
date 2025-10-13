import ThemedText from "@/components/Theme/ThemedText";
import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useCallback, useRef, useState } from "react";
import {
	FlatList,
	Modal,
	Pressable,
	StyleSheet,
	useWindowDimensions,
	View,
	ViewToken,
} from "react-native";

type GalleryImage = {
	id: string;
	uri: string;
	addedBy: string;
	addedAt: Date;
};

type Props = {
	visible: boolean;
	images: GalleryImage[];
	initialIndex: number;
	onClose: () => void;
};

const getStyles = (colors: typeof Colors.light, screenWidth: number) =>
	StyleSheet.create({
		modalOverlay: {
			flex: 1,
			backgroundColor: "rgba(0, 0, 0, 0.95)",
		},
		imageContainer: {
			width: screenWidth,
			height: "100%",
			justifyContent: "center",
			alignItems: "center",
		},
		modalImage: {
			width: screenWidth,
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
			zIndex: 10,
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
			zIndex: 10,
		},
		modalInfo: {
			backgroundColor: "rgba(0, 0, 0, 0.6)",
			padding: 15,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: "rgba(255, 255, 255, 0.1)",
		},
		counterContainer: {
			position: "absolute",
			top: 60,
			left: 20,
			backgroundColor: "rgba(0, 0, 0, 0.6)",
			paddingHorizontal: 12,
			paddingVertical: 6,
			borderRadius: 16,
		},
	});

const ImageModal = memo(({ visible, images, initialIndex, onClose }: Props) => {
	const colors = useThemeColors();
	const { width: screenWidth } = useWindowDimensions();
	const styles = getStyles(colors, screenWidth);
	const flatListRef = useRef<FlatList>(null);
	const [currentIndex, setCurrentIndex] = useState(initialIndex);

	const formatDate = useCallback((date: Date) => {
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
	}, []);

	const onViewableItemsChanged = useRef(
		({ viewableItems }: { viewableItems: ViewToken[] }) => {
			if (viewableItems.length > 0 && viewableItems[0].index !== null) {
				setCurrentIndex(viewableItems[0].index);
			}
		},
	).current;

	const viewabilityConfig = useRef({
		itemVisiblePercentThreshold: 50,
	}).current;

	const currentImage = images[currentIndex];

	const handleClose = useCallback(() => {
		// Reset à l'index initial pour la prochaine ouverture
		setCurrentIndex(initialIndex);
		onClose();
	}, [initialIndex, onClose]);

	const renderImage = useCallback(
		({ item }: { item: GalleryImage }) => (
			<View style={styles.imageContainer}>
				<Image
					source={item.uri}
					style={styles.modalImage}
					contentFit="contain"
				/>
			</View>
		),
		[styles.imageContainer, styles.modalImage],
	);

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={handleClose}
			statusBarTranslucent
		>
			<View style={styles.modalOverlay}>
				<FlatList
					ref={flatListRef}
					data={images}
					renderItem={renderImage}
					keyExtractor={(item) => `modal-${item.id}`}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					initialScrollIndex={initialIndex}
					getItemLayout={(_, index) => ({
						length: screenWidth,
						offset: screenWidth * index,
						index,
					})}
					onViewableItemsChanged={onViewableItemsChanged}
					viewabilityConfig={viewabilityConfig}
					removeClippedSubviews={true}
					maxToRenderPerBatch={3}
					windowSize={5}
				/>

				<LinearGradient
					colors={["rgba(0, 0, 0, 0.8)", "transparent"]}
					style={styles.modalHeader}
					pointerEvents="box-none"
				>
					<Pressable
						style={styles.modalCloseButton}
						onPress={handleClose}
					>
						<FontAwesome6
							name="xmark"
							size={20}
							color={colors.white}
						/>
					</Pressable>
				</LinearGradient>

				<View style={styles.counterContainer} pointerEvents="none">
					<ThemedText
						style={{
							color: colors.white,
							fontSize: 14,
							fontFamily: "HossRound-Medium",
						}}
					>
						{currentIndex + 1} / {images.length}
					</ThemedText>
				</View>

				{currentImage && (
					<LinearGradient
						colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
						style={styles.modalFooter}
						pointerEvents="box-none"
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
								Ajoutée par {currentImage.addedBy}
							</ThemedText>
							<ThemedText
								style={{
									fontSize: 14,
									color: colors.white,
									opacity: 0.8,
								}}
							>
								{formatDate(currentImage.addedAt)}
							</ThemedText>
						</View>
					</LinearGradient>
				)}
			</View>
		</Modal>
	);
});

ImageModal.displayName = "ImageModal";

export default ImageModal;
