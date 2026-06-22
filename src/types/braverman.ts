export type BravermanNeurotransmitter =
  | 'dopamine'
  | 'acetylcholine'
  | 'gaba'
  | 'serotonin';

export type BravermanQuestionType =
  | 'dominant'
  | 'attention';

export type BravermanSourceBlock =
  | '1A'
  | '2A'
  | '3A'
  | '4A'
  | '1B'
  | '2B'
  | '3B'
  | '4B';

export type BravermanQuestion = {
  id: string;
  order: number;
  text: string;
  neurotransmitter: BravermanNeurotransmitter;
  type: BravermanQuestionType;
  sourceBlock: BravermanSourceBlock;
};

export type BravermanScores = {
  dominant: Record<BravermanNeurotransmitter, number>;
  attention: Record<BravermanNeurotransmitter, number>;
};

export type BravermanAttentionSeverity = 'low' | 'medium' | 'high';

export type BravermanArchetype =
  | 'Стратег'
  | 'Создатель'
  | 'Хранитель'
  | 'Исследователь';

export type BravermanResult = {
  completedAt: string;
  scores: BravermanScores;
  dominantProfile: BravermanNeurotransmitter;
  secondaryProfile: BravermanNeurotransmitter;
  oppositeProfile: BravermanNeurotransmitter;
  mainAttentionArea: BravermanNeurotransmitter;
  attentionSeverity: BravermanAttentionSeverity;
  motivationArchetype: BravermanArchetype;
  isMixedProfile: boolean;
};
