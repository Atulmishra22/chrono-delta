import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { User } from "@/types/user";
import { Project, CreateProjectInput } from "@/types/project";
import { Task, CreateTaskInput } from "@/types/task";

export const toTimestamp = (date: Date): Timestamp => Timestamp.fromDate(new Date(date));
export const fromTimestamp = (ts: any): Date => {
  if (!ts) return new Date();
  if (typeof ts.toDate === "function") return ts.toDate();
  return new Date(ts);
};

const LOCAL_PROJECTS_KEY = "timeflow_local_projects";
const LOCAL_TASKS_KEY = "timeflow_local_tasks";

function getLocalProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_PROJECTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((p: any) => ({
      ...p,
      startDate: new Date(p.startDate),
      endDate: new Date(p.endDate),
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  } catch (e) {
    return [];
  }
}

function saveLocalProjects(projects: Project[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(projects));
}

function getLocalTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_TASKS_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((t: any) => ({
      ...t,
      startDate: t.startDate ? new Date(t.startDate) : null,
      endDate: t.endDate ? new Date(t.endDate) : null,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    }));
  } catch (e) {
    return [];
  }
}

function saveLocalTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
}

// User Operations
export async function createOrUpdateUser(uid: string, data: Partial<User>): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        ...data,
        onboardingCompleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    }
  } catch {
    // Fallback silently if Firestore database is not yet created
  }
}

export async function getUserDoc(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      uid: snap.id,
      name: d.name || "",
      email: d.email || "",
      photoURL: d.photoURL || "",
      timezone: d.timezone || "UTC",
      onboardingCompleted: Boolean(d.onboardingCompleted),
      createdAt: d.createdAt ? fromTimestamp(d.createdAt) : new Date(),
      updatedAt: d.updatedAt ? fromTimestamp(d.updatedAt) : new Date(),
    };
  } catch (err) {
    return null;
  }
}

export async function updateUserOnboarding(uid: string, completed: boolean): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      onboardingCompleted: completed,
      updatedAt: serverTimestamp(),
    });
  } catch {
    // Fallback silently if Firestore database is not yet created
  }
}

