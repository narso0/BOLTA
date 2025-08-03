import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Dumbbell, Apple, Heart } from 'lucide-react';

const Marketplace = () => {
  const categories = [
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
  ];

  const handleCategoryClick = (categoryId: string) => {
    // Demo - would navigate to category page
    alert(`Coming Soon! ${categories.find(c => c.id === categoryId)?.name} stores will be available in the next update.`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Marketplace</h2>
        <p className="text-muted-foreground">Exchange your Boltacoins for exclusive healthy lifestyle discounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.id} className="border-0 shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6" onClick={() => handleCategoryClick(category.id)}>
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-lg ${category.bgColor}`}>
                    <IconComponent className={`h-8 w-8 ${category.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{category.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                    <Button 
                      className="bg-primary hover:bg-primary-dark text-primary-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.id);
                      }}
                    >
                      Browse {category.name}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-0 shadow-soft bg-accent/10">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Coming Soon!</h3>
            <p className="text-muted-foreground">
              We're partnering with healthy stores and gyms across Georgia to bring you amazing discounts. 
              Each category will soon have dozens of partner businesses offering exclusive deals for Boltacoin holders.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Marketplace;