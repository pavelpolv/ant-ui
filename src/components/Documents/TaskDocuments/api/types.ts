import type { ValueField } from '@/components/Documents/common/types';

export interface NewVersionRequest {
  versionData: { id: string } & Partial<Record<ValueField, string>>;
}
