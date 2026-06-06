"use client";

import { create } from "zustand";

interface RelationshipFocusState {
  focusedIssueId: string | null;
  relatedIds: Set<string>;
  setFocus: (issueId: string, relatedIds: Set<string>) => void;
  clearFocus: () => void;
}

export const useRelationshipFocusStore = create<RelationshipFocusState>()(
  (set) => ({
    focusedIssueId: null,
    relatedIds: new Set<string>(),
    setFocus: (issueId, relatedIds) =>
      set({ focusedIssueId: issueId, relatedIds }),
    clearFocus: () =>
      set({ focusedIssueId: null, relatedIds: new Set<string>() }),
  }),
);
