import { useState, useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ShoppingBag, 
  Dumbbell, 
  Apple, 
  Heart, 
  Search, 
  Filter,
  Star,
  MapPin,
  Clock,
  Coins,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useStepCounter } from '@/hooks/useStepCounter';
import { useToast } from '@/hooks/use-toast';
import type { MarketplaceItem, MarketplaceCategory } from '@/types';

// Sample marketplace data
const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: '1',
    name: '20% Off Healthy Smoothies',
    description: 'Fresh fruit smoothies and protein shakes at Green Juice Bar',
    category: 'food',
    vendor: {
      id: 'vendor-1',
      name: 'Green Juice Bar',
      logo: '🥤',
      isVerified: true,
      rating: 4.8,
      location: { city: 'Tbilisi', country: 'Georgia' }
    },
    coinPrice: 5,
    originalPrice: 25,
    discountPercentage: 20,
    imageUrl: '/api/placeholder/300/200',
    availability: { inStock: true, validUntil: new Date('2024-12-31') },
    rating: 4.7,
    reviewCount: 156,
    tags: ['smoothies', 'protein', 'healthy', 'organic'],
    expiresAt: new Date('2024-12-31')
  },
  {
    id: '2',
    name: 'Free Personal Training Session',
    description: '1-hour personal training session with certified trainer',
    category: 'fitness',
    vendor: {
      id: 'vendor-2',
      name: 'FitZone Gym',
      logo: '💪',
      isVerified: true,
      rating: 4.9,
      location: { city: 'Tbilisi', country: 'Georgia' }
    },
    coinPrice: 15,
    originalPrice: 50,
    discountPercentage: 100,
    imageUrl: '/api/placeholder/300/200',
    availability: { inStock: true, quantity: 5 },
    rating: 4.9,
    reviewCount: 89,
    tags: ['training', 'fitness', 'personal', 'gym'],
    expiresAt: new Date('2024-12-15')
  },
  {
    id: '3',
    name: 'Spa Wellness Package',
    description: 'Relaxing massage and wellness treatment package',
    category: 'wellness',
    vendor: {
      id: 'vendor-3',
      name: 'Zen Wellness Spa',
      logo: '🧘',
      isVerified: true,
      rating: 4.6,
      location: { city: 'Tbilisi', country: 'Georgia' }
    },
    coinPrice: 25,
    originalPrice: 120,
    discountPercentage: 30,
    imageUrl: '/api/placeholder/300/200',
    availability: { inStock: true },
    rating: 4.6,
    reviewCount: 234,
    tags: ['spa', 'massage', 'wellness', 'relaxation']
  },
  {
    id: '4',
    name: 'Organic Grocery Voucher',
    description: '₾30 voucher for organic groceries and health products',
    category: 'shopping',
    vendor: {
      id: 'vendor-4',
      name: 'Organic Market',
      logo: '🛒',
      isVerified: true,
      rating: 4.5,
      location: { city: 'Tbilisi', country: 'Georgia' }
    },
    coinPrice: 12,
    originalPrice: 30,
    discountPercentage: 10,
    imageUrl: '/api/placeholder/300/200',
    availability: { inStock: true },
    rating: 4.5,
    reviewCount: 78,
    tags: ['organic', 'groceries', 'health', 'voucher']
  }
];

