# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Partyz is a React Native mobile application built with Expo and Expo Router for organizing and managing parties. The app allows users to view parties, manage details, chat, and share photos in galleries.

It means to be an event chat application. The goal is to be the best app to organize little events (less than 30 people). ex : birthday party, movie night with friends, pique-nique with family, etc. The mains rivals are snapchat, whatsapp, messenger (the groups app used for chatting with family / friends).

The following are the main screens of the app :
- browsing parties screen
	- detail screen for the party (like an event app)
	- chat screen (like a chat app)
	- gallery screen for souvenirs

but some other screens are planned :
- shopping list screen
- invitation to the party
- party preview BEFORE joining it (just the detail screen)
- login
- signin
- contacts of user
- forms (crud party, shopping list item)

## Tech Stack

- **Framework**: React Native with Expo (~54.0.6)
- **Navigation**: Expo Router (file-based routing) with Material Top Tabs
- **Language**: TypeScript (strict mode enabled)
- **React**: v19.1.0
- **Animations**: react-native-reanimated, react-native-worklets
- **Styling**: React Native StyleSheet with custom theme system

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Platform-specific starts
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser

# Code quality
npm run lint       # Run ESLint
npm run format     # Format with Prettier

# Reset project (moves starter code to app-example/)
npm run reset-project
```

## Project Structure

### Routing Architecture

The app uses Expo Router's file-based routing system:

- `app/_layout.tsx` - Root layout with custom font loading (HossRound family)
- `app/index.tsx` - Home screen showing list of parties with date filter
- `app/party/[id]/_layout.tsx` - Dynamic party detail layout with Material Top Tabs (Details, Chat, Gallery)
- `app/party/[id]/details.tsx` - Party details screen
- `app/party/[id]/chat.tsx` - Party chat screen
- `app/party/[id]/gallery.tsx` - Party photo gallery screen

Navigation pattern: Main list → `/party/${id}/details` (with tabs for chat and gallery)

### Theme System

The app has a custom theming system:

- `constants/colors.ts` - Color definitions (light/dark themes, currently identical)
- `constants/theme.ts` - Platform-specific font configurations
- `hooks/useThemeColors.ts` - Hook to access current theme colors
- `components/Theme/` - Themed UI components (Button, Text, Header, Input, Carousel, etc.)

**Color palette**: Primary (#152D1D), Secondary (#F591BD), Third (#FFBB23), Background (#F4F0E4)

### Component Organization

- `components/` - Reusable components (Calendar, Map, DateSlider, PartyCard, UserSlider, ImageModal, ShoppingListSummary)
- `components/Theme/` - Theme-aware UI primitives and styled components
- `types/` - TypeScript interfaces (ApiInterface, PartyInterface, UserInterface, ShoppingListItem)
- `fixtures/` - Mock data (parties.ts with sample party data)
- `hooks/` - Custom React hooks

### Data Structure

Core type is `PartyInterface`:
- Extends `ApiInterface` (JSON-LD format with @id, @type)
- Properties: id, title, address, date, members[], shoppingList[], owner
- Members are `UserInterface` objects
- Shopping list uses `ShoppingListInterface`

Fixture data follows API Platform JSON-LD convention (ApiCollectionInterface wrapper).

## Key Features & Patterns

### Custom Fonts

The app uses HossRound font family loaded in root layout:
- HossRound (Medium)
- HossRound-Light
- HossRound-Regular
- HossRound-Bold
- HossRound-Heavy
- HossRound-Black
- HossRound-Ultra

Fonts must be loaded before rendering (conditional return if not loaded).

### Styling Pattern

Components use a `getStyles(colors)` factory pattern:
```typescript
const getStyles = (colors: typeof Colors.light) => StyleSheet.create({...});
```

Then instantiate styles with current theme: `const styles = useMemo(() => getStyles(colors), [colors]);`

### Path Aliases

TypeScript configured with `@/*` alias mapping to root directory (tsconfig.json).

### Performance Optimizations

FlatList components use:
- `removeClippedSubviews={true}`
- `maxToRenderPerBatch={10}`
- `windowSize={10}`

Components wrapped in `memo()` where appropriate.

### Expo Configuration

- New Architecture enabled (`newArchEnabled: true`)
- Typed routes enabled (`typedRoutes: true`)
- React Compiler enabled (`reactCompiler: true`)
- Edge-to-edge enabled on Android
- Custom splash screen with light/dark variants

## Common Development Patterns

When adding new screens:
1. Create file in `app/` directory following Expo Router conventions
2. Add screen to Stack in `_layout.tsx` with custom ThemedHeader
3. Use `useThemeColors()` hook for consistent theming
4. Follow the `getStyles(colors)` pattern for dynamic styling

When creating components:
1. Place in `components/` (or `components/Theme/` if theme-aware primitive)
2. Define TypeScript interfaces in `types/`
3. Use `memo()` for performance where beneficial
4. Import types from `@/types/`
5. Use theme colors via `useThemeColors()` hook

## Notes

- Currently using fixture data (`fixtures/parties.ts`) - API integration appears to be planned (API Platform JSON-LD format)
- Dark theme defined but currently identical to light theme
- French language UI ("Mes parties", "Ma party", "Détails", "Galerie")
