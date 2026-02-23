import { useState } from "react";
import { Shield, Globe, Terminal, Database, Brain, Activity, Lock, Wifi, Search, FileSearch, Code, Cpu, HardDrive, Network, Key, Bug, Eye, Zap, Server, Radio, Fingerprint, AlertTriangle, BookOpen, Clock, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// ─── Web Scraper ─────────────────────────────────────────────────────────────

function WebScraperSection() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [log, setLog] = useState<string[]>([]);

  const handleScrape = () => {
    if (!url) return;
    setStatus("running");
    setLog([]);
    const messages = [
      `[sandbox] Launching isolated Chromium instance…`,
      `[browser] Navigating to ${url}`,
      `[browser] Page loaded — collecting DOM snapshot`,
      `[scraper] Extracting links, metadata, and text content`,
      `[sandbox] Tearing down browser container`,
      `[done] Scrape complete. Results stored in working memory.`,
    ];
    messages.forEach((msg, i) => {
      setTimeout(() => {
        setLog((prev) => [...prev, msg]);
        if (i === messages.length - 1) setStatus("done");
      }, i * 600);
    });
  };

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Globe className="h-4 w-4 text-[hsl(var(--kindai-blue))]" />
          Web Scraper
          <Badge variant="secondary" className="ml-auto text-xs bg-[hsl(var(--kindai-blue)/0.1)] text-[hsl(var(--kindai-blue))]">
            Isolated Browser
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Safe web interaction using an ephemeral, sandboxed browser container. No cookies or state persist between sessions.
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border-border/50 bg-background focus:border-primary/50"
          />
          <Button
            onClick={handleScrape}
            disabled={!url || status === "running"}
            className="shrink-0 gradient-energy border-0"
          >
            {status === "running" ? "Running…" : "Scrape"}
          </Button>
        </div>
        {log.length > 0 && (
          <div className="rounded-lg bg-black/60 border border-border/40 p-3 font-mono text-xs space-y-1 max-h-44 overflow-y-auto">
            {log.map((line, i) => (
              <p key={i} className="text-[hsl(var(--kindai-green))]">{line}</p>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 text-xs">
          {["JavaScript rendering", "Screenshot capture", "Cookie isolation", "Proxy support", "Rate limiting"].map((f) => (
            <Badge key={f} variant="outline" className="border-border/50">{f}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Pentesting Tools ─────────────────────────────────────────────────────────

const PENTEST_TOOLS = [
  { name: "Nmap", icon: Network, category: "Recon", desc: "Network discovery & port scanning" },
  { name: "Nessus", icon: Bug, category: "Vuln Scan", desc: "Comprehensive vulnerability assessment" },
  { name: "Metasploit", icon: Zap, category: "Exploit", desc: "Exploit framework & payload delivery" },
  { name: "Burp Suite", icon: Globe, category: "Web", desc: "Web application security testing" },
  { name: "Wireshark", icon: Radio, category: "Traffic", desc: "Packet capture & protocol analysis" },
  { name: "Nikto", icon: Search, category: "Web", desc: "Web server vulnerability scanner" },
  { name: "SQLMap", icon: Database, category: "Injection", desc: "Automated SQL injection detection" },
  { name: "Hydra", icon: Key, category: "Auth", desc: "Network login brute-force tool" },
  { name: "John the Ripper", icon: Lock, category: "Crypto", desc: "Password hash cracking" },
  { name: "Hashcat", icon: Cpu, category: "Crypto", desc: "GPU-accelerated hash cracking" },
  { name: "Aircrack-ng", icon: Wifi, category: "Wireless", desc: "802.11 WEP/WPA/WPA2 cracking" },
  { name: "OWASP ZAP", icon: Shield, category: "Web", desc: "Open-source web app scanner" },
  { name: "Gobuster", icon: FileSearch, category: "Recon", desc: "Directory & file brute-forcing" },
  { name: "Shodan", icon: Eye, category: "OSINT", desc: "Internet-connected device search" },
  { name: "Maltego", icon: Layers, category: "OSINT", desc: "Visual link analysis & data mining" },
  { name: "Recon-ng", icon: Search, category: "OSINT", desc: "Full-featured recon framework" },
  { name: "Responder", icon: Server, category: "Network", desc: "LLMNR/NBT-NS/mDNS poisoner" },
  { name: "BloodHound", icon: Fingerprint, category: "AD", desc: "Active Directory attack paths" },
  { name: "Impacket", icon: Code, category: "Protocol", desc: "Python network protocol library" },
  { name: "CrackMapExec", icon: Terminal, category: "Post-Exploit", desc: "AD/SMB network attack toolkit" },
  { name: "Empire", icon: Activity, category: "Post-Exploit", desc: "Post-exploitation C2 framework" },
  { name: "ffuf", icon: HardDrive, category: "Fuzzing", desc: "Fast web fuzzer for discovery" },
];

const categoryColors: Record<string, string> = {
  Recon: "bg-[hsl(var(--kindai-blue)/0.1)] text-[hsl(var(--kindai-blue))]",
  "Vuln Scan": "bg-[hsl(var(--kindai-violet)/0.1)] text-[hsl(var(--kindai-violet))]",
  Exploit: "bg-destructive/10 text-destructive",
  Web: "bg-[hsl(var(--kindai-aqua)/0.1)] text-[hsl(var(--kindai-aqua))]",
  Traffic: "bg-[hsl(var(--kindai-green)/0.1)] text-[hsl(var(--kindai-green))]",
  Injection: "bg-[hsl(var(--kindai-pink)/0.1)] text-[hsl(var(--kindai-pink))]",
  Auth: "bg-[hsl(var(--kindai-blue)/0.1)] text-[hsl(var(--kindai-blue))]",
  Crypto: "bg-[hsl(var(--kindai-violet)/0.1)] text-[hsl(var(--kindai-violet))]",
  Wireless: "bg-[hsl(var(--kindai-aqua)/0.1)] text-[hsl(var(--kindai-aqua))]",
  OSINT: "bg-[hsl(var(--kindai-green)/0.1)] text-[hsl(var(--kindai-green))]",
  Network: "bg-[hsl(var(--kindai-blue)/0.1)] text-[hsl(var(--kindai-blue))]",
  AD: "bg-[hsl(var(--kindai-pink)/0.1)] text-[hsl(var(--kindai-pink))]",
  Protocol: "bg-muted text-muted-foreground",
  "Post-Exploit": "bg-destructive/10 text-destructive",
  Fuzzing: "bg-[hsl(var(--kindai-aqua)/0.1)] text-[hsl(var(--kindai-aqua))]",
};

function PentestingToolsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(PENTEST_TOOLS.map((t) => t.category)))];
  const filtered = activeCategory === "All" ? PENTEST_TOOLS : PENTEST_TOOLS.filter((t) => t.category === activeCategory);

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Terminal className="h-4 w-4 text-[hsl(var(--kindai-violet))]" />
          Pentesting Tools
          <Badge variant="secondary" className="ml-auto text-xs bg-[hsl(var(--kindai-violet)/0.1)] text-[hsl(var(--kindai-violet))]">
            {PENTEST_TOOLS.length}+ tools
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Professional-grade security testing suite. All tools execute inside isolated containers — no host-system exposure.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <div
              key={tool.name}
              className="flex items-start gap-3 rounded-lg border border-border/40 bg-background/40 p-3 hover:border-primary/20 transition-colors duration-200"
            >
              <div className="rounded-md bg-primary/5 p-1.5 shrink-0">
                <tool.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold">{tool.name}</span>
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${categoryColors[tool.category] || ""}`}>
                    {tool.category}
                  </Badge>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Sandboxed Execution ──────────────────────────────────────────────────────

const SANDBOX_CONTAINERS = [
  { id: "browser-01", type: "Browser", status: "idle", cpu: 2, mem: 12 },
  { id: "recon-02", type: "Recon", status: "running", cpu: 34, mem: 58 },
  { id: "exploit-03", type: "Exploit", status: "idle", cpu: 0, mem: 8 },
  { id: "analysis-04", type: "Analysis", status: "running", cpu: 61, mem: 74 },
];

function SandboxedExecutionSection() {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Lock className="h-4 w-4 text-[hsl(var(--kindai-green))]" />
          Sandboxed Execution
          <Badge variant="secondary" className="ml-auto text-xs bg-[hsl(var(--kindai-green)/0.1)] text-[hsl(var(--kindai-green))]">
            Isolated
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Every operation runs inside an ephemeral, network-isolated container. Containers are destroyed after each task, ensuring zero persistence of malicious artifacts.
        </p>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
          {SANDBOX_CONTAINERS.map((c) => (
            <div key={c.id} className="rounded-lg border border-border/40 bg-background/40 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold font-mono">{c.id}</span>
                <Badge
                  variant="secondary"
                  className={c.status === "running"
                    ? "text-[10px] bg-[hsl(var(--kindai-green)/0.1)] text-[hsl(var(--kindai-green))]"
                    : "text-[10px] bg-muted text-muted-foreground"}
                >
                  {c.status}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">Type: {c.type}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>CPU</span><span>{c.cpu}%</span>
                </div>
                <Progress value={c.cpu} className="h-1" />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Memory</span><span>{c.mem}%</span>
                </div>
                <Progress value={c.mem} className="h-1" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {["Network isolation", "Read-only filesystem", "No persistent storage", "Auto-destroy on exit", "Audit logging"].map((f) => (
            <Badge key={f} variant="outline" className="border-border/50">{f}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Memory Systems ───────────────────────────────────────────────────────────

const LONG_TERM_ENTRIES = [
  { key: "preferred_scan_depth", value: "3", updated: "2 days ago" },
  { key: "trusted_domains", value: '["example.com", "docs.kindai.io"]', updated: "5 days ago" },
  { key: "recon_wordlist", value: "medium-2023.txt", updated: "1 week ago" },
];

const WORKING_MEMORY = {
  currentGoal: "Perform recon on target: staging.example.com",
  activeTools: ["Nmap", "Gobuster"],
  pendingSteps: ["Port scan", "Directory brute-force", "Tech fingerprint"],
  completedSteps: ["DNS enumeration", "WHOIS lookup"],
};

const EPISODIC_ENTRIES = [
  { action: "Scraped docs.example.com", result: "success", ts: "10 min ago" },
  { action: "Nmap scan 192.168.1.0/24", result: "success", ts: "25 min ago" },
  { action: "SQLMap injection probe", result: "no vuln", ts: "1 hour ago" },
  { action: "Password spray attempt", result: "blocked", ts: "3 hours ago" },
];

const KNOWLEDGE_BASE = [
  { topic: "OWASP Top 10", entries: 42, icon: BookOpen },
  { topic: "CVE Database", entries: 1_240, icon: AlertTriangle },
  { topic: "Tool Usage Patterns", entries: 87, icon: Brain },
  { topic: "Target Profiles", entries: 14, icon: Eye },
];

function MemorySystemsSection() {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Brain className="h-4 w-4 text-[hsl(var(--kindai-pink))]" />
          Memory Systems
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="working">
          <TabsList className="mb-4 flex-wrap h-auto gap-1">
            <TabsTrigger value="working">Working</TabsTrigger>
            <TabsTrigger value="long-term">Long-term</TabsTrigger>
            <TabsTrigger value="episodic">Episodic</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="context">Context Mgmt</TabsTrigger>
          </TabsList>

          {/* Working Memory */}
          <TabsContent value="working" className="space-y-3">
            <p className="text-sm text-muted-foreground">Active context and goals for the current operation.</p>
            <div className="rounded-lg border border-border/40 bg-background/40 p-3 space-y-3">
              <div>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Current Goal</p>
                <p className="text-sm font-medium">{WORKING_MEMORY.currentGoal}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Active Tools</p>
                <div className="flex flex-wrap gap-1">
                  {WORKING_MEMORY.activeTools.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs bg-primary/10 text-primary">{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Pending</p>
                  <ul className="space-y-0.5">
                    {WORKING_MEMORY.pendingSteps.map((s) => (
                      <li key={s} className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-muted-foreground inline-block" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Completed</p>
                  <ul className="space-y-0.5">
                    {WORKING_MEMORY.completedSteps.map((s) => (
                      <li key={s} className="text-xs text-[hsl(var(--kindai-green))] flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-[hsl(var(--kindai-green))] inline-block" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Long-term Memory */}
          <TabsContent value="long-term" className="space-y-3">
            <p className="text-sm text-muted-foreground">Persistent storage of agent knowledge and learned preferences.</p>
            <div className="rounded-lg border border-border/40 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Key</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Value</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {LONG_TERM_ENTRIES.map((e) => (
                    <tr key={e.key} className="border-b border-border/30 last:border-0 hover:bg-muted/20">
                      <td className="px-3 py-2 font-mono text-primary">{e.key}</td>
                      <td className="px-3 py-2 font-mono text-muted-foreground truncate max-w-[160px]">{e.value}</td>
                      <td className="px-3 py-2 text-muted-foreground">{e.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Episodic Memory */}
          <TabsContent value="episodic" className="space-y-3">
            <p className="text-sm text-muted-foreground">Historical record of actions and outcome patterns.</p>
            <div className="space-y-2">
              {EPISODIC_ENTRIES.map((e, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/40 px-3 py-2">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{e.action}</p>
                    <p className="text-[10px] text-muted-foreground">{e.ts}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] shrink-0 ${
                      e.result === "success"
                        ? "bg-[hsl(var(--kindai-green)/0.1)] text-[hsl(var(--kindai-green))]"
                        : e.result === "blocked"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {e.result}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Knowledge Base */}
          <TabsContent value="knowledge" className="space-y-3">
            <p className="text-sm text-muted-foreground">Structured domain expertise and tool capability index.</p>
            <div className="grid grid-cols-2 gap-2">
              {KNOWLEDGE_BASE.map((kb) => (
                <div key={kb.topic} className="rounded-lg border border-border/40 bg-background/40 p-3 flex items-center gap-3">
                  <div className="rounded-md bg-primary/5 p-2 shrink-0">
                    <kb.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{kb.topic}</p>
                    <p className="text-[11px] text-muted-foreground">{kb.entries.toLocaleString()} entries</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Context Management */}
          <TabsContent value="context" className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Intelligently manages growing LLM context windows using chain summarization — older turns are summarized and compressed to keep the active window within token limits.
            </p>
            <div className="rounded-lg border border-border/40 bg-background/40 p-4 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Context window usage</span>
                  <span className="text-muted-foreground">68% of 128k tokens</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Active turns", value: "24" },
                  { label: "Summarised turns", value: "112" },
                  { label: "Compression ratio", value: "4.7x" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-muted/30 p-2">
                    <p className="text-sm font-bold">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {["Chain summarization", "Rolling window", "Importance scoring", "Token budgeting"].map((f) => (
                  <Badge key={f} variant="outline" className="text-xs border-border/50">{f}</Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SecurityTools() {
  return (
    <div className="relative p-6 md:p-8 space-y-6">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full blur-[150px] bg-[hsl(var(--kindai-violet)/0.06)]" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[hsl(var(--kindai-violet)/0.1)] p-2 shadow-[0_0_16px_hsl(var(--kindai-violet)/0.2)]">
            <Shield className="h-6 w-6 text-[hsl(var(--kindai-violet))]" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">Security Tools</h1>
            <p className="mt-0.5 text-muted-foreground">Isolated environments · sandboxed execution · persistent memory</p>
          </div>
        </div>
      </div>

      <div className="relative space-y-6">
        <WebScraperSection />
        <PentestingToolsSection />
        <SandboxedExecutionSection />
        <MemorySystemsSection />
      </div>
    </div>
  );
}
