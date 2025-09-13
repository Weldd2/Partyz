import ThemedTextInput from "@/components/Theme/Input/ThemedTextInput";
import ThemedButton from "@/components/Theme/ThemedButton";
import ThemedText from "@/components/Theme/ThemedText";
import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { ShoppingListInterface } from "@/types/ShoppingListItem";
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		contentContainer: {
			paddingHorizontal: 20,
			paddingBottom: 20,
		},
		header: {
			marginBottom: 20,
		},
		form: {
			gap: 16,
		},
		buttons: {
			gap: 12,
			marginTop: 20,
		},
		handle: {
			backgroundColor: colors.paragraphDisabled,
			width: 40,
			height: 4,
			borderRadius: 2,
			alignSelf: "center",
			marginTop: 8,
			marginBottom: 16,
		},
	});

type Props = {
	item: ShoppingListInterface | null;
	onSave: (item: Partial<ShoppingListInterface>) => void;
	onCancel: () => void;
};

const ShoppingListItemBottomSheet = forwardRef<BottomSheet, Props>(
	({ item, onSave, onCancel }, ref) => {
		const colors = useThemeColors();
		const styles = getStyles(colors);

		const [name, setName] = useState("");
		const [quantity, setQuantity] = useState("");
		const [errors, setErrors] = useState({
			name: "",
			quantity: "",
		});

		useEffect(() => {
			if (item) {
				setName(item.name);
				setQuantity(item.quantity.toString());
			} else {
				setName("");
				setQuantity("");
			}
			setErrors({ name: "", quantity: "" });
		}, [item]);

		const validate = () => {
			const newErrors = {
				name: "",
				quantity: "",
			};

			if (!name.trim()) {
				newErrors.name = "Le nom est requis";
			}

			const quantityNum = parseInt(quantity, 10);
			if (!quantity || isNaN(quantityNum) || quantityNum < 1) {
				newErrors.quantity = "La quantité doit être au moins 1";
			}

			setErrors(newErrors);
			return !newErrors.name && !newErrors.quantity;
		};

		const handleSave = () => {
			if (!validate()) return;

			Keyboard.dismiss();
			const updatedItem: Partial<ShoppingListInterface> = {
				...(item?.id && { id: item.id }),
				name: name.trim(),
				quantity: parseInt(quantity, 10),
				broughtQuantity: item?.broughtQuantity || 0,
			};

			onSave(updatedItem);
		};

		const handleCancel = () => {
			Keyboard.dismiss();
			setName("");
			setQuantity("");
			setErrors({ name: "", quantity: "" });
			onCancel();
		};

		const renderBackdrop = useCallback(
			(props: any) => (
				<BottomSheetBackdrop
					{...props}
					disappearsOnIndex={-1}
					appearsOnIndex={0}
					opacity={0.5}
					pressBehavior="close"
				/>
			),
			[],
		);

		return (
			<BottomSheet
				ref={ref}
				index={-1}
				snapPoints={["50%", "75%"]}
				enablePanDownToClose
				onClose={handleCancel}
				backdropComponent={renderBackdrop}
				backgroundStyle={{
					backgroundColor: colors.white,
				}}
				handleIndicatorStyle={{
					backgroundColor: colors.paragraphDisabled,
				}}
				keyboardBehavior="extend"
				keyboardBlurBehavior="restore"
			>
				<BottomSheetView style={styles.contentContainer}>
					<View style={styles.header}>
						<ThemedText variant="h2">
							{item ? "Modifier l'article" : "Nouvel article"}
						</ThemedText>
					</View>

					<View style={styles.form}>
						<ThemedTextInput
							label="Nom de l'article"
							placeholder="Ex: Pain, Boissons..."
							value={name}
							onChangeText={(text) => {
								setName(text);
								setErrors({ ...errors, name: "" });
							}}
							error={errors.name}
							useBottomSheetInput={true}
							autoFocus
						/>

						<ThemedTextInput
							label="Quantité cible"
							placeholder="Ex: 5"
							value={quantity}
							onChangeText={(text) => {
								setQuantity(text);
								setErrors({ ...errors, quantity: "" });
							}}
							error={errors.quantity}
							useBottomSheetInput={true}
							keyboardType="number-pad"
						/>
					</View>

					<View style={styles.buttons}>
						<ThemedButton text="Enregistrer" onPress={handleSave} />
						<ThemedButton
							text="Annuler"
							variant="primary2"
							onPress={handleCancel}
						/>
					</View>
				</BottomSheetView>
			</BottomSheet>
		);
	},
);

ShoppingListItemBottomSheet.displayName = "ShoppingListItemBottomSheet";

export default ShoppingListItemBottomSheet;
