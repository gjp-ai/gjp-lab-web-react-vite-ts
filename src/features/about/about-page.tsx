import { Code2, Compass, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export function AboutPage() {
  return (
    <section lang="en" className="hero" aria-labelledby="about-title">
      <p className="eyebrow">BUILT TO EXPLORE</p>
      <h1 id="about-title">
        A little structure.
        <br />
        <span>More possibilities.</span>
      </h1>
      <p className="intro">
        A place to try ideas with typed navigation, reusable components, and a consistent visual
        language.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Compass className="mb-3 size-6 text-primary" aria-hidden="true" />
            <CardTitle>
              <h2>Find your way</h2>
            </CardTitle>
            <CardDescription>TanStack Router</CardDescription>
          </CardHeader>
          <CardContent>
            Home and About share one layout. Links keep you inside the app’s hosting path.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Layers className="mb-3 size-6 text-primary" aria-hidden="true" />
            <CardTitle>
              <h2>Build with care</h2>
            </CardTitle>
            <CardDescription>shadcn/ui and Base UI</CardDescription>
          </CardHeader>
          <CardContent>
            Local components pair accessible interaction primitives with Tailwind CSS 4 styling.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Code2 className="mb-3 size-6 text-primary" aria-hidden="true" />
            <CardTitle>
              <h2>Make it yours</h2>
            </CardTitle>
            <CardDescription>Lucide React</CardDescription>
          </CardHeader>
          <CardContent>
            Small, consistent icons support clear labels and keyboard-friendly controls.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
