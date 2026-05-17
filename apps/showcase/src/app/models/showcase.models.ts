export interface CurrentComponent {
  name: string;
  tag: string;
  level: string;
  summary: string;
}

export interface ComponentVersion {
  version: string;
  status: string;
  releaseNotes: string;
  demoUrl: string;
  cdnUrl: string;
}

export interface ComponentHistory {
  name: string;
  tag: string;
  level: string;
  description: string;
  versions: ComponentVersion[];
}

export type FeedbackState = 'idle' | 'sent' | 'cancelled';

export type IvDialogElement = HTMLElement & {
  showModal: () => Promise<void>;
  close: (returnValue?: string) => Promise<void>;
};
