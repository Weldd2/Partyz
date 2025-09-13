import ThemedButton from "@/components/Theme/ThemedButton";
import ThemedText from "@/components/Theme/ThemedText";
import useThemeColors from "@/hooks/useThemeColors";
import { UserInterface } from "@/types/UserInterface";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Contacts from "expo-contacts";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Modal,
	Pressable,
	StyleSheet,
	TextInput,
	View,
} from "react-native";

interface ContactPickerProps {
	visible: boolean;
	onClose: () => void;
	onInvite: (contacts: Array<{ phoneNumber: string; name: string }>) => void;
	existingMembers: Array<UserInterface>;
	existingInvitations: Array<{ phoneNumber: string }>;
}

interface ContactItem {
	id: string;
	name: string;
	phoneNumber: string;
}

const ContactPicker = memo(function ContactPicker({
	visible,
	onClose,
	onInvite,
	existingMembers,
	existingInvitations,
}: ContactPickerProps) {
	const colors = useThemeColors();
	const styles = useMemo(() => getStyles(colors), [colors]);
	const [contacts, setContacts] = useState<ContactItem[]>([]);
	const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
		new Set(),
	);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [permissionGranted, setPermissionGranted] = useState(false);

	// Get existing phone numbers to filter out
	const existingPhoneNumbers = useMemo(() => {
		const memberNumbers = new Set(
			existingMembers.map((m) => m.phoneNumber.replace(/\s/g, "")),
		);
		const invitationNumbers = new Set(
			existingInvitations.map((i) => i.phoneNumber.replace(/\s/g, "")),
		);
		return new Set([...memberNumbers, ...invitationNumbers]);
	}, [existingMembers, existingInvitations]);

	const loadContacts = useCallback(async () => {
		setLoading(true);
		try {
			const { status } = await Contacts.requestPermissionsAsync();
			if (status === "granted") {
				setPermissionGranted(true);
				const { data } = await Contacts.getContactsAsync({
					fields: [Contacts.Fields.PhoneNumbers],
				});

				if (data.length > 0) {
					const formattedContacts: ContactItem[] = [];
					data.forEach((contact) => {
						if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
							contact.phoneNumbers.forEach((phone) => {
								const phoneNumber = phone.number?.replace(/\s/g, "") || "";
								// Filter out contacts that are already members or invited
								if (
									phoneNumber &&
									!existingPhoneNumbers.has(phoneNumber)
								) {
									formattedContacts.push({
										id: `${contact.id}-${phone.id}`,
										name: contact.name || "Unknown",
										phoneNumber: phoneNumber,
									});
								}
							});
						}
					});
					setContacts(formattedContacts);
				}
			}
		} catch (error) {
			console.error("Error loading contacts:", error);
		} finally {
			setLoading(false);
		}
	}, [existingPhoneNumbers]);

	useEffect(() => {
		if (visible) {
			loadContacts();
		}
	}, [visible, loadContacts]);

	const filteredContacts = useMemo(() => {
		if (!searchQuery) return contacts;
		const query = searchQuery.toLowerCase();
		return contacts.filter(
			(contact) =>
				contact.name.toLowerCase().includes(query) ||
				contact.phoneNumber.includes(query),
		);
	}, [contacts, searchQuery]);

	const toggleContact = useCallback((contactId: string) => {
		setSelectedContacts((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(contactId)) {
				newSet.delete(contactId);
			} else {
				newSet.add(contactId);
			}
			return newSet;
		});
	}, []);

	const handleInvite = useCallback(() => {
		const selectedContactsList = contacts.filter((c) =>
			selectedContacts.has(c.id),
		);
		onInvite(selectedContactsList);
		setSelectedContacts(new Set());
		setSearchQuery("");
		onClose();
	}, [contacts, selectedContacts, onInvite, onClose]);

	const renderContact = useCallback(
		({ item }: { item: ContactItem }) => {
			const isSelected = selectedContacts.has(item.id);
			return (
				<Pressable
					onPress={() => toggleContact(item.id)}
					style={[
						styles.contactItem,
						isSelected && styles.contactItemSelected,
					]}
				>
					<View style={styles.contactInfo}>
						<ThemedText style={styles.contactName}>{item.name}</ThemedText>
						<ThemedText style={styles.contactPhone}>
							{item.phoneNumber}
						</ThemedText>
					</View>
					{isSelected && (
						<FontAwesome6 name="check-circle" size={24} color={colors.primary} />
					)}
				</Pressable>
			);
		},
		[selectedContacts, styles, colors, toggleContact],
	);

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
			onRequestClose={onClose}
		>
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<View style={styles.header}>
					<ThemedText variant="h2">Inviter des contacts</ThemedText>
					<Pressable onPress={onClose} style={styles.closeButton}>
						<FontAwesome6 name="times" size={24} color={colors.primary} />
					</Pressable>
				</View>

				{!permissionGranted && !loading ? (
					<View style={styles.permissionContainer}>
						<ThemedText style={styles.permissionText}>
							Permission d'accès aux contacts requise
						</ThemedText>
						<ThemedButton onPress={loadContacts}>
							<ThemedText color="white">Autoriser l'accès</ThemedText>
						</ThemedButton>
					</View>
				) : loading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color={colors.primary} />
						<ThemedText style={styles.loadingText}>
							Chargement des contacts...
						</ThemedText>
					</View>
				) : (
					<>
						<View style={styles.searchContainer}>
							<FontAwesome6
								name="search"
								size={16}
								color={colors.primary}
								style={styles.searchIcon}
							/>
							<TextInput
								style={[
									styles.searchInput,
									{ color: colors.primary, borderColor: colors.primary },
								]}
								placeholder="Rechercher un contact..."
								placeholderTextColor={colors.primary + "80"}
								value={searchQuery}
								onChangeText={setSearchQuery}
							/>
						</View>

						<FlatList
							data={filteredContacts}
							renderItem={renderContact}
							keyExtractor={(item) => item.id}
							style={styles.list}
							contentContainerStyle={styles.listContent}
							removeClippedSubviews={true}
							maxToRenderPerBatch={10}
							windowSize={10}
						/>

						{selectedContacts.size > 0 && (
							<View style={styles.footer}>
								<ThemedText style={styles.selectedCount}>
									{selectedContacts.size} contact(s) sélectionné(s)
								</ThemedText>
								<ThemedButton onPress={handleInvite}>
									<ThemedText color="white">
										Inviter ({selectedContacts.size})
									</ThemedText>
								</ThemedButton>
							</View>
						)}
					</>
				)}
			</View>
		</Modal>
	);
});

