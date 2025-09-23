import { useEffect, useMemo, useRef, useState } from "react";
import {
	FlatList,
	NativeScrollEvent,
	NativeSyntheticEvent,
	TouchableOpacity,
	View,
} from "react-native";

type CarouselProps<T> = {
	data: T[];
	renderItem: (
		item: T,
		index: number,
		isSelected: boolean,
	) => React.ReactNode;
	onItemChange?: (item: T, index: number) => void;
	itemWidth: number;
	itemSpacing?: number;
	initialIndex?: number;
	enableInfiniteScroll?: boolean;
	ItemSeparatorComponent?: React.ComponentType;
};

function ThemedCarousel<T>({
	data,
	renderItem,
	onItemChange,
	itemWidth,
	itemSpacing = 10,
	initialIndex = 0,
	enableInfiniteScroll = true,
	ItemSeparatorComponent,
}: CarouselProps<T>) {
	const baseData = useMemo(() => data, [data]);
	const loopedData = useMemo(
		() =>
			enableInfiniteScroll
				? [...baseData, ...baseData, ...baseData]
				: baseData,
		[baseData, enableInfiniteScroll],
	);

	const listRef = useRef<FlatList>(null);
	const [selectedIndex, setSelectedIndex] = useState(
		enableInfiniteScroll ? baseData.length + initialIndex : initialIndex,
	);

	const itemSize = itemWidth + itemSpacing;

	// Notifier le changement d'item sélectionné
	useEffect(() => {
		const actualIndex = enableInfiniteScroll
			? selectedIndex % baseData.length
			: selectedIndex;
		const selectedItem = baseData[actualIndex];
		if (onItemChange && selectedItem !== undefined) {
			onItemChange(selectedItem, actualIndex);
		}
	}, [selectedIndex, baseData, onItemChange, enableInfiniteScroll]);

	// Scroll initial au centre pour le mode infini
	useEffect(() => {
		if (listRef.current && enableInfiniteScroll) {
			setTimeout(() => {
				listRef.current?.scrollToIndex({
					index: baseData.length + initialIndex,
					animated: false,
				});
			}, 10);
		}
	}, [baseData.length, initialIndex, enableInfiniteScroll]);

	// Mettre à jour l'élément sélectionné basé sur le scroll
	const updateSelectedFromScroll = (offsetX: number) => {
		const currentIndex = Math.round(offsetX / itemSize);
		setSelectedIndex(currentIndex);
	};

	// Recentrer si trop proche du début ou de la fin (mode infini)
	const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetX = e.nativeEvent.contentOffset.x;
		const currentIndex = Math.round(offsetX / itemSize);

		updateSelectedFromScroll(offsetX);

		if (enableInfiniteScroll) {
			if (currentIndex < baseData.length / 2) {
				const newIndex = currentIndex + baseData.length;
				listRef.current?.scrollToIndex({
					index: newIndex,
					animated: false,
				});
				setSelectedIndex(newIndex);
			} else if (currentIndex > baseData.length * 2.5) {
				const newIndex = currentIndex - baseData.length;
				listRef.current?.scrollToIndex({
					index: newIndex,
					animated: false,
				});
				setSelectedIndex(newIndex);
			}
		}
	};

	// Gérer le scroll pendant le défilement
	const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetX = e.nativeEvent.contentOffset.x;
		updateSelectedFromScroll(offsetX);
	};

	// Gérer le press sur un item
	const handleItemPress = (index: number) => {
		listRef.current?.scrollToIndex({
			index: index,
			animated: true,
		});
	};

	const DefaultSeparator = () => <View style={{ width: itemSpacing }} />;

	return (
		<FlatList
			ref={listRef}
			data={loopedData}
			horizontal
			showsHorizontalScrollIndicator={false}
			snapToInterval={itemSize}
			decelerationRate="fast"
			keyExtractor={(item, index) => `carousel-item-${index}`}
			contentContainerStyle={{
				paddingHorizontal: 10,
				paddingVertical: 40,
				alignItems: "center",
			}}
			onScroll={handleScroll}
			onMomentumScrollEnd={handleScrollEnd}
			scrollEventThrottle={16}
			getItemLayout={(_, index) => ({
				length: itemSize,
				offset: itemSize * index,
				index,
			})}
			ItemSeparatorComponent={ItemSeparatorComponent || DefaultSeparator}
			renderItem={({ item, index }) => {
				const isSelected = index === selectedIndex;
				return (
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => handleItemPress(index)}
					>
						{renderItem(item, index, isSelected)}
					</TouchableOpacity>
				);
			}}
		/>
	);
}

export default ThemedCarousel;
