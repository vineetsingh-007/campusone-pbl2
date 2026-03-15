import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const CATEGORIES = ["General", "WiFi", "Hostel", "Facilities", "Academic", "Transport", "Canteen", "Safety"];

const statusConfig: Record<string, { icon: typeof AlertCircle; color: string; label: string }> = {
  open: { icon: AlertCircle, color: "text-destructive", label: "Open" },
  "in-progress": { icon: Clock, color: "text-primary", label: "In Progress" },
  resolved: { icon: CheckCircle2, color: "text-green-500", label: "Resolved" },
  closed: { icon: CheckCircle2, color: "text-muted-foreground", label: "Closed" },
};

const ComplaintsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "General" });

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ["complaints", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("complaints").insert({
        user_id: user!.id,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        status: "open",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Complaint submitted", description: "We'll look into this soon." });
      qc.invalidateQueries({ queryKey: ["complaints"] });
      setShowForm(false);
      setForm({ title: "", description: "", category: "General" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    submit.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Complaints</h1>
          <p className="text-muted-foreground">Submit and track your campus complaints.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
          <Plus size={14} /> New
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-foreground">New Complaint</h3>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input required placeholder="Brief title of your issue" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} maxLength={200} />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea required placeholder="Describe the issue in detail..." rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} maxLength={2000} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" type="submit" disabled={submit.isPending}>
                {submit.isPending && <Loader2 size={14} className="mr-1.5 animate-spin" />}
                Submit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : complaints.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No complaints submitted yet.</p>
      ) : (
        <div className="space-y-2">
          {complaints.map((c, i) => {
            const cfg = statusConfig[c.status] ?? statusConfig.open;
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <cfg.icon size={16} className={`mt-0.5 ${cfg.color}`} />
                    <div>
                      <p className="font-medium text-foreground">{c.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.category} · {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                      {c.admin_note && (
                        <p className="mt-2 rounded bg-primary/5 px-2 py-1 text-xs text-foreground">
                          <span className="font-medium">Admin note:</span> {c.admin_note}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;
