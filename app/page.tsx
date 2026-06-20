"use client";

import * as React from "react";
import { Binary, Braces, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JwtDecoder } from "@/components/tools/jwt-decoder";
import { Base64Tool } from "@/components/tools/base64-tool";
import { JsonFormatter } from "@/components/tools/json-formatter";

const TOOLS = [
  {
    value: "jwt",
    label: "JWT Decoder",
    icon: KeyRound,
    title: "JWT Decoder & Inspector",
    blurb: "Decode and inspect JSON Web Tokens with expiry checks.",
  },
  {
    value: "base64",
    label: "Base64",
    icon: Binary,
    title: "Base64 Encoder / Decoder",
    blurb: "Encode and decode Base64 data, UTF-8 safe.",
  },
  {
    value: "json",
    label: "JSON Formatter",
    icon: Braces,
    title: "JSON Formatter",
    blurb: "Validate, beautify and minify JSON.",
  },
] as const;

export default function HomePage() {
  const [tool, setTool] = React.useState<string>("jwt");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="container relative py-16 text-center sm:py-20">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Lock className="h-3.5 w-3.5 text-primary" />
            100% client-side · your data never leaves the browser
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Developer Toolkit
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Decode JWT tokens, inspect authentication payloads, encode/decode
            Base64 data, and format JSON — all in one fast, modern workspace.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> No tracking
            </span>
            <span className="inline-flex items-center gap-1.5">
              <KeyRound className="h-4 w-4 text-primary" /> JWT claims & expiry
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Braces className="h-4 w-4 text-primary" /> Instant formatting
            </span>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="container py-10 sm:py-12">
        <Tabs value={tool} onValueChange={setTool}>
          <div className="flex flex-col items-center gap-4">
            <TabsList className="h-auto flex-wrap justify-center gap-1 p-1">
              {TOOLS.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <p className="text-center text-sm text-muted-foreground">
              {TOOLS.find((t) => t.value === tool)?.blurb}
            </p>
          </div>

          <div className="mt-8">
            <TabsContent value="jwt">
              <JwtDecoder />
            </TabsContent>
            <TabsContent value="base64">
              <Base64Tool />
            </TabsContent>
            <TabsContent value="json">
              <JsonFormatter />
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </div>
  );
}
