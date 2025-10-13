import ContactPicker from "@/components/ContactPicker";
import InvitedUsersList from "@/components/InvitedUsersList";
import PartyMembersList from "@/components/PartyMembersList";
import ThemedButton from "@/components/Theme/ThemedButton";
import ThemedText from "@/components/Theme/ThemedText";
import partiesFixture from "@/fixtures/parties";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

export default function Members() {
	const colors = useThemeColors();
	const styles = useMemo(() => getStyles(colors), [colors]);
	const { id } = useLocalSearchParams();
	const [contactPickerVisible, setContactPickerVisible] = useState(false);

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

	const pendingInvitations = useMemo(
		() => party.invitations.filter((inv) => inv.status === "pending"),
		[party.invitations],
	);

	return (
		<ScrollView
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<View style={styles.content}>
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<ThemedText variant="h2" style={styles.sectionTitle}>
							Participants
						</ThemedText>
						<ThemedButton
							onPress={() => setContactPickerVisible(true)}
							style={styles.inviteButton}
						>
							<FontAwesome6
								name="user-plus"
								size={18}
								color={colors.white}
							/>
							<ThemedText color="white" style={styles.inviteButtonText}>
								Inviter
							</ThemedText>
						</ThemedButton>
					</View>
					<ThemedText style={styles.sectionDescription}>
						{party.members.length}{" "}
						{party.members.length > 1 ? "personnes participent" : "personne participe"}{" "}
						à cette soirée
					</ThemedText>
				</View>

				{pendingInvitations.length > 0 && (
					<View style={styles.section}>
						<View style={styles.subsectionHeader}>
							<FontAwesome6
								name="clock"
								size={16}
								color={colors.third}
								style={styles.subsectionIcon}
							/>
							<ThemedText style={styles.subsectionTitle}>
								En attente de réponse ({pendingInvitations.length})
							</ThemedText>
						</View>
						<ThemedText style={styles.subsectionDescription}>
							Ces personnes ont été invitées mais n'ont pas encore répondu
						</ThemedText>
						<InvitedUsersList invitations={pendingInvitations} />
					</View>
				)}

				<View style={styles.section}>
					<View style={styles.subsectionHeader}>
						<FontAwesome6
							name="check-circle"
							size={16}
							color={colors.green}
							style={styles.subsectionIcon}
						/>
						<ThemedText style={styles.subsectionTitle}>
							Membres confirmés ({party.members.length})
						</ThemedText>
					</View>
					<ThemedText style={styles.subsectionDescription}>
						Ces personnes participent à la soirée
					</ThemedText>
					<PartyMembersList members={party.members} owner={party.owner} />
				</View>
			</View>

			<ContactPicker
				visible={contactPickerVisible}
				onClose={() => setContactPickerVisible(false)}
				onInvite={handleInvite}
				existingMembers={party.members}
				existingInvitations={party.invitations.map((inv) => ({
					phoneNumber: inv.invitedUser.phoneNumber,
				}))}
			/>
		</ScrollView>
	);
}

const getStyles = (colors: ReturnType<typeof useThemeColors>) =>
	StyleSheet.create({
		container: {
			flex: 1,
		},
		content: {
			padding: 20,
			gap: 40,
		},
		section: {
			gap: 20,
		},
		sectionHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		sectionTitle: {
			textTransform: "uppercase",
		},
		sectionDescription: {
			fontSize: 14,
			opacity: 0.7,
			lineHeight: 20,
		},
		inviteButton: {
			paddingHorizontal: 20,
			paddingVertical: 10,
			flexDirection: "row",
			gap: 10,
			alignItems: "center",
		},
		inviteButtonText: {
			fontSize: 16,
			fontWeight: "600",
		},
		subsectionHeader: {
			flexDirection: "row",
			alignItems: "center",
			paddingTop: 10,
		},
		subsectionIcon: {
			marginRight: 8,
		},
		subsectionTitle: {
			fontSize: 16,
			fontWeight: "700",
		},
		subsectionDescription: {
			fontSize: 13,
			opacity: 0.6,
			lineHeight: 18,
			marginTop: -10,
		},
	});