// Project Operations
export async function createProject(data: CreateProjectInput & { userId: string }): Promise<string> {
  try {
    const ref = await addDoc(collection(db, "projects"), {
      userId: data.userId,
      title: data.title,
      description: data.description || "",
      startDate: toTimestamp(data.startDate),
      endDate: toTimestamp(data.endDate),
      progress: data.progress ?? 0,
      category: data.category || "Personal",
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (err) {
    console.warn("Firestore write fallback to local storage:", err);
    const localId = "prj_" + Date.now();
    const newPrj: Project = {
      id: localId,
      userId: data.userId,
      title: data.title,
      description: data.description || "",
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      progress: data.progress ?? 0,
      category: data.category || "Personal",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const current = getLocalProjects();
    saveLocalProjects([newPrj, ...current]);
    return localId;
  }
}

export async function updateProject(projectId: string, data: Partial<Project>): Promise<void> {
  try {
    const updates: Record<string, unknown> = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    if (data.startDate) updates.startDate = toTimestamp(data.startDate);
    if (data.endDate) updates.endDate = toTimestamp(data.endDate);
    delete updates.id;
    await updateDoc(doc(db, "projects", projectId), updates);
  } catch (err) {
    const current = getLocalProjects();
    const updated = current.map((p) =>
      p.id === projectId ? { ...p, ...data, updatedAt: new Date() } : p
    );
    saveLocalProjects(updated);
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  try {
    const tasksQ = query(collection(db, "tasks"), where("projectId", "==", projectId));
    const snap = await getDocs(tasksQ);
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(doc(db, "projects", projectId));
    await batch.commit();
  } catch (err) {
    const current = getLocalProjects();
    saveLocalProjects(current.filter((p) => p.id !== projectId));
    const tasks = getLocalTasks();
    saveLocalTasks(tasks.filter((t) => t.projectId !== projectId));
  }
}

export function subscribeToUserProjects(userId: string, callback: (projects: Project[]) => void) {
  let unsubFirestore: (() => void) | null = null;
  try {
    const q = query(
      collection(db, "projects"),
      where("userId", "==", userId)
    );
    unsubFirestore = onSnapshot(
      q,
      (snap) => {
        const projects: Project[] = snap.docs
          .map((d) => {
            const data = d.data();
            return {
              id: d.id,
              userId: data.userId,
              title: data.title,
              description: data.description,
              startDate: fromTimestamp(data.startDate),
              endDate: fromTimestamp(data.endDate),
              progress: Number(data.progress || 0),
              category: data.category,
              status: data.status || "active",
              createdAt: fromTimestamp(data.createdAt),
              updatedAt: fromTimestamp(data.updatedAt),
            };
          })
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        callback(projects);
      },
      (error) => {
        callback(getLocalProjects().filter((p) => p.userId === userId || userId.startsWith("demo")));
      }
    );
  } catch (err) {
    callback(getLocalProjects().filter((p) => p.userId === userId || userId.startsWith("demo")));
  }

  return () => {
    if (unsubFirestore) unsubFirestore();
  };
}

export function subscribeToSingleProject(projectId: string, callback: (project: Project | null) => void) {
  let unsubFirestore: (() => void) | null = null;
  try {
    const ref = doc(db, "projects", projectId);
    unsubFirestore = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          const local = getLocalProjects().find((p) => p.id === projectId) || null;
          callback(local);
          return;
        }
        const data = snap.data();
        callback({
          id: snap.id,
          userId: data.userId,
          title: data.title,
          description: data.description,
          startDate: fromTimestamp(data.startDate),
          endDate: fromTimestamp(data.endDate),
          progress: Number(data.progress || 0),
          category: data.category,
          status: data.status || "active",
          createdAt: fromTimestamp(data.createdAt),
          updatedAt: fromTimestamp(data.updatedAt),
        });
      },
      (error) => {
        console.warn("Firestore project listener fallback:", error);
        callback(getLocalProjects().find((p) => p.id === projectId) || null);
      }
    );
  } catch (err) {
    callback(getLocalProjects().find((p) => p.id === projectId) || null);
  }

  return () => {
    if (unsubFirestore) unsubFirestore();
  };
}

// Task Operations
export async function createTask(data: CreateTaskInput & { userId: string }): Promise<string> {
  try {
    const ref = await addDoc(collection(db, "tasks"), {
      userId: data.userId,
      projectId: data.projectId,
      title: data.title,
      startDate: data.startDate ? toTimestamp(data.startDate) : null,
      endDate: data.endDate ? toTimestamp(data.endDate) : null,
      progress: data.progress ?? 0,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (err) {
    const localId = "task_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);
    const newTask: Task = {
      id: localId,
      userId: data.userId,
      projectId: data.projectId,
      title: data.title,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      progress: data.progress ?? 0,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const current = getLocalTasks();
    saveLocalTasks([...current, newTask]);
    return localId;
  }
}

export async function updateTask(taskId: string, data: Partial<Task>): Promise<void> {
  try {
    const updates: Record<string, unknown> = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    if (data.startDate !== undefined) updates.startDate = data.startDate ? toTimestamp(data.startDate) : null;
    if (data.endDate !== undefined) updates.endDate = data.endDate ? toTimestamp(data.endDate) : null;
    delete updates.id;
    await updateDoc(doc(db, "tasks", taskId), updates);
  } catch (err) {
    const current = getLocalTasks();
    const updated = current.map((t) =>
      t.id === taskId ? { ...t, ...data, updatedAt: new Date() } : t
    );
    saveLocalTasks(updated);
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
  } catch (err) {
    const current = getLocalTasks();
    saveLocalTasks(current.filter((t) => t.id !== taskId));
  }
}

export function subscribeToProjectTasks(projectId: string, callback: (tasks: Task[]) => void) {
  let unsubFirestore: (() => void) | null = null;
  try {
    const q = query(
      collection(db, "tasks"),
      where("projectId", "==", projectId)
    );
    unsubFirestore = onSnapshot(
      q,
      (snap) => {
        const tasks: Task[] = snap.docs
          .map((d) => {
            const data = d.data();
            return {
              id: d.id,
              userId: data.userId,
              projectId: data.projectId,
              title: data.title,
              startDate: data.startDate ? fromTimestamp(data.startDate) : null,
              endDate: data.endDate ? fromTimestamp(data.endDate) : null,
              progress: Number(data.progress || 0),
              status: data.status || "pending",
              createdAt: fromTimestamp(data.createdAt),
              updatedAt: fromTimestamp(data.updatedAt),
            };
          })
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        callback(tasks);
      },
      (error) => {
        callback(getLocalTasks().filter((t) => t.projectId === projectId));
      }
    );
  } catch (err) {
    callback(getLocalTasks().filter((t) => t.projectId === projectId));
  }

  return () => {
    if (unsubFirestore) unsubFirestore();
  };
}