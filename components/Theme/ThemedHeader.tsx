import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.primary,
			height: 110,
			justifyContent: "flex-end",
			alignItems: "center",
			position: "relative",
		},
		menuButton: {
			position: "absolute",
			right: 20,
			bottom: 20,
			padding: 8,
		},
		modalOverlay: {
			flex: 1,
			backgroundColor: "transparent",
		},
		menuContainer: {
			position: "absolute",
			top: 100,
			right: 10,
			backgroundColor: colors.white,
			borderRadius: 8,
			borderWidth: 2,
			borderColor: colors.primary,
			minWidth: 200,
			shadowColor: colors.primary,
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.3,
			shadowRadius: 4,
			elevation: 5,
		},
		menuItem: {
			flexDirection: "row",
			alignItems: "center",
			padding: 16,
			gap: 12,
			borderBottomWidth: 1,
			borderBottomColor: colors.background,
		},
		menuItemLast: {
			borderBottomWidth: 0,
		},
		menuItemDanger: {
			backgroundColor: colors.background,
		},
	});

type MenuItem = {
	label: string;
	icon: string;
	onPress: () => void;
	danger?: boolean;
};

type Props = {
	title: string;
	menuItems?: MenuItem[];
};

export default function ThemedHeader({ title, menuItems }: Props) {
	const colors = useThemeColors();
	const styles = getStyles(colors);
	const [menuVisible, setMenuVisible] = useState(false);

	const handleMenuItemPress = (onPress: () => void) => {
		setMenuVisible(false);
		// Small delay to ensure menu closes before action
		setTimeout(onPress, 100);
	};

	return (
		<View style={styles.container}>
			<ThemedText
				variant="h1"
				color="white"
				style={{
					paddingBottom: 20,
					textTransform: "uppercase",
				}}
			>
				{title}
			</ThemedText>
			{menuItems && menuItems.length > 0 && (
				<>
					<Pressable
						style={styles.menuButton}
						onPress={() => setMenuVisible(true)}
					>
						<FontAwesome
							name="ellipsis-v"
							size={24}
							color={colors.white}
						/>
					</Pressable>

					<Modal
						visible={menuVisible}
						transparent
						animationType="fade"
						onRequestClose={() => setMenuVisible(false)}
					>
						<Pressable
							style={styles.modalOverlay}
							onPress={() => setMenuVisible(false)}
						>
							<View style={styles.menuContainer}>
								{menuItems.map((item, index) => (
									<Pressable
										key={index}
										style={[
											styles.menuItem,
											index === menuItems.length - 1 &&
												styles.menuItemLast,
											item.danger && styles.menuItemDanger,
										]}
										onPress={() =>
											handleMenuItemPress(item.onPress)
										}
									>
										<FontAwesome
											name={item.icon as any}
											size={20}
											color={
												item.danger
													? colors.red
													: colors.primary
											}
										/>
										<ThemedText
											style={{
												fontSize: 16,
												color: item.danger
													? colors.red
													: colors.paragraph,
											}}
										>
											{item.label}
										</ThemedText>
									</Pressable>
								))}
							</View>
						</Pressable>
					</Modal>
				</>
			)}
		</View>
	);
}
