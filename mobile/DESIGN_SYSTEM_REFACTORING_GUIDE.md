/**
 * MOBILE DESIGN SYSTEM REFACTORING GUIDE
 * 
 * This document explains the unified design system between web and mobile
 * and provides a pattern for translating Tailwind CSS to React Native styles.
 */

// ============================================================================
// 1. COLOR SYSTEM UNIFICATION
// ============================================================================

// Before (Outdated Mobile Colors):
// ustpDarkBlue: '#0A2540'
// ustpBlue: '#0052CC'
// ustpGold: '#FFB800'

// After (Unified with Web):
// ustpDarkBlue: '#0f2460'  ← From tailwind.config.js
// ustpBlue: '#1a3a8f'      ← From tailwind.config.js
// ustpGold: '#f0b429'      ← From tailwind.config.js

// This ensures the mobile app now has pixel-perfect color parity with web.


// ============================================================================
// 2. ROUTING SYNCHRONIZATION
// ============================================================================

// Web StudentLayout (5 main screens):
// ├─ Dashboard  (home icon)
// ├─ Subjects   (book icon)
// ├─ Schedule   (calendar icon)
// ├─ Finance    (wallet icon)
// └─ Profile    (user icon)

// Mobile StudentTabNavigator (now mirrors web):
// Uses React Navigation Bottom Tabs with the exact same 5 screens.
// Each screen uses Ionicons matching the web's semantic icons.

// IMPORTANT: The order in StudentTabNavigator.tsx defines the tab order
// Make sure to sync this whenever web routes change.


// ============================================================================
// 3. TAILWIND-TO-REACT-NATIVE TRANSLATION PATTERNS
// ============================================================================

// PATTERN 1: Card Design
// ─────────────────────────────────────────────────────────────────────────
// Web Tailwind:
// className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"

// React Native StyleSheet:
const cardStyle = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    // shadow (iOS):
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // elevation (Android):
    elevation: 1,
  }
});


// PATTERN 2: Grid / Flexbox Row
// ─────────────────────────────────────────────────────────────────────────
// Web Tailwind (grid with gap):
// className="grid grid-cols-1 sm:grid-cols-3 gap-4"

// React Native StyleSheet:
const gridStyle = StyleSheet.create({
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,  // gap between items
    marginBottom: 12,
  },
  gridItem: {
    flex: 1,  // equal width distribution
  }
});

// Usage:
// <View style={styles.gridRow}>
//   <View style={styles.gridItem}>Item 1</View>
//   <View style={styles.gridItem}>Item 2</View>
//   <View style={styles.gridItem}>Item 3</View>
// </View>


// PATTERN 3: Color & Status Mapping
// ─────────────────────────────────────────────────────────────────────────
// Web Tailwind:
// {enrollment_status === 'ENROLLED' && 'text-green-600 bg-green-100'}
// {enrollment_status === 'ASSESSED' && 'text-purple-600 bg-purple-100'}

// React Native:
const getStatusStyle = (status) => {
  switch (status) {
    case 'ENROLLED':
      return { bg: COLORS.emeraldBg, text: COLORS.emerald };
    case 'ASSESSED':
      return { bg: COLORS.purpleBg, text: COLORS.purple };
    case 'PAID':
      return { bg: COLORS.purpleBg, text: COLORS.purple };
    default:
      return { bg: COLORS.ustpGoldLight, text: COLORS.ustpGold };
  }
};

const statusStyle = getStatusStyle(profile.enrollment_status);
// <View style={{ backgroundColor: statusStyle.bg }}>
//   <Text style={{ color: statusStyle.text }}>status</Text>
// </View>


// PATTERN 4: Typography & Font Sizes
// ─────────────────────────────────────────────────────────────────────────
// Web Tailwind:
// className="text-sm font-bold"      → fontSize: 14, fontWeight: '700'
// className="text-xs font-semibold"  → fontSize: 12, fontWeight: '600'
// className="text-base font-black"   → fontSize: 16, fontWeight: '900'

// Common sizes in mobile:
const fontSizes = {
  xs: 10,      // Secondary labels, captions
  sm: 11,      // Regular labels, secondary text
  base: 12,    // Body text
  lg: 14,      // Subheadings
  xl: 16,      // Main headings
  '2xl': 18,   // Large headings
  '3xl': 20,   // Page titles
};

const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};


// PATTERN 5: Spacing & Padding
// ─────────────────────────────────────────────────────────────────────────
// Web Tailwind: p-4 p-5 p-6
// React Native: padding: 16, 20, 24

// Common spacing scale:
const spacing = {
  1: 4,    // p-1
  2: 8,    // p-2
  3: 12,   // p-3
  4: 16,   // p-4
  5: 20,   // p-5
  6: 24,   // p-6
  8: 32,   // p-8
  10: 40,  // p-10
};


