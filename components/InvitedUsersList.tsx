import ThemedText from "@/components/Theme/ThemedText";
import useThemeColors from "@/hooks/useThemeColors";
import { InvitationInterface } from "@/types/InvitationInterface";
import { Image } from "expo-image";
import { memo, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";

interface InvitedUsersListProps {
	invitations: Array<InvitationInterface>;
}

const InvitedUsersList = memo(function InvitedUsersList({
	invitations,
}: InvitedUsersListProps) {
	const colors = useThemeColors();
	const styles = useMemo(() => getStyles(colors), [colors]);

	const pendingInvitations = useMemo(
		() => invitations.filter((inv) => inv.status === "pending"),
		[invitations],
	);

	if (pendingInvitations.length === 0) {
		return null;
	}

	const renderInvitation = ({ item }: { item: InvitationInterface }) => (
		<View style={styles.invitationItem}>
			<View style={styles.avatarContainer}>
				<Image
					source={`https://i.pravatar.cc/150?u=${item.invitedUser.id}`}
					style={styles.avatar}
					contentFit="cover"
				/>
				<View style={styles.pendingBadge}>
					<ThemedText style={styles.pendingBadgeText}>?</ThemedText>
				</View>
			</View>
			<View style={styles.userInfo}>
				<ThemedText style={styles.userName}>
					{item.invitedUser.firstname} {item.invitedUser.lastname}
				</ThemedText>
				<ThemedText style={styles.statusText}>En attente</ThemedText>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={pendingInvitations}
				renderItem={renderInvitation}
				keyExtractor={(item) => item.id}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.listContent}
			/>
		</View>
	);
});

const getStyles = (colors: ReturnType<typeof useThemeColors>) =>
	StyleSheet.create({
		container: {
			marginVertical: 10,
		},
		listContent: {
			gap: 15,
			paddingHorizontal: 5,
		},
		invitationItem: {
			alignItems: "center",
			gap: 8,
			width: 80,
		},
		avatarContainer: {
			position: "relative",
		},
		avatar: {
			width: 60,
			height: 60,
			borderRadius: 30,
			borderWidth: 2,
			borderColor: colors.third,
		},
		pendingBadge: {
			position: "absolute",
			bottom: 0,
			right: 0,
			backgroundColor: colors.third,
			borderRadius: 10,
			width: 20,
			height: 20,
			justifyContent: "center",
			alignItems: "center",
			borderWidth: 2,
			borderColor: colors.background,
		},
		pendingBadgeText: {
			fontSize: 12,
			fontWeight: "bold",
			color: colors.primary,
		},
		userInfo: {
			alignItems: "center",
			gap: 2,
		},
		userName: {
			fontSize: 12,
			fontWeight: "600",
			textAlign: "center",
		},
		statusText: {
			fontSize: 10,
			opacity: 0.6,
			fontStyle: "italic",
		},
	});

export default InvitedUsersList;
