import ThemedText from "@/components/Theme/ThemedText";
import useThemeColors from "@/hooks/useThemeColors";
import { UserInterface } from "@/types/UserInterface";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "expo-image";
import { memo, useMemo } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

interface PartyMembersListProps {
	members: Array<UserInterface>;
	owner: UserInterface;
	onSelectMember?: (member: UserInterface) => void;
}

const PartyMembersList = memo(function PartyMembersList({
	members,
	owner,
	onSelectMember,
}: PartyMembersListProps) {
	const colors = useThemeColors();
	const styles = useMemo(() => getStyles(colors), [colors]);

	const renderMember = ({ item }: { item: UserInterface }) => {
		const isOwner = item.id === owner.id;

		return (
			<Pressable
				style={({ pressed }) => [
					styles.memberCard,
					pressed && styles.memberCardPressed,
					isOwner && styles.ownerCard,
				]}
				onPress={() => onSelectMember?.(item)}
			>
				<View style={styles.avatarContainer}>
					<Image
						source={`https://i.pravatar.cc/150?u=${item.id}`}
						style={styles.avatar}
						contentFit="cover"
					/>
					{isOwner && (
						<View style={styles.ownerBadge}>
							<FontAwesome6
								name="crown"
								size={12}
								color={colors.primary}
							/>
						</View>
					)}
				</View>
				<View style={styles.memberInfo}>
					<ThemedText style={styles.memberName}>
						{item.firstname}
					</ThemedText>
					<ThemedText style={styles.memberLastname}>
						{item.lastname}
					</ThemedText>
					{isOwner && (
						<View style={styles.ownerLabel}>
							<ThemedText style={styles.ownerLabelText}>
								Organisateur
							</ThemedText>
						</View>
					)}
				</View>
			</Pressable>
		);
	};

	return (
		<FlatList
			data={members}
			renderItem={renderMember}
			keyExtractor={(item) => item.id.toString()}
			numColumns={2}
			columnWrapperStyle={styles.row}
			contentContainerStyle={styles.listContent}
			showsVerticalScrollIndicator={false}
			scrollEnabled={false}
			removeClippedSubviews={true}
			maxToRenderPerBatch={10}
			windowSize={10}
		/>
	);
});

const getStyles = (colors: ReturnType<typeof useThemeColors>) =>
	StyleSheet.create({
		listContent: {
			gap: 10,
		},
		row: {
			gap: 10,
			marginBottom: 10,
		},
		memberCard: {
			flex: 1,
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: colors.white,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: colors.primary,
			padding: 12,
			gap: 12,
			shadowColor: colors.primary,
			shadowOffset: { width: 1, height: 1 },
			shadowOpacity: 1,
			shadowRadius: 0,
		},
		memberCardPressed: {
			opacity: 0.7,
			transform: [{ scale: 0.98 }],
		},
		ownerCard: {
			borderColor: colors.third,
			borderWidth: 2,
			shadowColor: colors.third,
		},
		avatarContainer: {
			position: "relative",
		},
		avatar: {
			width: 50,
			height: 50,
			borderRadius: 25,
			borderWidth: 2,
			borderColor: colors.secondary,
		},
		ownerBadge: {
			position: "absolute",
			bottom: -2,
			right: -2,
			backgroundColor: colors.third,
			borderRadius: 10,
			width: 22,
			height: 22,
			justifyContent: "center",
			alignItems: "center",
			borderWidth: 2,
			borderColor: colors.white,
		},
		memberInfo: {
			flex: 1,
			gap: 2,
		},
		memberName: {
			fontSize: 15,
			fontFamily: "HossRound-Bold",
		},
		memberLastname: {
			fontSize: 13,
			opacity: 0.7,
		},
		ownerLabel: {
			alignSelf: "flex-start",
			backgroundColor: colors.third,
			paddingHorizontal: 8,
			paddingVertical: 2,
			borderRadius: 4,
			marginTop: 4,
		},
		ownerLabelText: {
			fontSize: 10,
			fontFamily: "HossRound-Bold",
			color: colors.primary,
		},
	});

export default PartyMembersList;
