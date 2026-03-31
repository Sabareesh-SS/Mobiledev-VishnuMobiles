import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  SafeAreaView,
} from 'react-native';

// ─── Mock data ────────────────────────────────────────────────────────────────
const PRODUCT = {
  name: 'Pixel 8 Pro',
  sku: 'GOOG-P8P-256-OBS',
  price: 999.0,
  currency: '₹',
  status: 'AVAILABLE NOW',
  currentInventory: 12,
  colors: ['Obsidian Black', 'Porcelain White', 'Bay Blue'],
  storageOptions: ['128 GB', '256 GB', '512 GB'],
  // Replace with a real local asset or a hosted URL
  image: {
    uri: 'https://lh3.googleusercontent.com/a2Vy82xEHFicVYqPlrTJMBKv2bYJPbsmIH-4kv7qcWScJvFjq3GUJo9ZCJX8B8xyfrQ=w526-h526',
  },
};

// ─── Cart context (simple local state) ────────────────────────────────────────
export default function ProductDetailScreen({navigation}) {
  const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(PRODUCT.storageOptions[1]);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(3); // matches screenshot badge

  const formatPrice = value =>
    `${PRODUCT.currency}${value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
    })}`;

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleIncrement = () => {
    if (quantity < PRODUCT.currentInventory) {
      setQuantity(q => q + 1);
    } else {
      Alert.alert('Stock Limit', `Only ${PRODUCT.currentInventory} units available.`);
    }
  };

  const handleAddToTransaction = () => {
    setCartCount(c => c + quantity);
    Alert.alert(
      'Added to Transaction',
      `${quantity} × ${PRODUCT.name} (${selectedStorage}, ${selectedColor}) added.\nTotal: ${formatPrice(
        PRODUCT.price * quantity,
      )}`,
      [{text: 'OK'}],
    );
  };

  const handleBack = () => {
    // Replace with your actual navigation call, e.g. navigation?.goBack()
    Alert.alert('Navigate', 'Going back to POS…');
  };

  const handleCart = () => {
    Alert.alert('Cart', `You have ${cartCount} item(s) in the transaction.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>🛒</Text>
          </View>
          <Text style={styles.shopName}>Vishnu Mobile Shop</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={handleCart} activeOpacity={0.75}>
          <Text style={styles.cartIcon}>🛍️</Text>
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Back link ── */}
      <TouchableOpacity style={styles.backRow} onPress={handleBack} activeOpacity={0.7}>
        <Text style={styles.backChevron}>‹</Text>
        <Text style={styles.backLabel}>BACK TO POS</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {/* ── Product Image Card ── */}
        <View style={styles.imageCard}>
          <Image
            source={PRODUCT.image}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* ── Status Pill ── */}
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{PRODUCT.status}</Text>
        </View>

        {/* ── Name & Price ── */}
        <View style={styles.titleRow}>
          <Text style={styles.productName}>{PRODUCT.name}</Text>
          <Text style={styles.productPrice}>{formatPrice(PRODUCT.price)}</Text>
        </View>

        {/* ── SKU ── */}
        <Text style={styles.sku}>SKU: {PRODUCT.sku}</Text>

        <View style={styles.divider} />

        {/* ── Color Selector ── */}
        <Text style={styles.sectionLabel}>COLOR</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionRow}>
          {PRODUCT.colors.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.optionChip,
                selectedColor === color && styles.optionChipActive,
              ]}
              onPress={() => setSelectedColor(color)}
              activeOpacity={0.75}>
              <Text
                style={[
                  styles.optionChipText,
                  selectedColor === color && styles.optionChipTextActive,
                ]}>
                {color}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Storage Selector ── */}
        <Text style={[styles.sectionLabel, {marginTop: 16}]}>STORAGE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionRow}>
          {PRODUCT.storageOptions.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.optionChip,
                selectedStorage === opt && styles.optionChipActive,
              ]}
              onPress={() => setSelectedStorage(opt)}
              activeOpacity={0.75}>
              <Text
                style={[
                  styles.optionChipText,
                  selectedStorage === opt && styles.optionChipTextActive,
                ]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        {/* ── Quantity Selector ── */}
        <Text style={styles.sectionLabel}>SELECT QUANTITY</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
            onPress={handleDecrement}
            activeOpacity={0.75}
            disabled={quantity <= 1}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>

          <View style={styles.qtyDisplay}>
            <Text style={styles.qtyValue}>{quantity}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.qtyBtn,
              quantity >= PRODUCT.currentInventory && styles.qtyBtnDisabled,
            ]}
            onPress={handleIncrement}
            activeOpacity={0.75}
            disabled={quantity >= PRODUCT.currentInventory}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* ── Add to Transaction ── */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddToTransaction}
          activeOpacity={0.85}>
          <Text style={styles.addBtnIcon}>🛒</Text>
          <Text style={styles.addBtnText}>ADD TO TRANSACTION</Text>
        </TouchableOpacity>

        {/* ── Inventory Footer ── */}
        <View style={styles.inventoryRow}>
          <Text style={styles.inventoryLabel}>Current Inventory</Text>
          <View style={styles.inventoryBadge}>
            <Text style={styles.inventoryValue}>{PRODUCT.currentInventory}</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#2B3FD4',       // deep indigo — header & accents
  primaryLight: '#EEF0FD',  // tint for chips
  accent: '#FF6B35',        // price orange
  success: '#1EB97B',       // available dot
  bg: '#F4F5FB',
  card: '#FFFFFF',
  text: '#0D1136',
  textMuted: '#7A7F9A',
  border: '#E4E6F0',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // ── Header ──────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {fontSize: 18},
  shopName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cartBtn: {
    position: 'relative',
    padding: 4,
  },
  cartIcon: {fontSize: 24},
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },

  // ── Back ────────────────────────────────────────
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backChevron: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: '300',
    marginRight: 4,
    lineHeight: 24,
  },
  backLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.8,
  },

  // ── Scroll content ──────────────────────────────
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // ── Image card ──────────────────────────────────
  imageCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 180,
    height: 200,
  },

  // ── Status ──────────────────────────────────────
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E6F9F2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 10,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
    letterSpacing: 0.6,
  },

  // ── Title row ───────────────────────────────────
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.accent,
    marginTop: 4,
  },
  sku: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  // ── Divider ─────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },

  // ── Option chips ────────────────────────────────
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
  },
  optionChip: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: COLORS.card,
  },
  optionChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  optionChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  optionChipTextActive: {
    color: COLORS.primary,
  },

  // ── Quantity ────────────────────────────────────
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  qtyBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: {
    opacity: 0.35,
  },
  qtyBtnText: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: '300',
    lineHeight: 26,
  },
  qtyDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  qtyValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },

  // ── Add to Transaction ──────────────────────────
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  addBtnIcon: {fontSize: 18},
  addBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // ── Inventory footer ────────────────────────────
  inventoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inventoryLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  inventoryBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  inventoryValue: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 14,
  },
});