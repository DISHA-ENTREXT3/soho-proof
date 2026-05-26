import { useEffect, useMemo, useState } from "react";
import { Loader2, MessageSquare, Send, ExternalLink } from "lucide-react";
import { collection, addDoc, getDocs, query, where, documentId, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useFounderChallenges } from "@/hooks/use-challenges";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import type { Submission } from "@/types/challenge";

type ThreadContact = {
  key: string;
  founderId: string;
  builderId: string;
  challengeId: string;
  challengeTitle: string;
  counterpartId: string;
  counterpartName: string;
  counterpartAvatar: string;
  submissionLink: string;
  status: Submission["status"];
  lastActivity: string;
};

type ChatMessage = {
  id: string;
  founderId: string;
  builderId: string;
  challengeId: string;
  senderId: string;
  senderRole: "founder" | "talent";
  text: string;
  createdAt: string;
};

const toIsoString = (value: unknown) => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
};

const chunk = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const FounderMessages = () => {
  const { user, role } = useAuth();
  const isFounder = role === "founder";
  const { data: challenges = [], isLoading: challengesLoading } = useFounderChallenges(isFounder ? user?.uid : undefined);

  const [contacts, setContacts] = useState<ThreadContact[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeThreadKey, setActiveThreadKey] = useState<string>("");
  const [text, setText] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [sending, setSending] = useState(false);

  const challengeById = useMemo(() => {
    return new Map(challenges.map((challenge) => [challenge.id, challenge]));
  }, [challenges]);

  useEffect(() => {
    const loadContacts = async () => {
      if (!user || !role) return;
      setLoadingContacts(true);
      try {
        if (role === "founder") {
          const submissionSnapshots = await Promise.all(
            challenges.map((challenge) =>
              getDocs(query(collection(db, "submissions"), where("challengeId", "==", challenge.id))),
            ),
          );

          const rawSubmissions = submissionSnapshots.flatMap((snapshot) =>
            snapshot.docs.map((submissionDoc) => ({ id: submissionDoc.id, ...submissionDoc.data() })),
          ) as Array<Submission & { id: string }>;

          const latestByThread = new Map<string, ThreadContact>();
          for (const submission of rawSubmissions) {
            if (!submission.talentId) continue;
            const challenge = challengeById.get(submission.challengeId);
            const threadKey = `${user.uid}_${submission.talentId}_${submission.challengeId}`;
            const submittedAt = toIsoString(submission.submittedAt);
            const existing = latestByThread.get(threadKey);
            if (existing && new Date(existing.lastActivity).getTime() > new Date(submittedAt).getTime()) continue;

            latestByThread.set(threadKey, {
              key: threadKey,
              founderId: user.uid,
              builderId: submission.talentId,
              challengeId: submission.challengeId,
              challengeTitle: challenge?.title || "Challenge",
              counterpartId: submission.talentId,
              counterpartName: submission.talentName || "Builder",
              counterpartAvatar: submission.talentAvatar || "B",
              submissionLink: submission.link || "",
              status: submission.status || "Pending",
              lastActivity: submittedAt,
            });
          }

          const contactsArray = Array.from(latestByThread.values());
          if (contactsArray.length > 0) {
            const builderIds = contactsArray.map((item) => item.counterpartId);
            const idChunks = chunk(builderIds, 10);
            const profileSnapshots = await Promise.all(
              idChunks.map((ids) => getDocs(query(collection(db, "users"), where(documentId(), "in", ids)))),
            );
            const namesById = new Map<string, string>();
            const avatarById = new Map<string, string>();
            for (const snapshot of profileSnapshots) {
              for (const profileDoc of snapshot.docs) {
                const profile = profileDoc.data();
                namesById.set(profileDoc.id, String(profile.name || "Builder"));
                avatarById.set(profileDoc.id, String(profile.avatarInitials || String(profile.name || "B").slice(0, 1).toUpperCase()));
              }
            }
            setContacts(
              contactsArray
                .map((contact) => ({
                  ...contact,
                  counterpartName: namesById.get(contact.counterpartId) || contact.counterpartName,
                  counterpartAvatar: avatarById.get(contact.counterpartId) || contact.counterpartAvatar,
                }))
                .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()),
            );
          } else {
            setContacts([]);
          }
        } else {
          const submissionsSnapshot = await getDocs(query(collection(db, "submissions"), where("talentId", "==", user.uid)));
          const submissions = submissionsSnapshot.docs.map((submissionDoc) => ({
            id: submissionDoc.id,
            ...submissionDoc.data(),
          })) as Array<Submission & { id: string }>;

          const challengeIds = Array.from(new Set(submissions.map((submission) => submission.challengeId).filter(Boolean)));
          const challengeChunks = chunk(challengeIds, 10);
          const challengeSnapshots = await Promise.all(
            challengeChunks.map((ids) => getDocs(query(collection(db, "challenges"), where(documentId(), "in", ids)))),
          );

          const submissionChallengeMap = new Map<string, Record<string, unknown>>();
          for (const snapshot of challengeSnapshots) {
            for (const challengeDoc of snapshot.docs) {
              submissionChallengeMap.set(challengeDoc.id, challengeDoc.data() as Record<string, unknown>);
            }
          }

          const latestByThread = new Map<string, ThreadContact>();
          for (const submission of submissions) {
            const challengeData = submissionChallengeMap.get(submission.challengeId);
            if (!challengeData) continue;
            const founderId = String(challengeData.founderId ?? "");
            if (!founderId) continue;

            const threadKey = `${founderId}_${user.uid}_${submission.challengeId}`;
            const submittedAt = toIsoString(submission.submittedAt);
            const existing = latestByThread.get(threadKey);
            if (existing && new Date(existing.lastActivity).getTime() > new Date(submittedAt).getTime()) continue;

            latestByThread.set(threadKey, {
              key: threadKey,
              founderId,
              builderId: user.uid,
              challengeId: submission.challengeId,
              challengeTitle: String(challengeData.title ?? "Challenge"),
              counterpartId: founderId,
              counterpartName: String(challengeData.founderName ?? "Founder"),
              counterpartAvatar: String(challengeData.founderAvatar ?? "F"),
              submissionLink: submission.link || "",
              status: submission.status || "Pending",
              lastActivity: submittedAt,
            });
          }

          const contactsArray = Array.from(latestByThread.values());
          if (contactsArray.length > 0) {
            const founderIds = contactsArray.map((item) => item.counterpartId);
            const idChunks = chunk(founderIds, 10);
            const profileSnapshots = await Promise.all(
              idChunks.map((ids) => getDocs(query(collection(db, "users"), where(documentId(), "in", ids)))),
            );
            const namesById = new Map<string, string>();
            const avatarById = new Map<string, string>();
            for (const snapshot of profileSnapshots) {
              for (const profileDoc of snapshot.docs) {
                const profile = profileDoc.data();
                namesById.set(profileDoc.id, String(profile.name || "Founder"));
                avatarById.set(profileDoc.id, String(profile.avatarInitials || String(profile.name || "F").slice(0, 1).toUpperCase()));
              }
            }
            setContacts(
              contactsArray
                .map((contact) => ({
                  ...contact,
                  counterpartName: namesById.get(contact.counterpartId) || contact.counterpartName,
                  counterpartAvatar: avatarById.get(contact.counterpartId) || contact.counterpartAvatar,
                }))
                .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()),
            );
          } else {
            setContacts([]);
          }
        }
      } catch (error) {
        toast({
          title: "Could not load message contacts",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingContacts(false);
      }
    };

    loadContacts();
  }, [user, role, challenges, challengeById]);

  useEffect(() => {
    if (!user || !role) return;
    const messageQuery =
      role === "founder"
        ? query(collection(db, "messages"), where("founderId", "==", user.uid))
        : query(collection(db, "messages"), where("builderId", "==", user.uid));

    const unsubscribe = onSnapshot(
      messageQuery,
      (snapshot) => {
        const liveMessages = snapshot.docs
          .map((messageDoc) => {
            const payload = messageDoc.data();
            return {
              id: messageDoc.id,
              founderId: String(payload.founderId ?? ""),
              builderId: String(payload.builderId ?? ""),
              challengeId: String(payload.challengeId ?? ""),
              senderId: String(payload.senderId ?? ""),
              senderRole: (payload.senderRole as ChatMessage["senderRole"]) ?? "founder",
              text: String(payload.text ?? ""),
              createdAt: toIsoString(payload.createdAt),
            };
          })
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setMessages(liveMessages);
      },
      (error) => {
        toast({
          title: "Live messages disconnected",
          description: error.message,
          variant: "destructive",
        });
      },
    );

    return () => unsubscribe();
  }, [user, role]);

  useEffect(() => {
    if (!activeThreadKey && contacts.length > 0) {
      setActiveThreadKey(contacts[0].key);
      return;
    }
    if (activeThreadKey && contacts.length > 0 && !contacts.some((contact) => contact.key === activeThreadKey)) {
      setActiveThreadKey(contacts[0].key);
    }
  }, [contacts, activeThreadKey]);

  const activeContact = contacts.find((contact) => contact.key === activeThreadKey);
  const threadMessages = activeContact
    ? messages.filter(
        (message) =>
          message.founderId === activeContact.founderId &&
          message.builderId === activeContact.builderId &&
          message.challengeId === activeContact.challengeId,
      )
    : [];

  const sendMessage = async () => {
    if (!user || !role || !activeContact || !text.trim()) return;
    setSending(true);
    try {
      await addDoc(collection(db, "messages"), {
        founderId: activeContact.founderId,
        builderId: activeContact.builderId,
        challengeId: activeContact.challengeId,
        senderId: user.uid,
        senderRole: role === "founder" ? "founder" : "talent",
        text: text.trim(),
        createdAt: serverTimestamp(),
      });

      setText("");
      toast({ title: "Message sent", description: `Sent to ${activeContact.counterpartName}.` });
    } catch (error) {
      toast({
        title: "Unable to send",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (challengesLoading || loadingContacts) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          {isFounder ? "Founder Messages" : "Builder Messages"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isFounder
            ? "Real-time conversations with builders who submitted your challenges."
            : "Real-time conversations with founders whose challenges you submitted."}
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="glass p-12 text-center">
          <MessageSquare className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            {isFounder
              ? "No builder submissions yet. Messages unlock once builders submit work."
              : "No challenge submissions found yet. Submit work to unlock founder messaging."}
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[300px,1fr] gap-4">
          <div className="glass p-3 space-y-2 max-h-[70vh] overflow-y-auto">
            {contacts.map((contact) => (
              <button
                key={contact.key}
                onClick={() => setActiveThreadKey(contact.key)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  activeThreadKey === contact.key
                    ? "border-primary/40 bg-primary/10"
                    : "border-border hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{contact.counterpartName}</p>
                  <span className="text-[10px] uppercase text-muted-foreground">{contact.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{contact.challengeTitle}</p>
                {contact.submissionLink && (
                  <a
                    href={contact.submissionLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
                  >
                    <ExternalLink size={11} /> View submission
                  </a>
                )}
              </button>
            ))}
          </div>

          <div className="glass p-4 flex flex-col min-h-[70vh]">
            {activeContact ? (
              <>
                <div className="pb-3 border-b border-border">
                  <p className="font-semibold text-foreground">{activeContact.counterpartName}</p>
                  <p className="text-xs text-muted-foreground">Challenge: {activeContact.challengeTitle}</p>
                </div>

                <div className="flex-1 py-4 space-y-3 overflow-y-auto">
                  {threadMessages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No messages yet. Start the conversation.</p>
                  ) : (
                    threadMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                          message.senderId === user?.uid
                            ? "ml-auto bg-primary/15 border border-primary/30 text-foreground"
                            : "bg-secondary/70 border border-border text-foreground"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-3 border-t border-border space-y-2">
                  <Textarea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={`Message ${activeContact.counterpartName}...`}
                    className="bg-secondary/40 border-border min-h-[88px]"
                  />
                  <div className="flex justify-end">
                    <Button onClick={sendMessage} disabled={sending || !text.trim()}>
                      {sending ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Send size={14} className="mr-2" />}
                      Send Message
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 grid place-items-center text-muted-foreground text-sm">
                Select a conversation to start messaging.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FounderMessages;
