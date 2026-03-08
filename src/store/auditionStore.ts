import { create } from 'zustand'

export interface AuditionPreparation {
  id: string
  title: string
  selectedCharacter: string
  createdAt: string
  updatedAt: string
  lastPracticed?: string
  accuracy?: number
  totalSegments?: number
  masteredSegments?: number
}

export interface ScriptSegment {
  id: string
  preparationId: string
  characterName: string
  text: string
  orderIndex: number
  sceneLabel?: string
}

interface AuditionState {
  preparations: AuditionPreparation[]
  currentPreparation: AuditionPreparation | null
  segments: ScriptSegment[]
  setPreparations: (preps: AuditionPreparation[]) => void
  setCurrentPreparation: (prep: AuditionPreparation | null) => void
  setSegments: (segs: ScriptSegment[]) => void
  addPreparation: (prep: AuditionPreparation) => void
}

export const useAuditionStore = create<AuditionState>()((set) => ({
  preparations: [],
  currentPreparation: null,
  segments: [],
  setPreparations: (preparations) => set({ preparations }),
  setCurrentPreparation: (currentPreparation) => set({ currentPreparation }),
  setSegments: (segments) => set({ segments }),
  addPreparation: (prep) =>
    set((state) => ({ preparations: [prep, ...state.preparations] })),
}))
