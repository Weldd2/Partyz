import ThemedText from "@/components/Theme/ThemedText";
import useThemeColors from "@/hooks/useThemeColors";
import { InvitationInterface } from "@/types/InvitationInterface";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
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
		<View style={styles.invitationCard}>
			<View style={styles.avatarContainer}>
				<Image
					source={`https://i.pravatar.cc/150?u=${item.invitedUser.id}`}
					style={styles.avatar}
					contentFit="cover"
				/>
				<View style={styles.pendingBadge}>
					<FontAwesome6
						name="clock"
						size={10}
						color={colors.primary}
					/>
				</View>
			</View>
			<View style={styles.userInfo}>
				<ThemedText style={styles.userName}>
					{item.invitedUser.firstname}
				</ThemedText>
				<ThemedText style={styles.userLastname}>
					{item.invitedUser.lastname}
				</ThemedText>
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
			marginVertical: 5,
		},
		listContent: {
			gap: 12,
			paddingVertical: 5,
		},
		invitationCard: {
			alignItems: "center",
			gap: 10,
			backgroundColor: colors.background,
			borderRadius: 10,
			padding: 10,
			minWidth: 100,
		},
		avatarContainer: {
			position: "relative",
		},
		avatar: {
			width: 65,
			height: 65,
			borderRadius: 32.5,
			borderWidth: 2,
			borderColor: colors.third,
			opacity: 0.7,
		},
		pendingBadge: {
			position: "absolute",
			bottom: -2,
			right: -2,
			backgroundColor: colors.third,
			borderRadius: 12,
			width: 24,
			height: 24,
			justifyContent: "center",
			alignItems: "center",
			borderWidth: 2,
			borderColor: colors.background,
		},
		userInfo: {
			alignItems: "center",
			gap: 2,
		},
		userName: {
			fontSize: 13,
			fontFamily: "HossRound-Bold",
			textAlign: "center",
		},
		userLastname: {
			fontSize: 11,
			opacity: 0.7,
			textAlign: "center",
		},
	});

export default InvitedUsersList;