const CATEGORIES = [
  {
    id: 'all',
    name: 'All Categories',
    description: 'Browse all available offers',
    icon: ShoppingBag,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  {
    id: 'food',
    name: 'Healthy Food',
    description: 'Organic restaurants, juice bars, healthy meal plans',
    icon: Apple,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: 'fitness',
    name: 'Fitness & Gyms',
    description: 'Gym memberships, personal training, fitness classes',
    icon: Dumbbell,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 'shopping',
    name: 'Health Shopping',
    description: 'Supplements, organic groceries, health products',
    icon: ShoppingBag,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    id: 'wellness',
    name: 'Wellness & Spa',
    description: 'Yoga studios, spas, wellness centers, meditation',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  }
] as const;

interface MarketplaceItemCardProps {
  item: MarketplaceItem;
  onRedeem: (item: MarketplaceItem) => void;
  userCoins: number;
}

const MarketplaceItemCard = memo(({ item, onRedeem, userCoins }: MarketplaceItemCardProps) => {
  const canAfford = userCoins >= item.coinPrice;
  const isExpiringSoon = item.expiresAt && 
    new Date(item.expiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden">
      {/* Featured badge */}
      {item.discountPercentage && item.discountPercentage >= 50 && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      {/* Expiring soon badge */}
      {isExpiringSoon && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="destructive" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Expires Soon
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base line-clamp-2">{item.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">{item.vendor.logo}</span>
              <span className="text-sm font-medium">{item.vendor.name}</span>
              {item.vendor.isVerified && (
                <CheckCircle className="h-4 w-4 text-blue-500" />
              )}
            </div>
          </div>
        </div>

        {/* Rating and location */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {item.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{item.rating}</span>
              <span>({item.reviewCount})</span>
            </div>
          )}
          {item.vendor.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{item.vendor.location.city}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-yellow-600" />
                <span className="font-bold text-lg">{item.coinPrice}</span>
              </div>
              {item.originalPrice && (
                <div className="text-sm text-muted-foreground">
                  <span className="line-through">₾{item.originalPrice}</span>
                  {item.discountPercentage && (
                    <span className="ml-1 text-green-600 font-medium">
                      -{item.discountPercentage}%
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Availability status */}
          {!item.availability.inStock ? (
            <div className="flex items-center gap-1 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Out of stock</span>
            </div>
          ) : item.availability.quantity && item.availability.quantity <= 5 ? (
            <div className="flex items-center gap-1 text-orange-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Only {item.availability.quantity} left</span>
            </div>
          ) : null}
        </div>

        {/* Action button */}
        <Button
          onClick={() => onRedeem(item)}
          disabled={!canAfford || !item.availability.inStock}
          className="w-full"
          variant={canAfford && item.availability.inStock ? "default" : "outline"}
        >
          {!item.availability.inStock ? (
            'Out of Stock'
          ) : !canAfford ? (
            `Need ${item.coinPrice - userCoins} more coins`
          ) : (
            <>
              <Coins className="h-4 w-4 mr-2" />
              Redeem for {item.coinPrice} coins
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
});

const Marketplace = () => {
  const { stepData } = useStepCounter();
  const { toast } = useToast();
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'coins' | 'rating' | 'expires'>('coins');

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let items = MARKETPLACE_ITEMS;

    // Filter by category
    if (activeCategory !== 'all') {
      items = items.filter(item => item.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.vendor.name.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort items
    items = [...items].sort((a, b) => {
      switch (sortBy) {
        case 'coins':
          return a.coinPrice - b.coinPrice;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'expires':
          const aTime = a.expiresAt?.getTime() || Infinity;
          const bTime = b.expiresAt?.getTime() || Infinity;
          return aTime - bTime;
        default:
          return 0;
      }
    });

    return items;
  }, [activeCategory, searchQuery, sortBy]);

  const handleRedeem = useCallback((item: MarketplaceItem) => {
    if (stepData.coins >= item.coinPrice) {
      // In a real app, this would make an API call
      toast({
        title: "Redemption Successful! 🎉",
        description: `You've successfully redeemed "${item.name}" for ${item.coinPrice} Boltacoins!`,
        duration: 5000,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Insufficient Coins",
        description: `You need ${item.coinPrice - stepData.coins} more Boltacoins to redeem this offer.`,
        duration: 3000,
      });
    }
  }, [stepData.coins, toast]);

  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchQuery(''); // Clear search when changing category
  }, []);

  const activeTab = activeCategory === 'all' ? 'browse' : 'categories';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Marketplace</h2>
          <p className="text-muted-foreground">
            Exchange your {stepData.coins} Boltacoins for exclusive healthy lifestyle rewards
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search offers, vendors, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={(value: 'coins' | 'rating' | 'expires') => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coins">Sort by Coins</SelectItem>
              <SelectItem value="rating">Sort by Rating</SelectItem>
              <SelectItem value="expires">Sort by Expiry</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="browse" 
            onClick={() => setActiveCategory('all')}
          >
            Browse All ({MARKETPLACE_ITEMS.length})
          </TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Results summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredItems.length} offer{filteredItems.length !== 1 ? 's' : ''} available
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            {activeCategory !== 'all' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveCategory('all')}
              >
                Clear filter
              </Button>
            )}
          </div>

          {/* Items grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MarketplaceItemCard
                  key={item.id}
                  item={item}
                  onRedeem={handleRedeem}
                  userCoins={stepData.coins}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No offers found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 
                  `No offers match "${searchQuery}". Try different keywords.` :
                  'No offers available in this category.'
                }
              </p>
              {(searchQuery || activeCategory !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                >
                  Show all offers
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.filter(cat => cat.id !== 'all').map((category) => {
              const ItemIcon = category.icon;
              const itemCount = MARKETPLACE_ITEMS.filter(item => item.category === category.id).length;
              
              return (
                <Card 
                  key={category.id} 
                  className="cursor-pointer hover:shadow-md transition-all duration-200 group"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${category.bgColor} group-hover:scale-110 transition-transform`}>
                        <ItemIcon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {itemCount} offer{itemCount !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Get more coins CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Need More Coins?</h3>
          <p className="text-muted-foreground mb-4">
            Keep walking to earn more Boltacoins! Every 1,000 steps = 1 coin.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>🚶‍♂️ Walk more</span>
            <span>•</span>
            <span>🪙 Earn coins</span>
            <span>•</span>
            <span>🎁 Get rewards</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(Marketplace);