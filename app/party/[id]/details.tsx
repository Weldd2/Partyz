import Calendar from "@/components/Calendar";
import Map from "@/components/Map";
import PartyCard from "@/components/PartyCard";
import SliderButton from "@/components/Theme/SliderButton";
import SliderButtons from "@/components/Theme/SliderButtons";
import ThemedText from "@/components/Theme/ThemedText";
import UserSlider from "@/components/UserSlider";
import partiesFixture from "@/fixtures/parties";
import useThemeColors from "@/hooks/useThemeColors";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

const party = partiesFixture.member[0];

export default function Detail() {
	const colors = useThemeColors();
	const { id } = useLocalSearchParams();
	const [activeView, setActiveView] = useState("carte");

	return (
		<ScrollView>
			<View style={{ position: "relative" }}>
				<View
					style={{
						position: "absolute",
						backgroundColor: colors.primary,
						height: "500%",
						width: "100%",
						right: 0,
						bottom: "50%",
					}}
				/>
				<View style={{ padding: 10 }}>
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
					{activeView === "carte" ? <Map /> : <Calendar />}
				</View>
				<View>
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
