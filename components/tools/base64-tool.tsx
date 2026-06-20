"use client";

import * as React from "react";
import { AlertTriangle, ArrowDownUp, Binary, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/copy-button";
import { encodeBase64, decodeBase64 } from "@/lib/base64";

type Mode = "encode" | "decode";

export function Base64Tool() {
  const [mode, setMode] = React.useState<Mode>("encode");
  const [input, setInput] = React.useState("");

  const { output, error } = React.useMemo(() => {
    if (!input) return { output: "", error: null as string | null };
    try {
      const result =
        mode === "encode" ? encodeBase64(input) : decodeBase64(input);
      return { output: result, error: null as string | null };
    } catch (e) {
      return {
        output: "",
        error: e instanceof Error ? e.message : "Conversion failed",
      };
    }
  }, [input, mode]);

  function swap() {
    // Use the current valid output as the next input and flip the mode.
    if (output) setInput(output);
    setMode((m) => (m === "encode" ? "decode" : "encode"));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Binary className="h-5 w-5 text-primary" /> Base64 Encoder /
              Decoder
            </CardTitle>
            <CardDescription>
              Convert text to Base64 and back. UTF-8 safe.
            </CardDescription>
          </div>
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as Mode)}
            className="shrink-0"
          >
            <TabsList>
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {mode === "encode" ? "Plain text" : "Base64"}
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInput("")}
                disabled={!input}
              >
                <Trash2 /> Clear
              </Button>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "encode"
                  ? "Type or paste text to encode..."
                  : "Paste Base64 to decode..."
              }
              className="min-h-[220px]"
              spellCheck={false}
            />
          </div>

          {/* Swap */}
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swap}
              aria-label="Swap input and output"
              className="rotate-90 md:rotate-0"
            >
              <ArrowDownUp />
            </Button>
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {mode === "encode" ? "Base64" : "Plain text"}
              </label>
              <CopyButton value={output} />
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Result appears here..."
              className="min-h-[220px] bg-muted/40"
              spellCheck={false}
            />
          </div>
        </div>

        {error && (
          <p className="flex items-start gap-2 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
