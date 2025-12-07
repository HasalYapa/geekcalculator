import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CALCULATORS } from '@/lib/constants';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Geek Calculator Hub
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
          Engineering, Math, Physics & Developer Tools — All in One.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CALCULATORS.map((calculator) => {
            const Icon = Icons[calculator.icon as keyof typeof Icons];
            return (
              <Link
                key={calculator.href}
                href={calculator.href}
                className="group"
              >
                <Card className="h-full transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl hover:border-primary">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-lg">
                      {calculator.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {calculator.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
