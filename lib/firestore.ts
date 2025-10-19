'use client';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseFirestore } from "./firebase";

export type MessageStatus = "new" | "read" | "answered";

export interface MessageFlags {
  abusive: boolean;
}

export interface MessagePayload {
  title: string;
  content: string;
  ipHash: string;
  userAgent: string;
  flags: MessageFlags;
}

export interface MessageDoc extends MessagePayload {
  id: string;
  createdAt: Timestamp;
  status: MessageStatus;
}

export interface MessageReply {
  id: string;
  content: string;
  createdAt: Timestamp;
  author: "admin";
}

export interface ProjectDoc {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  imagePath: string;
  imageUrl: string;
  updatedAt: Timestamp;
  published: boolean;
  tags: string[];
}

export interface SettingsDoc {
  resumeUrl: string;
  social?: {
    github?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
}

const settingsDocRef = doc(firebaseFirestore, "settings", "global");
const projectsCollection = collection(firebaseFirestore, "projects");
const messagesCollection = collection(firebaseFirestore, "messages");

export const fetchSettings = async (): Promise<SettingsDoc | null> => {
  const snapshot = await getDoc(settingsDocRef);
  if (!snapshot.exists()) return null;
  return snapshot.data() as SettingsDoc;
};

export const updateSettings = async (settings: Partial<SettingsDoc>) => {
  await setDoc(
    settingsDocRef,
    {
      ...settings,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const fetchPublishedProjects = async (): Promise<ProjectDoc[]> => {
  const q = query(projectsCollection, where("published", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<ProjectDoc, "id">),
  }));
};

export const fetchAllProjects = async (): Promise<ProjectDoc[]> => {
  const snapshot = await getDocs(projectsCollection);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<ProjectDoc, "id">),
  }));
};

export const fetchProjectBySlug = async (
  slug: string
): Promise<ProjectDoc | null> => {
  const q = query(projectsCollection, where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return {
    id: docSnap.id,
    ...(docSnap.data() as Omit<ProjectDoc, "id">),
  };
};

export const upsertProject = async (project: ProjectDoc) => {
  const { id, ...data } = project;
  if (id) {
    const target = doc(projectsCollection, id);
    await updateDoc(target, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return id;
  }
  const snapshot = await addDoc(projectsCollection, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return snapshot.id;
};

export const deleteProject = async (projectId: string) => {
  const target = doc(projectsCollection, projectId);
  await deleteDoc(target);
};

export const createMessage = async (payload: MessagePayload) => {
  await addDoc(messagesCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    status: "new",
  });
};

export const listMessages = async (): Promise<MessageDoc[]> => {
  const q = query(
    messagesCollection,
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<MessageDoc, "id">),
  }));
};

export const updateMessageStatus = async (
  messageId: string,
  status: MessageStatus
) => {
  const target = doc(messagesCollection, messageId);
  const updates: Record<string, unknown> = { status };
  if (status === "answered") {
    updates.answeredAt = serverTimestamp();
  }
  await updateDoc(target, updates);
};

export const replyToMessage = async (
  messageId: string,
  content: string
) => {
  const repliesRef = collection(
    firebaseFirestore,
    "messages",
    messageId,
    "replies"
  );
  await addDoc(repliesRef, {
    content,
    createdAt: serverTimestamp(),
    author: "admin",
  });
  await updateMessageStatus(messageId, "answered");
};

export const fetchRepliesForMessage = async (
  messageId: string
): Promise<MessageReply[]> => {
  const repliesRef = collection(
    firebaseFirestore,
    "messages",
    messageId,
    "replies"
  );
  const snapshot = await getDocs(
    query(repliesRef, orderBy("createdAt", "asc"))
  );
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<MessageReply, "id">),
  }));
};
