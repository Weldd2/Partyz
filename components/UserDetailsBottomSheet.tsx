import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import ThemedText from "@/components/Theme/ThemedText";
import useThemeColors from "@/hooks/useThemeColors";
import { UserInterface } from "@/types/UserInterface";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "expo-image";
import { useMemo, useCallback } from "react";
import {
	Alert,
	StyleSheet,
	View,
	TouchableOpacity,
} from "react-native";

interface UserDetailsBottomSheetProps {
	visible: boolean;
	user: UserInterface | null;
	type: "member" | "invitation";
	owner?: UserInterface;
	onClose: () => void;
	onDelete?: () => void;
	onCancel?: () => void;
}

export default function UserDetailsBottomSheet({
	visible,
	user,
	type,
	owner,
	onClose,
	onDelete,
	onCancel,
}: UserDetailsBottomSheetProps) {
	const colors = useThemeColors();
	const styles = useMemo(() => getStyles(colors), [colors]);
	const snapPoints = useMemo(() => [300], []);

	const isOwner = user && owner && user.id === owner.id;

	const handleDeletePress = useCallback(() => {
		if (!user) return;

		const confirmMessage =
			type === "member"
				? `Êtes-vous sûr de vouloir supprimer ${user.firstname} ${user.lastname} de la party?`
				: `Êtes-vous sûr de vouloir annuler l'invitation de ${user.firstname} ${user.lastname}?`;

		const successMessage =
			type === "member"
				? `${user.firstname} a été supprimé de la party.`
				: `L'invitation de ${user.firstname} a été annulée.`;

		Alert.alert(
			"Confirmer",
			confirmMessage,
			[
				{
					text: "Non, garder",
					onPress: () => {},
					style: "cancel",
				},
				{
					text: type === "member" ? "Supprimer" : "Annuler l'invitation",
					onPress: () => {
						if (type === "member" && onDelete) {
							onDelete();
						} else if (type === "invitation" && onCancel) {
							onCancel();
						}
						Alert.alert("Succès", successMessage, [
							{
								text: "OK",
								onPress: onClose,
							},
						]);
					},
					style: "destructive",
				},
			],
		);
	}, [user, type, onDelete, onCancel, onClose]);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				opacity={0.5}
				pressBehavior="close"
			/>
		),
		[],
	);

	if (!visible || !user) {
		return null;
	}

	return (
		<BottomSheet
			index={0}
			snapPoints={snapPoints}
			enablePanDownToClose
			onClose={onClose}
			backgroundStyle={{ backgroundColor: colors.background }}
			handleIndicatorStyle={{ backgroundColor: colors.primary }}
			backdropComponent={renderBackdrop}
			keyboardBehavior="extend"
			keyboardBlurBehavior="restore"
		>
			<BottomSheetView style={styles.container}>
				{/* User Avatar and Info */}
				<View style={styles.userHeader}>
					<View style={styles.avatarContainer}>
						<Image
							source={`https://i.pravatar.cc/150?u=${user.id}`}
							style={styles.avatar}
							contentFit="cover"
						/>
						{isOwner && (
							<View style={styles.ownerBadge}>
								<FontAwesome6
									name="crown"
									size={16}
									color={colors.primary}
								/>
							</View>
						)}
					</View>
					<View style={styles.userInfo}>
						<ThemedText
							variant="h2"
							style={styles.userName}
						>
							{user.firstname} {user.lastname}
						</ThemedText>
						{isOwner && (
							<View style={styles.ownerTag}>
								<ThemedText style={styles.ownerTagText}>
									Organisateur
								</ThemedText>
							</View>
						)}
						{type === "invitation" && (
							<View style={styles.pendingTag}>
								<FontAwesome6
									name="clock"
									size={12}
									color={colors.third}
									style={{ marginRight: 4 }}
								/>
								<ThemedText style={styles.pendingTagText}>
									En attente de réponse
								</ThemedText>
							</View>
						)}
					</View>
				</View>

				{/* Divider */}
				<View style={styles.divider} />

				{/* Actions */}
				<View style={styles.actionsContainer}>
					{user.phoneNumber && (
						<View style={styles.infoRow}>
							<FontAwesome6
								name="phone"
								size={16}
								color={colors.primary}
								style={styles.infoIcon}
							/>
							<ThemedText style={styles.infoText}>
								{user.phoneNumber}
							</ThemedText>
						</View>
					)}

					{/* Delete/Cancel Button */}
					{!isOwner && (
						<TouchableOpacity
							onPress={handleDeletePress}
							style={styles.deleteButton}
						>
							<FontAwesome6
								name={type === "member" ? "trash" : "ban"}
								size={16}
								color={colors.white}
								style={styles.deleteIcon}
							/>
							<ThemedText
								color="white"
								style={styles.deleteButtonText}
							>
								{type === "member"
									? "Supprimer de la party"
									: "Annuler l'invitation"}
							</ThemedText>
						</TouchableOpacity>
					)}
				</View>
			</BottomSheetView>
		</BottomSheet>
	);
}

const getStyles = (colors: ReturnType<typeof useThemeColors>) =>
	StyleSheet.create({
		container: {
			flex: 1,
			paddingHorizontal: 20,
			paddingVertical: 16,
		},
		userHeader: {
			flexDirection: "row",
			alignItems: "center",
			gap: 16,
			marginBottom: 20,
		},
		avatarContainer: {
			position: "relative",
		},
		avatar: {
			width: 80,
			height: 80,
			borderRadius: 40,
			borderWidth: 3,
			borderColor: colors.primary,
		},
		ownerBadge: {
			position: "absolute",
			bottom: -4,
			right: -4,
			backgroundColor: colors.third,
			borderRadius: 20,
			width: 36,
			height: 36,
			justifyContent: "center",
			alignItems: "center",
			borderWidth: 3,
			borderColor: colors.background,
		},
		userInfo: {
			flex: 1,
			gap: 8,
		},
		userName: {
			fontSize: 22,
			fontFamily: "HossRound-Bold",
		},
		ownerTag: {
			backgroundColor: colors.third,
			paddingHorizontal: 10,
			paddingVertical: 4,
			borderRadius: 6,
			alignSelf: "flex-start",
		},
		ownerTagText: {
			fontSize: 11,
			fontFamily: "HossRound-Bold",
			color: colors.primary,
		},
		pendingTag: {
			flexDirection: "row",
			backgroundColor: colors.third,
			paddingHorizontal: 10,
			paddingVertical: 4,
			borderRadius: 6,
			alignSelf: "flex-start",
			alignItems: "center",
		},
		pendingTagText: {
			fontSize: 11,
			fontFamily: "HossRound-Bold",
			color: colors.third,
		},
		divider: {
			height: 1,
			backgroundColor: colors.primary,
			opacity: 0.1,
			marginBottom: 16,
		},
		actionsContainer: {
			gap: 12,
		},
		infoRow: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: colors.white,
			padding: 12,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
			gap: 10,
		},
		infoIcon: {
			opacity: 0.7,
		},
		infoText: {
			fontSize: 14,
			flex: 1,
		},
		deleteButton: {
			flexDirection: "row",
			backgroundColor: colors.secondary,
			paddingVertical: 12,
			paddingHorizontal: 16,
			borderRadius: 8,
			alignItems: "center",
			justifyContent: "center",
			gap: 10,
			shadowColor: colors.secondary,
			shadowOffset: { width: 1, height: 2 },
			shadowOpacity: 0.3,
			shadowRadius: 4,
		},
		deleteIcon: {
			marginRight: 4,
		},
		deleteButtonText: {
			fontSize: 14,
			fontFamily: "HossRound-Bold",
		},
	});
