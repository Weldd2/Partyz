import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { PartyInterface } from "@/types/PartyInterface";
import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
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
						textDecorationLine: "underline",
					}}
				>
					{party.owner.firstname} et {party.members.length} autres
					personnes
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
					<ThemedButton text="Ajouter au calendrier" />
				</View>
				<View style={{ alignSelf: "flex-start" }}>
					<ThemedButton variant="primary2" text="Partager" />
				</View>
			</View>
		</View>
	);
});

PartyCard.displayName = "PartyCard";

export default PartyCard;
