import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Footprints, Coins, Gift, TrendingUp } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface IntroProps {
  onGetStarted: () => void;
}

const Intro = ({ onGetStarted }: IntroProps) => {
  const features = [
    {
      icon: Footprints,
      title: "ნაბიჯების მონიტორინგი",
      description: "ავტომატურად დაითვლი ყოველდღიურ ნაბიჯებს ტელეფონის მეშვეობით"
    },
    {
      icon: Coins,
      title: "დააგროვე ბოლთაქოინები", 
      description: "თითოეულ 1,000 ნაბიჯზე მიიღეთ 1 ბოლტაქოინი"
    },
    {
      icon: Gift,
      title: "ქოინების გაცვლა",
      description: "გადაცვალეთ ბოლტაქოინები ჯილდოებზე და ფასდაკლებებზე"
    },
    {
      icon: TrendingUp,
      title: "იყავი მოტივირებული",
      description: "ყოველდღიური გამოწვევები და სტატისტიკა თქვენი პროგრესის სანახავად"
    }
  ];

  const stats = [
    { number: "10K+", label: "Daily Steps Goal" },
    { number: "1:1000", label: "Coin to Steps Ratio" },
    { number: "50+", label: "Partner Stores" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10" />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                <Logo className="h-16 w-16 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">ბოლთა</h1>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                
                <span className="block text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-snug overflow-visible">
                  გადაცვალეთ ნაბიჯები ჯანსაღ ჯილდოებში
                </span>
              </h2>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                იარე ყოველდღიურად, დააგროვე ბოლთაქოინები და გადაცვალე ისინი ექსკლუზიურად ჯანსაღი კვების ობიექტების, ფიტნეს/ჯანმრთელობის ცენტრების ფასდაკლებებში.
              </p>
            </div>

            {/* CTA Button */}
            <div className="space-y-4">
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                დაიწყე ახლავე
                <Footprints className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="text-sm text-muted-foreground">
                უფასო რეგისტრაცია • დაიწყე დაგროვება დღესვე
              </p>
            </div>
          </div>
        </div>
      </div>

      

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              როგორ მუშაობს ბოლთა?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              დაიხმარე ნაბიჯების მონიტორინგი, დააგროვე ბოლტაქოინები და მიიღე ჯილდოები
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              მზად ხართ ჯანსაღი ცხოვრების სტილისთვის?
            </h3>
            <p className="text-xl text-muted-foreground">
              შეუერთდით ბოლტას და დაიწყეთ თქვენი ჯანსაღი ცხოვრების გზა დღესვე!
            </p>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl"
            >
              დაიწყე ახლავე
                <Footprints className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;