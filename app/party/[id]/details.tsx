import Calendar from "@/components/Calendar";
import Map from "@/components/Map";
import PartyCard from "@/components/PartyCard";
import SliderButton from "@/components/Theme/SliderButton";
import SliderButtons from "@/components/Theme/SliderButtons";
import ThemedText from "@/components/Theme/ThemedText";
import UserSlider from "@/components/UserSlider";
import useApi from "@/hooks/useApi";
import useThemeColors from "@/hooks/useThemeColors";
import { PartyInterface } from "@/types/PartyInterface";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, View, Text } from "react-native";

export default function Detail() {
	const colors = useThemeColors();
	const { id } = useLocalSearchParams();
	const [activeView, setActiveView] = useState("carte");
	const {
		isLoading,
		error,
		data: party,
	} = useApi<PartyInterface>("party", `/parties/${id}`);

	if (isLoading) {
		return <Text>is loading</Text>;
	}

	if (error || !party) {
		console.error(error);
		return <Text>error</Text>;
	}

	return (
		<ScrollView style={{ backgroundColor: colors.background }}>
			<View style={{ position: "relative" }}>
				<View
					style={{
						position: "absolute",
						backgroundColor: colors.primary,
						height: "400%",
						width: "100%",
						right: 0,
						bottom: "50%",
					}}
				/>
				<View style={{ padding: 10, paddingTop: 15 }}>
					<PartyCard party={party} />
				</View>
			</View>
			<View
				style={{
					flex: 1,
					backgroundColor: colors.background,
					padding: 10,
				}}
			>
				<View
					style={{
						gap: 25,
						paddingVertical: 30,
					}}
				>
					<SliderButtons
						defaultActive="carte"
						onActiveChange={setActiveView}
					>
						<SliderButton
							text="Carte"
							isActive={activeView === "carte"}
							onPress={() => setActiveView("carte")}
						/>
						<SliderButton
							text="Calendrier"
							isActive={activeView === "calendrier"}
							onPress={() => setActiveView("calendrier")}
						/>
					</SliderButtons>
					{activeView === "carte" ? (
						<Map />
					) : (
						<Calendar party={party} />
					)}
				</View>
				<View style={{ gap: 30 }}>
					<ThemedText
						variant="h2"
						style={{
							textTransform: "uppercase",
							paddingTop: 40,
							textAlign: "center",
						}}
					>
						Participants
					</ThemedText>
					<UserSlider users={party.members} />
				</View>
			</View>
		</ScrollView>
	);
}