// ============================================================================
// 4. BUILDING NEW MOBILE SCREENS - CHECKLIST
// ============================================================================

// When refactoring a web page to mobile:

// ✓ Step 1: Update imports
//   Import { COLORS } from '../../constants/colors'
//   Import { AuthContext } from '../../context/AuthContext'
//   Import api from '../../api/axiosSetup'

// ✓ Step 2: Define interfaces for API responses
//   Match the backend schema (StudentProfile, Assessment, etc.)

// ✓ Step 3: Set up state with useContext + useState
//   const { user } = useContext(AuthContext)
//   const [data, setData] = useState(...)
//   const [loading, setLoading] = useState(true)

// ✓ Step 4: Fetch data in useEffect
//   Parallel API calls with Promise.all([...])
//   Filter/map/calculate derived state
//   Set loading: false when done

// ✓ Step 5: Build StyleSheet with card/grid patterns
//   Container: flex: 1, backgroundColor: COLORS.g50
//   Cards: white bg, rounded 12, border 1px, padding 14-16
//   Text: use COLORS.textMain / COLORS.textMuted

// ✓ Step 6: Render with ScrollView + RefreshControl
//   <ScrollView style={styles.scroll} refreshControl={...}>
//   Map data arrays with proper key props

// ✓ Step 7: Add empty state & error handling
//   "No items found" message when data array is empty
//   Loading spinner during fetch
//   Error logging with console.error


// ============================================================================
// 5. RESPONSIVE DESIGN (Mobile-First)
// ============================================================================

// React Native is inherently responsive (no media queries needed!):
// - On small devices: single-column layouts (flex: 1)
// - On tablets: multi-column layouts (flexDirection: 'row', flex: 1)

// For adaptive layouts, detect screen width:
import { useWindowDimensions } from 'react-native';

function MyScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  
  return (
    <View style={{
      flexDirection: isTablet ? 'row' : 'column',
      justifyContent: 'space-between',
    }}>
      {/* Columns auto-arrange based on device */}
    </View>
  );
}


// ============================================================================
// 6. COMMON COMPONENTS TO CREATE
// ============================================================================

// After StudentDashboardScreen is complete, create reusable components:

// ✓ StatCard.tsx
//   Displays label, value, subtitle
//   Prop: textColor, bgColor, value, label, sub
//   Used in: Dashboard, Finance, etc.

// ✓ HeaderBar.tsx
//   Top section with greeting + metadata
//   Prop: greeting, subtitle

// ✓ WelcomeBanner.tsx
//   Large banner with title + description
//   Prop: title, description, bgColor

// ✓ DataTable.tsx
//   Render rows of data with proper spacing
//   Prop: data, columns, renderRow

// Check the pattern in StudentDashboardScreen.tsx for reference!


// ============================================================================
// 7. TESTING THE REFACTORED UI
// ============================================================================

// To verify mobile matches web:

// 1. Side-by-side comparison
//    - Open web in browser
//    - Run mobile app in simulator
//    - Compare colors, spacing, layouts

// 2. Check all 5 tabs work
//    - Dashboard ✓
//    - Finance (verify API endpoints)
//    - Schedule (verify data fetching)
//    - Subjects (verify grid layout)
//    - Profile (verify user data display)

// 3. Verify styling matches COLORS
//    - Use color picker to confirm hex values
//    - Ensure all text uses COLORS.textMain / textMuted
//    - Check borders use COLORS.border

// 4. Test pull-to-refresh
//    - Drag down from top to trigger onRefresh
//    - Verify data reloads correctly

// 5. Test on actual devices
//    - iPhone (iOS) for shadow/elevation rendering
//    - Android phone for font rendering


// ============================================================================
// REFERENCE FILES
// ============================================================================

// Updated Files:
// 1. mobile/src/constants/colors.ts
//    ✓ Unified with web tailwind.config.js colors
//    ✓ All hex codes now match web exactly

// 2. mobile/src/navigation/StudentTabNavigator.tsx
//    ✓ Migrated from custom state to React Navigation Bottom Tabs
//    ✓ Proper styling with ustpDarkBlue active tint
//    ✓ 5 screens: Dashboard, Finance, Schedule, Subjects, Profile

// 3. mobile/src/screens/student/StudentDashboardScreen.tsx
//    ✓ Complete refactor mirroring web StudentDashboardPage.tsx
//    ✓ Proper API data fetching with TypeScript interfaces
//    ✓ Card-based layout using unified design system
//    ✓ Pull-to-refresh functionality
//    ✓ Empty state & loading indicators

// Follow these patterns when refactoring remaining screens:
// - StudentFinanceScreen.tsx
// - StudentScheduleScreen.tsx
// - StudentSubjectsScreen.tsx
// - StudentProfileScreen.tsx
