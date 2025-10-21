import ContactPicker from "@/components/ContactPicker";
import InvitedUsersList from "@/components/InvitedUsersList";
import PartyMembersList from "@/components/PartyMembersList";
import ThemedButton from "@/components/Theme/ThemedButton";
import ThemedText from "@/components/Theme/ThemedText";
import UserDetailsBottomSheet from "@/components/UserDetailsBottomSheet";
import partiesFixture from "@/fixtures/parties";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { UserInterface } from "@/types/UserInterface";
import { InvitationInterface } from "@/types/InvitationInterface";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
} from "react-native";

export default function Members() {
	const colors = useThemeColors();
	const styles = useMemo(() => getStyles(colors), [colors]);
	const { id } = useLocalSearchParams();
	const [contactPickerVisible, setContactPickerVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [members, setMembers] = useState(partiesFixture.member[0].members);
	const [invitations, setInvitations] = useState(
		partiesFixture.member[0].invitations,
	);

	// Bottom sheet states
	const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
	const [selectedInvitation, setSelectedInvitation] =
		useState<InvitationInterface | null>(null);
	const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
	const [bottomSheetType, setBottomSheetType] = useState<"member" | "invitation">(
		"member",
	);

	// In a real app, you would fetch the party data based on the id
	const party = partiesFixture.member[0];

	const handleInvite = useCallback(
		(contacts: Array<{ phoneNumber: string; name: string }>) => {
			// In a real app, this would send invitations via API
			Alert.alert(
				"Invitations envoyées",
				`${contacts.length} invitation(s) ont été envoyées avec succès.`,
				[{ text: "OK" }],
			);
			console.log("Inviting contacts:", contacts);
		},
		[],
	);

	const handleSelectMember = useCallback((member: UserInterface) => {
		setSelectedUser(member);
		setSelectedInvitation(null);
		setBottomSheetType("member");
		setBottomSheetVisible(true);
	}, []);

	const handleSelectInvitation = useCallback(
		(invitation: InvitationInterface) => {
			setSelectedInvitation(invitation);
			setSelectedUser(invitation.invitedUser);
			setBottomSheetType("invitation");
			setBottomSheetVisible(true);
		},
		[],
	);

	const handleDeleteMember = useCallback(() => {
		if (!selectedUser) return;
		setMembers((prevMembers) =>
			prevMembers.filter((m) => m.id !== selectedUser.id),
		);
		setBottomSheetVisible(false);
		console.log("Member deleted:", selectedUser.id);
	}, [selectedUser]);

	const handleCancelInvitation = useCallback(() => {
		if (!selectedInvitation) return;
		setInvitations((prevInvitations) =>
			prevInvitations.filter((inv) => inv.id !== selectedInvitation.id),
		);
		setBottomSheetVisible(false);
		console.log("Invitation cancelled:", selectedInvitation.id);
	}, [selectedInvitation]);

	const pendingInvitations = useMemo(
		() => invitations.filter((inv) => inv.status === "pending"),
		[invitations],
	);

	const filteredMembers = useMemo(() => {
		if (!searchQuery.trim()) return members;
		const query = searchQuery.toLowerCase();
		return members.filter(
			(member) =>
				member.firstname.toLowerCase().includes(query) ||
				member.lastname.toLowerCase().includes(query),
		);
	}, [members, searchQuery]);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<KeyboardAvoidingView
				style={[styles.container, { backgroundColor: colors.background }]}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
			>
			<ScrollView
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				{/* Header Stats Card */}
				<View style={styles.headerCard}>
					<View style={styles.statsRow}>
						<View style={styles.statItem}>
							<FontAwesome6
								name="user-check"
								size={24}
								color={colors.primary}
							/>
							<ThemedText variant="h2" style={styles.statNumber}>
								{members.length}
							</ThemedText>
							<ThemedText style={styles.statLabel}>
								Participants
							</ThemedText>
						</View>
						<View style={styles.statDivider} />
						<View style={styles.statItem}>
							<FontAwesome6
								name="clock"
								size={24}
								color={colors.third}
							/>
							<ThemedText variant="h2" style={styles.statNumber}>
								{pendingInvitations.length}
							</ThemedText>
							<ThemedText style={styles.statLabel}>
								En attente
							</ThemedText>
						</View>
					</View>
					<ThemedButton
						onPress={() => setContactPickerVisible(true)}
						style={styles.inviteButton}
					>
						<FontAwesome6
							name="user-plus"
							size={20}
							color={colors.white}
						/>
						<ThemedText color="white" style={styles.inviteButtonText}>
							Inviter des amis
						</ThemedText>
					</ThemedButton>
				</View>

				<View style={styles.content}>
					{/* Pending Invitations Section */}
					{pendingInvitations.length > 0 && (
						<View style={styles.pendingSection}>
							<View style={styles.pendingHeader}>
								<View style={styles.pendingBadge}>
									<FontAwesome6
										name="clock"
										size={14}
										color={colors.primary}
									/>
									<ThemedText style={styles.pendingBadgeText}>
										{pendingInvitations.length} en attente
									</ThemedText>
								</View>
							</View>
							<ThemedText style={styles.pendingSectionDescription}>
								Ces personnes ont été invitées et n'ont pas encore
								répondu
							</ThemedText>
							<InvitedUsersList
								invitations={pendingInvitations}
								onSelectInvitation={handleSelectInvitation}
							/>
						</View>
					)}

					{/* Members Section */}
					<View style={styles.membersSection}>
						<View style={styles.membersSectionHeader}>
							<View>
								<ThemedText
									variant="h2"
									style={styles.membersSectionTitle}
								>
									Membres confirmés
								</ThemedText>
								<ThemedText style={styles.membersSectionSubtitle}>
									{filteredMembers.length} sur{" "}
									{members.length}
									{searchQuery ? " (filtré)" : ""}
								</ThemedText>
							</View>
						</View>

						{/* Search Bar */}
						<View style={styles.searchContainer}>
							<FontAwesome6
								name="magnifying-glass"
								size={20}
								color={colors.paragraphDisabled}
								style={styles.searchIcon}
							/>
							<TextInput
								style={styles.searchInput}
								placeholder="Rechercher un participant..."
								placeholderTextColor={colors.paragraphDisabled}
								value={searchQuery}
								onChangeText={setSearchQuery}
							/>
							{searchQuery.length > 0 && (
								<FontAwesome6
									name="xmark"
									size={16}
									color={colors.paragraphDisabled}
									style={styles.clearIcon}
									onPress={() => setSearchQuery("")}
								/>
							)}
						</View>

						{filteredMembers.length === 0 ? (
							<View style={styles.emptyState}>
								<FontAwesome6
									name="user-slash"
									size={48}
									color={colors.paragraphDisabled}
									style={styles.emptyIcon}
								/>
								<ThemedText style={styles.emptyText}>
									Aucun participant trouvé
								</ThemedText>
								<ThemedText style={styles.emptySubtext}>
									Essayez avec un autre nom
								</ThemedText>
							</View>
						) : (
							<PartyMembersList
								members={filteredMembers}
								owner={party.owner}
								onSelectMember={handleSelectMember}
							/>
						)}
					</View>
				</View>
			</ScrollView>

			<ContactPicker
				visible={contactPickerVisible}
				onClose={() => setContactPickerVisible(false)}
				onInvite={handleInvite}
				existingMembers={members}
				existingInvitations={invitations.map((inv) => ({
					phoneNumber: inv.invitedUser.phoneNumber,
				}))}
			/>

		<UserDetailsBottomSheet
			visible={bottomSheetVisible}
			user={selectedUser}
			type={bottomSheetType}
			owner={party.owner}
			onClose={() => setBottomSheetVisible(false)}
			onDelete={handleDeleteMember}
			onCancel={handleCancelInvitation}
		/>
		</KeyboardAvoidingView>
	</GestureHandlerRootView>
	);
}

