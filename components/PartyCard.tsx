import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { PartyInterface } from "@/types/PartyInterface";
import * as Calendar from "expo-calendar";
import { Link } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import { Alert, Share, StyleSheet, View } from "react-native";
import ThemedButton from "./Theme/ThemedButton";
import ThemedText from "./Theme/ThemedText";

type Props = {
	party: PartyInterface;
};

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		card: {
			backgroundColor: colors.white,
			borderColor: colors.primary,
			borderWidth: 1,
			borderRadius: 8,
			shadowColor: colors.primary,
			shadowOffset: { width: 1, height: 1 },
			shadowOpacity: 1,
			shadowRadius: 0,
			paddingHorizontal: 16,
			paddingVertical: 20,
			gap: 14,
		},
		address: {
			backgroundColor: colors.secondary,
			fontSize: 16,
			padding: 3,
			flex: 0,
			width: "auto",
		},
		tag: {
			alignSelf: "flex-start",
			position: "absolute",
			top: 0,
			right: 0,
			padding: 5,
			backgroundColor: colors.third,
			zIndex: 1,
			transform: [{ rotate: "13deg" }],
		},
		title: {
			color: colors.primary,
		},
	});

const PartyCard = memo(({ party }: Props) => {
	const colors = useThemeColors();
	const styles = useMemo(() => getStyles(colors), [colors]);

	const formattedDate = useMemo(
		() =>
			new Date(party.date).toLocaleDateString("fr-FR", {
				weekday: "short",
				year: "numeric",
				month: "long",
				day: "numeric",
			}),
		[party.date],
	);

	const formattedTime = useMemo(
		() =>
			new Date(party.date).toLocaleTimeString("fr-FR", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			}),
		[party.date],
	);

	const handleShare = useCallback(async () => {
		try {
			const shareMessage = `🎉 Invitation à ${party.title}\n\n📍 ${party.address}\n📅 ${formattedDate} à ${formattedTime}\n\nOrganisé par ${party.owner}\n\nRejoins-nous pour cette soirée !`;

			const result = await Share.share(
				{
					message: shareMessage,
					title: `Invitation - ${party.title}`,
				},
				{
					// iOS only options
					subject: `Invitation - ${party.title}`,
					dialogTitle: "Partager l'invitation",
				},
			);

			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// Shared with activity type of result.activityType
					console.log("Shared via:", result.activityType);
				} else {
					// Shared
					console.log("Shared successfully");
				}
			} else if (result.action === Share.dismissedAction) {
				// Dismissed
				console.log("Share dismissed");
			}
		} catch (error) {
			Alert.alert(
				"Erreur",
				"Impossible de partager l'invitation pour le moment.",
			);
			console.error("Error sharing:", error);
		}
	}, [party, formattedDate, formattedTime]);

	const handleAddToCalendar = useCallback(async () => {
		try {
			// Request calendar permissions
			const { status } = await Calendar.requestCalendarPermissionsAsync();

			if (status !== "granted") {
				Alert.alert(
					"Permission refusée",
					"L'accès au calendrier est nécessaire pour ajouter cet événement.",
				);
				return;
			}

			// Get default calendar
			const calendars = await Calendar.getCalendarsAsync(
				Calendar.EntityTypes.EVENT,
			);

			let defaultCalendar = calendars.find(
				(cal) =>
					cal.allowsModifications &&
					(cal.isPrimary || cal.source.name === "iCloud"),
			);

			// If no primary calendar found, use the first modifiable one
			if (!defaultCalendar) {
				defaultCalendar = calendars.find(
					(cal) => cal.allowsModifications,
				);
			}

			if (!defaultCalendar) {
				Alert.alert(
					"Erreur",
					"Aucun calendrier disponible pour ajouter l'événement.",
				);
				return;
			}

			// Parse the party date
			const eventDate = new Date(party.date);
			const endDate = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000); // Add 3 hours

			// Create the calendar event
			const eventId = await Calendar.createEventAsync(
				defaultCalendar.id,
				{
					title: party.title,
					startDate: eventDate,
					endDate: endDate,
					location: party.address,
					notes: `Organisé par ${party.owner}\n\n${party.members} personnes participent`,
					timeZone: "Europe/Paris",
					alarms: [
						{ relativeOffset: -60 }, // 1 hour before
						{ relativeOffset: -24 * 60 }, // 1 day before
					],
				},
			);

			Alert.alert(
				"Succès",
				"L'événement a été ajouté à votre calendrier !",
			);
			console.log("Event created with ID:", eventId);
		} catch (error) {
			Alert.alert(
				"Erreur",
				"Impossible d'ajouter l'événement au calendrier.",
			);
			console.error("Error adding to calendar:", error);
		}
	}, [party, formattedDate, formattedTime]);

	return (
		<View style={styles.card}>
			<View style={styles.tag}>
				<ThemedText style={{ fontSize: 16 }}>Les Caennais</ThemedText>
			</View>
			<View style={{ gap: 10 }}>
				<View style={{ alignSelf: "flex-start" }}>
					<ThemedText style={styles.address}>
						{party.address}
					</ThemedText>
				</View>
				<View>
					<ThemedText variant="h3" style={styles.title}>
						{party.title}
					</ThemedText>
					<ThemedText style={{ color: colors.paragraphDisabled }}>
						{formattedDate} | {formattedTime}
					</ThemedText>
				</View>
			</View>
			<View style={{ gap: 4 }}>
				<ThemedText
					style={{
						fontSize: 16,
					}}
				>
					{party.owner} et{" "}
					<Link
						href={`/party/members/${party.id}`}
						style={{ textDecorationLine: "underline" }}
					>
						{party.members} autres personnes
					</Link>
				</ThemedText>
				<ThemedText
					style={{
						fontSize: 14,
						color: colors.paragraphDisabled,
					}}
				>
					Rien à ramener !
				</ThemedText>
			</View>
			<View style={{ flexDirection: "row", gap: 10 }}>
				<View style={{ alignSelf: "flex-start" }}>
					<ThemedButton
						text="Ajouter au calendrier"
						onPress={handleAddToCalendar}
					/>
				</View>
				<View style={{ alignSelf: "flex-start" }}>
					<ThemedButton
						variant="primary2"
						text="Partager"
						onPress={handleShare}
					/>
				</View>
			</View>
		</View>
	);
});

PartyCard.displayName = "PartyCard";

export default PartyCard;
