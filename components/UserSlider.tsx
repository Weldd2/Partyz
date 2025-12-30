import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { UserInterface } from "@/types/UserInterface";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import ThemedCarousel from "./Theme/ThemedCarousel";
import ThemedText from "./Theme/ThemedText";

type Props = {
	users: UserInterface[];
};

const fixturesPictures = [
	"https://placehold.co/600x400",
	"https://placehold.co/600x400",
	"https://placehold.co/600x400",
	"https://placehold.co/600x400",
	"https://placehold.co/600x400",
];

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const SLIDE_WIDTH = 162;
const SLIDE_HEIGHT = SLIDE_WIDTH * (16 / 9);

const UserSlider = memo(({ users }: Props) => {
	const colors = useThemeColors();
	const styles = useMemo(() => getStyles(colors), [colors]);

	const renderUser = useCallback(
		(item: UserInterface, _index: number, isSelected: boolean) => {
			const imageIndex = _index % fixturesPictures.length;

			return (
				<View style={styles.slide}>
					<Image
						source={fixturesPictures[imageIndex]}
						placeholder={{ blurhash }}
						style={{
							width: SLIDE_WIDTH,
							height: SLIDE_HEIGHT,
						}}
						transition={300}
						contentFit="cover"
						cachePolicy="memory-disk"
					/>
					<LinearGradient
						colors={["transparent", "#000000CC"]}
						locations={[0.8, 1]}
						style={styles.shadowLayer}
					/>
					<ThemedText color="white" style={styles.textLayer}>
						{item.firstname}
					</ThemedText>
				</View>
			);
		},
		[styles],
	);

	return (
		<ThemedCarousel
			data={users}
			renderItem={renderUser}
			itemWidth={SLIDE_WIDTH}
			itemSpacing={10}
			initialIndex={0}
			enableInfiniteScroll={false}
		/>
	);
});

UserSlider.displayName = "UserSlider";

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		slide: {
			backgroundColor: colors.primary,
			borderWidth: 1,
			borderColor: colors.primary,
			borderRadius: 8,
			shadowColor: colors.primary,
			shadowOffset: { width: 1, height: 1 },
			shadowOpacity: 1,
			shadowRadius: 0,
			overflow: "hidden",
			position: "relative",
		},
		shadowLayer: {
			position: "absolute",
			bottom: 0,
			height: "100%",
			width: "100%",
		},
		textLayer: {
			position: "absolute",
			bottom: 10,
			left: 10,
			fontSize: 18,
			fontFamily: "HossRound-Medium",
		},
	});

export default UserSlider;
