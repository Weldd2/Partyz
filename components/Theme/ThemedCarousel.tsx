import { useCallback, useEffect, useRef, useState } from "react";
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
	const listRef = useRef<FlatList>(null);
	const [selectedIndex, setSelectedIndex] = useState(initialIndex);

	const itemSize = itemWidth + itemSpacing;
	const dataLength = data.length;

	// Notifier le changement d'item sélectionné
	useEffect(() => {
		const selectedItem = data[selectedIndex];
		if (onItemChange && selectedItem !== undefined) {
			onItemChange(selectedItem, selectedIndex);
		}
	}, [selectedIndex, data, onItemChange]);

	// Scroll initial
	useEffect(() => {
		if (listRef.current && initialIndex > 0) {
			setTimeout(() => {
				listRef.current?.scrollToIndex({
					index: initialIndex,
					animated: false,
				});
			}, 100);
		}
	}, [initialIndex]);

	// Gérer le scroll pendant le défilement
	const handleScroll = useCallback(
		(e: NativeSyntheticEvent<NativeScrollEvent>) => {
			const offsetX = e.nativeEvent.contentOffset.x;
			const currentIndex = Math.round(offsetX / itemSize);
			const normalizedIndex =
				((currentIndex % dataLength) + dataLength) % dataLength;
			setSelectedIndex(normalizedIndex);
		},
		[itemSize, dataLength],
	);

	// Gérer la fin du scroll
	const handleScrollEnd = useCallback(
		(e: NativeSyntheticEvent<NativeScrollEvent>) => {
			const offsetX = e.nativeEvent.contentOffset.x;
			const currentIndex = Math.round(offsetX / itemSize);
			const normalizedIndex =
				((currentIndex % dataLength) + dataLength) % dataLength;
			setSelectedIndex(normalizedIndex);
		},
		[itemSize, dataLength],
	);

	// Gérer le press sur un item
	const handleItemPress = useCallback((index: number) => {
		listRef.current?.scrollToIndex({
			index: index,
			animated: true,
		});
		setSelectedIndex(index);
	}, []);

	const DefaultSeparator = useCallback(
		() => <View style={{ width: itemSpacing }} />,
		[itemSpacing],
	);

	const renderCarouselItem = useCallback(
		({ item, index }: { item: T; index: number }) => {
			const isSelected = index === selectedIndex;
			return (
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => handleItemPress(index)}
				>
					{renderItem(item, index, isSelected)}
				</TouchableOpacity>
			);
		},
		[selectedIndex, handleItemPress, renderItem],
	);

	const getItemLayout = useCallback(
		(_, index) => ({
			length: itemSize,
			offset: itemSize * index,
			index,
		}),
		[itemSize],
	);

	return (
		<FlatList
			ref={listRef}
			data={data}
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
			getItemLayout={getItemLayout}
			ItemSeparatorComponent={ItemSeparatorComponent || DefaultSeparator}
			renderItem={renderCarouselItem}
			removeClippedSubviews={true}
			maxToRenderPerBatch={5}
			windowSize={7}
		/>
	);
}

export default ThemedCarousel;
