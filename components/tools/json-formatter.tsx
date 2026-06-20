"use client";

import * as React from "react";
import {
  AlertTriangle,
  Braces,
  CheckCircle2,
  Download,
  Minimize2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { downloadText } from "@/lib/utils";

const SAMPLE_JSON =
  '{"name":"Developer Security Toolkit","version":1,"features":["jwt","base64","json"],"meta":{"local":true,"author":null}}';

type Validity =
  | { state: "empty" }
  | { state: "valid"; bytes: number }
  | { state: "invalid"; message: string };

export function JsonFormatter() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");

  const validity = React.useMemo<Validity>(() => {
    if (!input.trim()) return { state: "empty" };
    try {
      JSON.parse(input);
      return { state: "valid", bytes: new Blob([input]).size };
    } catch (e) {
      return {
        state: "invalid",
        message: e instanceof Error ? e.message : "Invalid JSON",
      };
    }
  }, [input]);

  function process(kind: "beautify" | "minify") {
    try {
      const parsed = JSON.parse(input);
      const result =
        kind === "beautify"
          ? JSON.stringify(parsed, null, 2)
          : JSON.stringify(parsed);
      setOutput(result);
      toast.success(kind === "beautify" ? "JSON beautified" : "JSON minified");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  function handleDownload() {
    if (!output) return;
    downloadText("formatted.json", output);
    toast.success("Downloaded formatted.json");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Braces className="h-5 w-5 text-primary" /> JSON Formatter
            </CardTitle>
            <CardDescription>
              Validate, beautify or minify JSON instantly.
            </CardDescription>
          </div>
          {validity.state === "valid" && (
            <Badge variant="success" className="self-start">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Valid JSON ·{" "}
              {validity.bytes} bytes
            </Badge>
          )}
          {validity.state === "invalid" && (
            <Badge variant="destructive" className="self-start">
              <AlertTriangle className="mr-1 h-3 w-3" /> Invalid JSON
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Input</label>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setInput(SAMPLE_JSON)}
                >
                  Load sample
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setInput("");
                    setOutput("");
                  }}
                  disabled={!input && !output}
                >
                  <Trash2 /> Clear
                </Button>
              </div>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"hello":"world"}'
              className="min-h-[320px]"
              spellCheck={false}
            />
            {validity.state === "invalid" && (
              <p className="flex items-start gap-2 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {validity.message}
              </p>
            )}
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Output</label>
              <div className="flex gap-2">
                <CopyButton value={output} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!output}
                >
                  <Download /> Download
                </Button>
              </div>
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Formatted JSON appears here..."
              className="min-h-[320px] bg-muted/40"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => process("beautify")}
            disabled={validity.state !== "valid"}
          >
            <Sparkles /> Beautify
          </Button>
          <Button
            variant="secondary"
            onClick={() => process("minify")}
            disabled={validity.state !== "valid"}
          >
            <Minimize2 /> Minify
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
