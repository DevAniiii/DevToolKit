"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Hash,
  KeyRound,
  Trash2,
  XCircle,
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
import {
  decodeJwt,
  getExpiryInfo,
  formatTimestamp,
  type DecodedJwt,
  type ExpiryInfo,
} from "@/lib/jwt";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.3vHqQ8x2Yk0nP8wJ5lq2cMfV5cT0r8mE4hZ1aB2cD3e";

function expiryBadge(info: ExpiryInfo) {
  switch (info.status) {
    case "valid":
      return (
        <Badge variant="success">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Valid
        </Badge>
      );
    case "expired":
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" /> Expired
        </Badge>
      );
    case "not-yet-valid":
      return (
        <Badge variant="warning">
          <Clock className="mr-1 h-3 w-3" /> Not active yet
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          <AlertTriangle className="mr-1 h-3 w-3" /> No expiry
        </Badge>
      );
  }
}

interface ClaimRowProps {
  label: string;
  value: React.ReactNode;
}

function ClaimRow({ label, value }: ClaimRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-mono">{value}</span>
    </div>
  );
}

export function JwtDecoder() {
  const [token, setToken] = React.useState("");
  const [decoded, setDecoded] = React.useState<DecodedJwt | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!token.trim()) {
      setDecoded(null);
      setError(null);
      return;
    }
    try {
      setDecoded(decodeJwt(token));
      setError(null);
    } catch (e) {
      setDecoded(null);
      setError(e instanceof Error ? e.message : "Failed to decode token");
    }
  }, [token]);

  const headerJson = decoded
    ? JSON.stringify(decoded.header, null, 2)
    : "";
  const payloadJson = decoded
    ? JSON.stringify(decoded.payload, null, 2)
    : "";

  const expiry = decoded ? getExpiryInfo(decoded.payload) : null;

  function handleDownload() {
    if (!decoded) return;
    const content = JSON.stringify(
      { header: decoded.header, payload: decoded.payload },
      null,
      2
    );
    downloadText("jwt-decoded.json", content);
    toast.success("Downloaded jwt-decoded.json");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" /> Encoded token
          </CardTitle>
          <CardDescription>
            Paste a JWT. Everything is decoded locally — nothing leaves your
            browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="min-h-[220px] break-all"
            spellCheck={false}
          />
          {error && (
            <p className="flex items-start gap-2 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setToken(SAMPLE_JWT)}
            >
              Load sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setToken("")}
              disabled={!token}
            >
              <Trash2 /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output */}
      <div className="space-y-6">
        {decoded && expiry ? (
          <>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Summary</CardTitle>
                  {expiryBadge(expiry)}
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <ClaimRow
                  label="Algorithm"
                  value={decoded.header.alg ?? "—"}
                />
                <ClaimRow
                  label="Type"
                  value={decoded.header.typ ?? "—"}
                />
                <ClaimRow
                  label="Issued at (iat)"
                  value={
                    formatTimestamp(decoded.payload.iat) ??
                    (decoded.payload.iat ? String(decoded.payload.iat) : "—")
                  }
                />
                <ClaimRow
                  label="Expires (exp)"
                  value={
                    formatTimestamp(decoded.payload.exp) ??
                    (decoded.payload.exp ? String(decoded.payload.exp) : "—")
                  }
                />
                <div
                  className={
                    "mt-3 flex items-start gap-2 rounded-md p-2 text-sm " +
                    (expiry.status === "valid"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : expiry.status === "expired"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-300")
                  }
                >
                  <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                  {expiry.message}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Hash className="h-4 w-4 text-primary" /> Header
                </CardTitle>
                <CopyButton value={headerJson} />
              </CardHeader>
              <CardContent>
                <pre className="max-h-60 overflow-auto rounded-md bg-muted p-3 text-xs">
                  <code>{headerJson}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Hash className="h-4 w-4 text-primary" /> Payload
                </CardTitle>
                <div className="flex gap-2">
                  <CopyButton value={payloadJson} />
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download /> Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs">
                  <code>{payloadJson}</code>
                </pre>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="flex h-full min-h-[300px] items-center justify-center border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground">
              <KeyRound className="mx-auto mb-3 h-10 w-10 opacity-40" />
              <p className="text-sm">
                Decoded header, payload and claims will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
