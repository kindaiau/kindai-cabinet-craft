import { useState, useCallback, useRef } from "react";
import * as tus from "tus-js-client";
import { supabase } from "@/integrations/supabase/client";

export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "complete" | "error" | "paused";
  error?: string;
  filePath?: string;
}

interface UseResumableUploadOptions {
  bucket: string;
  onComplete?: (file: UploadingFile) => void;
  onError?: (file: UploadingFile, error: string) => void;
}

export function useResumableUpload({ bucket, onComplete, onError }: UseResumableUploadOptions) {
  const [uploads, setUploads] = useState<Map<string, UploadingFile>>(new Map());
  const tusUploads = useRef<Map<string, tus.Upload>>(new Map());

  const updateUpload = useCallback((id: string, updates: Partial<UploadingFile>) => {
    setUploads((prev) => {
      const next = new Map(prev);
      const existing = next.get(id);
      if (existing) next.set(id, { ...existing, ...updates });
      return next;
    });
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const ext = file.name.split(".").pop() || "bin";
    const filePath = `${session.user.id}/${Date.now()}-${id.slice(0, 8)}.${ext}`;

    const uploadingFile: UploadingFile = { id, file, progress: 0, status: "uploading", filePath };
    setUploads((prev) => new Map(prev).set(id, uploadingFile));

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    return new Promise<UploadingFile>((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
        retryDelays: [0, 1000, 3000, 5000, 10000],
        headers: {
          authorization: `Bearer ${session.access_token}`,
          "x-upsert": "true",
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: bucket,
          objectName: filePath,
          contentType: file.type || "application/octet-stream",
          cacheControl: "3600",
        },
        chunkSize: 6 * 1024 * 1024, // 6MB chunks
        onError: (error) => {
          const errMsg = error.message || "Upload failed";
          const failedFile = { ...uploadingFile, status: "error" as const, error: errMsg, progress: 0 };
          updateUpload(id, failedFile);
          tusUploads.current.delete(id);
          onError?.(failedFile, errMsg);
          reject(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const progress = Math.round((bytesUploaded / bytesTotal) * 100);
          updateUpload(id, { progress });
        },
        onSuccess: () => {
          const completedFile: UploadingFile = { ...uploadingFile, progress: 100, status: "complete", filePath };
          updateUpload(id, completedFile);
          tusUploads.current.delete(id);
          onComplete?.(completedFile);
          resolve(completedFile);
        },
      });

      tusUploads.current.set(id, upload);
      upload.findPreviousUploads().then((previousUploads) => {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }
        upload.start();
      });
    });
  }, [bucket, onComplete, onError, updateUpload]);

  const pauseUpload = useCallback((id: string) => {
    const upload = tusUploads.current.get(id);
    if (upload) {
      upload.abort();
      updateUpload(id, { status: "paused" });
    }
  }, [updateUpload]);

  const resumeUpload = useCallback((id: string) => {
    const upload = tusUploads.current.get(id);
    if (upload) {
      updateUpload(id, { status: "uploading" });
      upload.start();
    }
  }, [updateUpload]);

  const cancelUpload = useCallback((id: string) => {
    const upload = tusUploads.current.get(id);
    if (upload) upload.abort(true);
    tusUploads.current.delete(id);
    setUploads((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads((prev) => {
      const next = new Map(prev);
      for (const [id, u] of next) {
        if (u.status === "complete" || u.status === "error") next.delete(id);
      }
      return next;
    });
  }, []);

  return {
    uploads: Array.from(uploads.values()),
    uploadFile,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    clearCompleted,
    isUploading: Array.from(uploads.values()).some((u) => u.status === "uploading"),
  };
}
