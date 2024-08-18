import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <div className="m-auto">
        <h1 className="text-4xl font-bold text-center">Spira</h1>
        <p className="text-center">AI powered form builder</p>
        <div>
          <Button className="w-full" variant="outline">
            Click me
          </Button>
        </div>
      </div>
    </main>
  );
}