const getStyles = (colors: ReturnType<typeof useThemeColors>) =>
	StyleSheet.create({
		container: {
			flex: 1,
			paddingTop: 60,
		},
		header: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			paddingHorizontal: 20,
			paddingBottom: 20,
		},
		closeButton: {
			padding: 5,
		},
		permissionContainer: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			gap: 20,
			padding: 20,
		},
		permissionText: {
			textAlign: "center",
			fontSize: 16,
		},
		loadingContainer: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			gap: 20,
		},
		loadingText: {
			fontSize: 16,
		},
		searchContainer: {
			flexDirection: "row",
			alignItems: "center",
			marginHorizontal: 20,
			marginBottom: 15,
			paddingHorizontal: 15,
			paddingVertical: 10,
			borderRadius: 10,
			borderWidth: 1,
		},
		searchIcon: {
			marginRight: 10,
		},
		searchInput: {
			flex: 1,
			fontSize: 16,
			fontFamily: "HossRound",
		},
		list: {
			flex: 1,
		},
		listContent: {
			paddingHorizontal: 20,
		},
		contactItem: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingVertical: 15,
			paddingHorizontal: 15,
			borderRadius: 10,
			marginBottom: 10,
			backgroundColor: "#fff",
		},
		contactItemSelected: {
			backgroundColor: colors.primary + "15",
		},
		contactInfo: {
			flex: 1,
		},
		contactName: {
			fontSize: 16,
			fontWeight: "600",
			marginBottom: 4,
		},
		contactPhone: {
			fontSize: 14,
			opacity: 0.7,
		},
		footer: {
			padding: 20,
			gap: 15,
			borderTopWidth: 1,
			borderTopColor: colors.primary + "20",
		},
		selectedCount: {
			textAlign: "center",
			fontSize: 14,
			fontWeight: "600",
		},
	});

export default ContactPicker;
