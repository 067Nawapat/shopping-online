import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  Animated,
  PanResponder,
  DeviceEventEmitter,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../api/apiService';
import ConfirmModal from '../components/ConfirmModal';
import styles from '../styles/ProductDetailScreen.styles';

const formatPrice = (value) => `฿ ${Math.round(Number(value) || 0).toLocaleString()}`;

const formatCompactPrice = (value) => `฿${Math.round(Number(value) || 0).toLocaleString()}`;

const formatReviewDate = (dateString) => {
  if (!dateString) return 'ล่าสุด';

  const created = new Date(dateString);
  if (Number.isNaN(created.getTime())) return 'ล่าสุด';

  const diff = Date.now() - created.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));

  if (days === 0) return 'วันนี้';
  if (days === 1) return '1 วันที่ผ่านมา';
  if (days < 30) return `${days} วันที่ผ่านมา`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} เดือนที่ผ่านมา`;

  const years = Math.floor(months / 12);
  return `${years} ปีที่ผ่านมา`;
};

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [confirmAction, setConfirmAction] = useState('buy');
  const [reviewExpanded, setReviewExpanded] = useState(true);
  const [detailExpanded, setDetailExpanded] = useState(true);
  const [shippingExpanded, setShippingExpanded] = useState(false);
  const [recentSalesExpanded, setRecentSalesExpanded] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);

  const showModal = (title, message, onConfirm = null, confirmText = 'ตกลง') => {
    setModalConfig({ title, message, onConfirm, confirmText });
  };

  const closeInfoModal = () => {
    setModalConfig(null);
  };

  // Swipe to close logic
  const panY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to downward swipes
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          closeModal();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const closeModal = () => {
    Animated.timing(panY, {
      toValue: 1000,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSizeModalVisible(false);
      panY.setValue(0);
    });
  };

  useEffect(() => {
    loadFullDetail();
  }, [productId]);

  const loadFullDetail = async () => {
    setLoading(true);
    try {
      const response = await apiService.getProductDetail(productId);
      setProduct(response);
      setSelectedImage(0);
      setSelectedVariant(null);
      setSelectedColor(response?.variants?.find((item) => item.color)?.color || null);

      if (response?.category_id) {
        const categoryProducts = await apiService.getProducts(response.category_id, 1);
        setRelatedProducts((categoryProducts || []).filter((item) => item.id !== response.id).slice(0, 6));
      } else {
        const allProducts = await apiService.getProducts();
        setRelatedProducts((allProducts || []).filter((item) => item.id !== response?.id).slice(0, 6));
      }
    } catch (error) {
      showModal('Error', 'ไม่สามารถโหลดข้อมูลสินค้าได้');
      setRelatedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    if (action === "cart") {
      setConfirmAction("cart");
    } else {
      setConfirmAction("buy");
    }
    panY.setValue(0);
    setSizeModalVisible(true);
  };

  const handleConfirm = async () => {
    if (!selectedVariant) {
      showModal('แจ้งเตือน', 'กรุณาเลือกไซส์');
      return;
    }

    const user = await apiService.getUser();
    if (!user) {
      setSizeModalVisible(false);
      navigation.navigate('Auth');
      return;
    }

    if (confirmAction === "cart") {
      try {
        const res = await apiService.addToCart({
          user_id: user.id,
          variant_id: selectedVariant.id,
          quantity: 1
        });
        if (res.status === "success") {
          DeviceEventEmitter.emit('cartUpdated');
          setSizeModalVisible(false);
          showModal("สำเร็จ", "เพิ่มสินค้าไปยังตะกร้าแล้ว");
        }
      } catch (error) {
        showModal("Error", "ไม่สามารถเพิ่มลงตะกร้าได้");
      }
    }

    if (confirmAction === "buy") {
      setSizeModalVisible(false);
      navigation.navigate("PaymentMethods", {
        product,
        variant: selectedVariant
      });
    }
  };

  const images = useMemo(() => {
    if (!product) return [];
    if (product.images?.length) return product.images;
    return product.image ? [product.image] : [];
  }, [product]);

  const variants = useMemo(() => {
    return [...(product?.variants || [])].sort((a, b) => {
      const aValue = parseFloat(String(a.size).replace(/[^\d.]/g, '')) || 0;
      const bValue = parseFloat(String(b.size).replace(/[^\d.]/g, '')) || 0;
      return aValue - bValue;
    });
  }, [product]);

  const colorOptions = useMemo(() => {
    return [...new Set(variants.map((item) => item.color).filter(Boolean))];
  }, [variants]);

  const filteredVariants = useMemo(() => {
    if (!selectedColor) {
      return variants;
    }
    return variants.filter((item) => item.color === selectedColor);
  }, [selectedColor, variants]);

  const reviews = product?.reviews || [];
  const highlightedReview = reviews[0];
  const reviewPreview = reviews.slice(0, 2);
  const allReviewPhotos = useMemo(() => reviews.flatMap((review) => review.photos || []).slice(0, 3), [reviews]);

  const ratingValue = Number(product?.avg_rating || 0);
  const totalReviews = Number(product?.total_reviews || reviews.length || 0);

  const priceSummary = useMemo(() => {
    const prices = variants.map((item) => Number(item.price)).filter(Boolean);
    const basePrice = Number(product?.price || 0);

    if (!prices.length) {
      return {
        starting: basePrice,
        highestBid: basePrice,
        latestSale: basePrice,
      };
    }

    return {
      starting: Math.min(...prices),
      highestBid: Math.max(...prices),
      latestSale: basePrice || prices[0],
    };
  }, [product, variants]);

  const fitSummary = useMemo(() => {
    return [
      { label: 'เล็กกว่าปกติ', percent: 2 },
      { label: 'ตรงไซส์', percent: 97 },
      { label: 'ใหญ่กว่าปกติ', percent: 1 },
    ];
  }, []);

  const heroImage = images[selectedImage] || product?.image;

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#111" />
      </View>
    );
  }

  if (!product) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={30} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social-outline" size={29} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={28} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.installmentChip} activeOpacity={0.9}>
          <Ionicons name="card-outline" size={18} color="#4A72B8" />
          <Text style={styles.installmentChipText}>ผ่อนชำระ</Text>
        </TouchableOpacity>

        <View style={styles.heroSection}>
          <Image source={{ uri: heroImage }} style={styles.mainImage} />
          <View style={styles.paginationDots}>
            {images.map((_, index) => (
              <View key={index} style={[styles.dot, selectedImage === index && styles.activeDot]} />
            ))}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbContainer}
          contentContainerStyle={styles.thumbContent}
        >
          {images.map((img, index) => (
            <TouchableOpacity
              key={`${img}-${index}`}
              onPress={() => setSelectedImage(index)}
              style={[styles.thumbBox, selectedImage === index && styles.activeThumb]}
            >
              <Image source={{ uri: img }} style={styles.thumbImg} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.infoContent}>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.round(ratingValue) ? 'star' : 'star-outline'}
                  size={18}
                  color="#F4C534"
                />
              ))}
            </View>
            <Text style={styles.ratingValue}>{ratingValue.toFixed(1)}</Text>
            <Text style={styles.reviewLink}>({totalReviews} รีวิว)</Text>
          </View>

          <View style={styles.priceStatsRow}>
            <View style={styles.priceStatBox}>
              <Text style={styles.statLabel}>เริ่มต้นที่</Text>
              <Text style={styles.statValue}>{formatPrice(priceSummary.starting)}</Text>
            </View>
            <View style={[styles.priceStatBox, styles.verticalDivider]}>
              <Text style={styles.statLabel}>ราคารับซื้อสูงสุด</Text>
              <Text style={styles.statValue}>{formatPrice(priceSummary.highestBid)}</Text>
            </View>
            <View style={[styles.priceStatBox, styles.verticalDivider]}>
              <Text style={styles.statLabel}>ราคาขายล่าสุด</Text>
              <Text style={styles.statValue}>{formatPrice(priceSummary.latestSale)}</Text>
            </View>
          </View>

          <View style={styles.guaranteeBanner}>
            <View style={styles.guaranteeLogo}>
              <Text style={styles.guaranteeLogoText}>AUTH</Text>
            </View>
            <Text style={styles.guaranteeText}>รับประกันของแท้ 100%</Text>
            <Ionicons name="information-circle-outline" size={22} color="#7B7B7B" />
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <TouchableOpacity style={styles.sectionAccordionHeader} onPress={() => setReviewExpanded((value) => !value)}>
            <Text style={styles.sectionTitle}>รีวิว</Text>
            <Ionicons name={reviewExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#111" />
          </TouchableOpacity>

          {reviewExpanded && (
            <View style={styles.sectionInner}>
              <View style={styles.sectionTopSpacing}>
                <View style={styles.sectionHeaderRow}>
                  <View>
                    <Text style={styles.subSectionTitle}>ดู & ช้อป</Text>
                    <Text style={styles.sectionSub}>ดูลุคจริงก่อนตัดสินใจซื้อ</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.viewMoreText}>ดูเพิ่มเติม</Text>
                  </TouchableOpacity>
                </View>

                {allReviewPhotos.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewPhotoRow}>
                    {allReviewPhotos.map((url, index) => (
                      <Image key={`${url}-${index}`} source={{ uri: url }} style={styles.reviewThumbnail} />
                    ))}
                  </ScrollView>
                )}

                <View style={styles.reviewScoreCard}>
                  <View>
                    <Text style={styles.reviewScoreValue}>{ratingValue.toFixed(1)}</Text>
                    <Text style={styles.reviewScoreLabel}>จาก 5</Text>
                  </View>
                  <View style={styles.reviewScoreRight}>
                    <View style={styles.reviewStarsLarge}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons key={star} name="star" size={28} color="#F4C534" />
                      ))}
                    </View>
                    <Text style={styles.reviewCountText}>{totalReviews} รีวิว</Text>
                  </View>
                </View>

                <View style={styles.fitSection}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.subSectionTitle}>คำแนะนำไซส์</Text>
                    <Ionicons name="information-circle-outline" size={19} color="#8C8C8C" />
                  </View>
                  {fitSummary.map((item) => (
                    <View key={item.label} style={styles.fitRow}>
                      <Text style={styles.fitLabel}>{item.label}</Text>
                      <View style={styles.fitBarTrack}>
                        <View style={[styles.fitBarFill, { width: `${item.percent}%` }]} />
                      </View>
                      <Text style={styles.fitPercent}>{item.percent}%</Text>
                    </View>
                  ))}
                </View>

                {highlightedReview && (
                  <View style={styles.reviewCard}>
                    <View style={styles.reviewTop}>
                      <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons
                            key={star}
                            name={star <= highlightedReview.rating ? "star" : "star-outline"}
                            size={16}
                            color="#F4C534"
                          />
                        ))}
                      </View>
                      <Text style={styles.reviewDate}>
                        {formatReviewDate(highlightedReview.created_at)}
                      </Text>
                    </View>
                    <Text style={styles.reviewUser}>
                      {highlightedReview.user_name || "ผู้ใช้"}
                    </Text>
                    <Text style={styles.reviewMeta}>
                      ไซส์ที่ซื้อ • {highlightedReview.size || "ไม่ระบุ"}
                    </Text>
                    <Text style={styles.reviewComment}>
                      {highlightedReview.comment}
                    </Text>
                    {highlightedReview.photos?.length > 0 && (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {highlightedReview.photos.map((img, i) => (
                          <Image key={i} source={{ uri: img }} style={styles.reviewThumbnail} />
                        ))}
                      </ScrollView>
                    )}
                  </View>
                )}

                {reviews.length > 1 && (
                  <TouchableOpacity style={styles.moreReviewButton}>
                    <Text style={styles.moreReviewButtonText}>ดูรีวิวเพิ่มเติม</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>

        <View style={styles.sectionBlock}>
          <TouchableOpacity style={styles.sectionAccordionHeader} onPress={() => setDetailExpanded((value) => !value)}>
            <Text style={styles.sectionTitle}>รายละเอียดสินค้า</Text>
            <Ionicons name={detailExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#111" />
          </TouchableOpacity>

          {detailExpanded && (
            <View style={styles.detailGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>แบรนด์</Text>
                <Text style={styles.detailLink}>{product.brand || '-'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>โมเดล</Text>
                <Text style={styles.detailLink}>{product.model || product.name?.split(' ').slice(0, 2).join(' ') || '-'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>SKU</Text>
                <Text style={styles.detailValue}>{product.sku || '-'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>สี</Text>
                <Text style={styles.detailValue}>{selectedColor || colorOptions[0] || product.color || 'ไม่ระบุ'}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.linkSection}>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkRowText}>ตารางไซซ์</Text>
            <Ionicons name="chevron-forward" size={24} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkRowText}>รับประกันของแท้</Text>
            <Ionicons name="chevron-forward" size={24} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => setShippingExpanded((value) => !value)}>
            <Text style={styles.linkRowText}>การจัดส่ง และการคืนสินค้า</Text>
            <Ionicons name={shippingExpanded ? 'chevron-down' : 'chevron-forward'} size={24} color="#111" />
          </TouchableOpacity>
          {shippingExpanded && (
            <View style={styles.linkPanel}>
              <Text style={styles.linkPanelText}>จัดส่งภายใน 1-2 วันทำการ และรองรับการคืนสินค้าตามเงื่อนไขของร้าน</Text>
            </View>
          )}

          <TouchableOpacity style={styles.linkRow} onPress={() => setRecentSalesExpanded((value) => !value)}>
            <Text style={styles.linkRowText}>รายการขายแล้วล่าสุด</Text>
            <Ionicons name={recentSalesExpanded ? 'chevron-down' : 'chevron-forward'} size={24} color="#111" />
          </TouchableOpacity>
          {recentSalesExpanded && (
            <View style={styles.linkPanel}>
              {variants.slice(0, 3).map((item) => (
                <View key={item.id} style={styles.saleRow}>
                  <Text style={styles.saleSize}>{item.size}</Text>
                  <Text style={styles.salePrice}>{formatCompactPrice(item.price)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoIconBox}>
            <Text style={styles.promoIconText}>SELL</Text>
          </View>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>เริ่มขายสินค้ากับเรา</Text>
            <Text style={styles.promoText}>ขายสินค้าของแท้ของคุณได้ง่าย ปลอดภัย และรวดเร็ว โดยไม่ต้องมีหน้าร้าน</Text>
          </View>
          <Ionicons name="open-outline" size={26} color="#4E5543" />
        </View>

        {relatedProducts.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>สินค้าที่คุณอาจสนใจ</Text>
            <View style={styles.relatedGrid}>
              {relatedProducts.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.relatedCard}
                  activeOpacity={0.9}
                  onPress={() => navigation.push('ProductDetail', { productId: item.id })}
                >
                  <Image source={{ uri: item.image }} style={styles.relatedImage} />
                  <Text style={styles.relatedBrand}>{item.brand}</Text>
                  <Text style={styles.relatedName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.relatedPriceLabel}>ราคาเริ่มต้น</Text>
                  <View style={styles.relatedPriceRow}>
                    <Text style={styles.relatedPrice}>{formatCompactPrice(item.price)}</Text>
                    <Ionicons name="heart-outline" size={22} color="#666" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomActionBar}>
        <TouchableOpacity style={styles.favoriteColumn}>
          <Ionicons name="heart-outline" size={36} color="#333" />
          <Text style={styles.favoriteCount}>43k</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sellButton} onPress={() => handleAction('cart')}>
          <Text style={styles.darkButtonText}>เพิ่มลงตะกร้า</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyButton} onPress={() => handleAction('buy')}>
          <Text style={styles.buyButtonText}>ซื้อ</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={sizeModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.sizeModalContent,
              { transform: [{ translateY: panY }] }
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.modalHandle} />

            <View style={styles.modalTabs}>
              <TouchableOpacity style={[styles.modalTab, confirmAction === 'buy' && styles.modalTabActive]} onPress={() => setConfirmAction('buy')}>
                <Text style={[styles.modalTabText, confirmAction === 'buy' && styles.modalTabTextActive]}>ซื้อเลย</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalTab, confirmAction === 'cart' && styles.modalTabActive]} onPress={() => setConfirmAction('cart')}>
                <Text style={[styles.modalTabText, confirmAction === 'cart' && styles.modalTabTextActive]}>เพิ่มลงตะกร้า</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalProductBrief}>
              <Image source={{ uri: product.image }} style={styles.briefImg} />
              <View style={styles.briefInfo}>
                <Text style={styles.briefName}>{product.name}</Text>
                <Text style={styles.briefMeta}>{(product.brand || '').toUpperCase()} • {product.sku || '-'}</Text>
              </View>
            </View>

            <View style={styles.sizeTabs}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.sizeTab, selectedColor === color && styles.sizeTabActive]}
                  onPress={() => {
                    setSelectedColor(color);
                    if (selectedVariant?.color !== color) {
                      setSelectedVariant(null);
                    }
                  }}
                >
                  <Text style={[styles.sizeTabText, selectedColor === color && styles.sizeTabTextActive]}>{color}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              data={filteredVariants}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isDisabled = Number(item.stock) <= 0;
                const isActive = selectedVariant?.id === item.id;

                return (
                  <TouchableOpacity
                    disabled={isDisabled}
                    style={[
                      styles.sizeItem,
                      isActive && styles.activeSizeItem,
                      isDisabled && styles.disabledSizeItem,
                    ]}
                    onPress={() => setSelectedVariant(item)}
                  >
                    <View style={styles.sizeItemTop}>
                      <Ionicons name="flash" size={12} color={isDisabled ? '#CFCFCF' : '#22C55E'} />
                      <Text style={[styles.sizeText, isDisabled && styles.disabledSizeText]}>{item.size}</Text>
                    </View>
                    <Text style={[styles.sizePrice, isDisabled && styles.disabledSizePrice]}>
                      {formatCompactPrice(item.price)}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.sizeGridContent}
            />

            <TouchableOpacity style={styles.confirmBuyBtn} onPress={handleConfirm}>
              <View style={styles.confirmBtnLeft}>
                <View style={styles.flashBadge}>
                  <Ionicons name="flash" size={16} color="#22C55E" />
                </View>
                <Text style={styles.confirmBtnMainText}>1-2 วัน</Text>
              </View>

              <View style={styles.confirmBtnRight}>
                <Text style={styles.confirmBtnPrice}>
                  {formatCompactPrice(selectedVariant ? selectedVariant.price : priceSummary.starting)}
                </Text>
                <Text style={styles.confirmBtnSub}>สินค้ามือหนึ่ง</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <ConfirmModal
        visible={!!modalConfig}
        title={modalConfig?.title}
        message={modalConfig?.message}
        confirmText={modalConfig?.confirmText}
        hideCancel
        onConfirm={() => {
          const handler = modalConfig?.onConfirm;
          closeInfoModal();
          if (handler) {
            handler();
          }
        }}
        onCancel={closeInfoModal}
      />
    </SafeAreaView>
  );
};

export default ProductDetailScreen;
