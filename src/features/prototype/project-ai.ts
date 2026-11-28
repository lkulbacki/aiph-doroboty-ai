import { z } from "zod";

export const MAX_RECORDING_SECONDS = 60;
export const MAX_AUDIO_BYTES = 384_000;

const questionText = z.string().trim().min(1).max(500);
export const questionContextSchema = z
  .object({
    title: z.string().trim().max(200),
    brief: z.string().trim().max(12000),
    description: z.string().trim().max(12000),
  })
  .refine(({ brief, description }) => Boolean(brief || description));

export const questionsSchema = z.object({ questions: z.array(questionText).min(1).max(3) });

export const recordingSchema = z.object({
  format: z.enum(["webm", "ogg", "m4a"]),
  data: z
    .string()
    .min(4)
    .max((MAX_AUDIO_BYTES * 4) / 3)
    .refine((value) => value.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(value)),
});

export const transcriptSchema = z.object({ text: z.string().trim().min(1).max(12000) });
export const voiceAnalysisSchema = z.object({
  transcript: transcriptSchema.shape.text,
  summary: z.string().trim().min(1).max(1200),
});
export const projectVoiceSchema = recordingSchema.extend(voiceAnalysisSchema.shape);

export type Recording = z.infer<typeof recordingSchema>;
export type ProjectVoice = z.infer<typeof projectVoiceSchema>;

export const recordingMimeTypes = {
  webm: "audio/webm",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
} as const;

export function recordingUrl(recording: Recording) {
  return `data:${recordingMimeTypes[recording.format]};base64,${recording.data}`;
}
