import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { ShoppingListInterface } from "@/types/ShoppingListItem";
import { useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ThemedText from "./Theme/ThemedText";

type Props = {
	data: Array<ShoppingListInterface>;
};

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.white,
			borderWidth: 1,
			borderColor: colors.primary,
			borderRadius: 8,
			shadowColor: colors.primary,
			shadowOffset: { width: 1, height: 1 },
			shadowOpacity: 1,
			shadowRadius: 0,
			paddingVertical: 15,
			paddingHorizontal: 10,
		},
	});

export default function ShoppingListSummary({ data }: Props) {
	const colors = useThemeColors();
	const styles = getStyles(colors);
	const flatListRef = useRef<FlatList>(null);
	return (
		<View style={styles.container}>
			<ThemedText style={{ marginBottom: 10 }} variant="disabled">
				Je ramène :
			</ThemedText>
			<FlatList
				ref={flatListRef}
				data={data.slice(0, 4)}
				renderItem={(item) => (
					<View style={{ flexDirection: "row" }}>
						<ThemedText style={{ flex: 1, fontSize: 16 }}>
							{item.item.name}
						</ThemedText>
						<ThemedText
							style={{
								fontFamily: "HossRound-Bold",
								fontSize: 16,
							}}
						>
							x{item.item.quantity}
						</ThemedText>
					</View>
				)}
				scrollEnabled={false}
				ItemSeparatorComponent={() => (
					<View style={{ height: 10 }}></View>
				)}
				keyExtractor={(item) => `shopping-list-item-${item.id}`}
			/>
		</View>
	);
}
