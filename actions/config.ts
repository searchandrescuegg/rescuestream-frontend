"use server"

export async function getRtmpIngestUrl(): Promise<string> {
  return process.env.RTMP_INGEST_URL || "rtmp://localhost:1935"
}