const getStyles = (colors: ReturnType<typeof useThemeColors>) =>
	StyleSheet.create({
		container: {
			flex: 1,
		},
		headerCard: {
			backgroundColor: colors.white,
			marginHorizontal: 15,
			marginTop: 15,
			marginBottom: 10,
			padding: 20,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: colors.primary,
			shadowColor: colors.primary,
			shadowOffset: { width: 2, height: 2 },
			shadowOpacity: 1,
			shadowRadius: 0,
			gap: 20,
		},
		statsRow: {
			flexDirection: "row",
			justifyContent: "space-around",
			alignItems: "center",
		},
		statItem: {
			flex: 1,
			alignItems: "center",
			gap: 8,
		},
		statDivider: {
			width: 1,
			height: 60,
			backgroundColor: colors.primary,
			opacity: 0.2,
		},
		statNumber: {
			fontSize: 32,
			fontFamily: "HossRound-Bold",
		},
		statLabel: {
			fontSize: 13,
			opacity: 0.7,
			textAlign: "center",
		},
		inviteButton: {
			paddingVertical: 14,
			flexDirection: "row",
			gap: 10,
			justifyContent: "center",
			alignItems: "center",
		},
		inviteButtonText: {
			fontSize: 16,
			fontFamily: "HossRound-Bold",
		},
		content: {
			padding: 15,
			gap: 25,
		},
		pendingSection: {
			backgroundColor: colors.white,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: colors.third,
			padding: 15,
			gap: 12,
			shadowColor: colors.third,
			shadowOffset: { width: 2, height: 2 },
			shadowOpacity: 0.5,
			shadowRadius: 0,
		},
		pendingHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		pendingBadge: {
			flexDirection: "row",
			alignItems: "center",
			gap: 8,
			backgroundColor: colors.third,
			paddingHorizontal: 12,
			paddingVertical: 6,
			borderRadius: 20,
		},
		pendingBadgeText: {
			fontSize: 13,
			fontFamily: "HossRound-Bold",
			color: colors.primary,
		},
		pendingSectionDescription: {
			fontSize: 13,
			opacity: 0.7,
			lineHeight: 18,
		},
		membersSection: {
			gap: 15,
		},
		membersSectionHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "flex-start",
		},
		membersSectionTitle: {
			textTransform: "uppercase",
			fontSize: 20,
		},
		membersSectionSubtitle: {
			fontSize: 13,
			opacity: 0.6,
			marginTop: 4,
		},
		searchContainer: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: colors.white,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
			paddingHorizontal: 12,
			paddingVertical: 10,
			gap: 10,
		},
		searchIcon: {
			opacity: 0.6,
		},
		searchInput: {
			flex: 1,
			fontSize: 15,
			fontFamily: "HossRound",
			color: colors.paragraph,
			padding: 0,
		},
		clearIcon: {
			opacity: 0.6,
			padding: 4,
		},
		emptyState: {
			alignItems: "center",
			paddingVertical: 40,
			gap: 10,
		},
		emptyIcon: {
			marginBottom: 10,
			opacity: 0.4,
		},
		emptyText: {
			fontSize: 16,
			fontFamily: "HossRound-Bold",
			color: colors.paragraphDisabled,
		},
		emptySubtext: {
			fontSize: 14,
			opacity: 0.6,
			color: colors.paragraphDisabled,
		},
	});
